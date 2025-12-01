let images = []; // 로드된 이미지들을 담을 배열
let mode = 'calm'; // 기본 모드
let canvasSize = 600; // 캔버스 크기

// 이미지 파일 경로 매핑 (result.html의 IMAGE_SOURCES와 동일하게 맞춤)
const IMAGE_MAP = {
  meals: {
    'small': 'meal1.png',
    'medium': 'meal2.png',
    'large': 'meal3.png'
  },
  todo: {
    'high': 'todo2.png',
    'medium': 'todo1.png',
    'low': 'todo3.png'
  },
  exercise: {
    'workout': 'workout1.png',
    'water': 'water1.png'
  },
  relationship: {
    'low': 'relationship1.png',
    'medium': 'relationship2.png',
    'high': 'relationship3.png'
  }
};

// 헬퍼 함수: 로컬스토리지 값 가져오기 (result.html과 동일 로직)
function getMealAssignment(mealType) {
  let value = localStorage.getItem(`mealAssignment_${mealType}`);
  if (value !== 'small' && value !== 'medium' && value !== 'large') {
    value = 'medium';
  }
  return value;
}

function preload() {
  // 1. URL 파라미터 파싱
  let params = getURLParams(); // p5.js 내장 함수
  
  if (params.mode) mode = params.mode;

  let todoVal = params.todo || 'high';
  // exercise는 여러 개일 수 있으므로 배열로 처리 필요하지만, 
  // p5의 getURLParams는 중복 키를 하나만 가져오는 경우가 있어 직접 파싱
  const urlObj = new URL(window.location.href);
  const exerciseVals = urlObj.searchParams.getAll('exercise');
  
  let relVal = parseInt(params.relationship || '50', 10);
  let relKey = (relVal <= 33) ? 'low' : (relVal <= 66) ? 'medium' : 'high';

  // 2. 이미지 로드 리스트 작성
  // (result.html의 좌표: todo(250,250), exercise/rel(300,300), meals(340,340))
  // p5.js에서는 이미지를 중심 기준으로 그리기 위해 imageMode(CENTER)를 쓸 예정입니다.
  
  // (1) To-do
  if (IMAGE_MAP.todo[todoVal]) {
    images.push({ 
      img: loadImage(IMAGE_MAP.todo[todoVal]), 
      x: 250, y: 250, 
      type: 'todo' 
    });
  }

  // (2) Exercise
  if (exerciseVals.includes('workout')) {
    images.push({ 
      img: loadImage(IMAGE_MAP.exercise.workout), 
      x: 300, y: 300, 
      type: 'exercise' 
    });
  }
  if (exerciseVals.includes('water')) {
    images.push({ 
      img: loadImage(IMAGE_MAP.exercise.water), 
      x: 300, y: 300, 
      type: 'exercise' 
    });
  }

  // (3) Relationship
  images.push({ 
    img: loadImage(IMAGE_MAP.relationship[relKey]), 
    x: 300, y: 300, 
    type: 'relationship' 
  });

  // (4) Meals (파라미터에 있는지 확인 후 로드)
  // p5.js에서 URLSearchParams를 직접 쓰기 위해 window 객체 사용
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('breakfast')) {
    let assign = getMealAssignment('breakfast');
    images.push({ img: loadImage(IMAGE_MAP.meals[assign]), x: 340, y: 340, type: 'meal' });
  }
  if (urlParams.has('lunch')) {
    let assign = getMealAssignment('lunch');
    images.push({ img: loadImage(IMAGE_MAP.meals[assign]), x: 340, y: 340, type: 'meal' });
  }
  if (urlParams.has('dinner')) {
    let assign = getMealAssignment('dinner');
    images.push({ img: loadImage(IMAGE_MAP.meals[assign]), x: 340, y: 340, type: 'meal' });
  }
}

function setup() {
  createCanvas(600, 600); // result.html 캔버스 크기와 동일
  imageMode(CENTER);      // 좌표를 이미지의 중심점으로 설정
  noStroke();
}

function draw() {
  clear(); // 배경 투명하게 지우기 (또는 background(255)로 흰색 설정)
  // background('#fff'); // 필요하면 주석 해제

  // 혼합 모드 설정 (result.html의 blendMode: 'multiply' 효과)
  blendMode(MULTIPLY);

  // 모드에 따른 움직임 파라미터 설정
  let speed = (mode === 'active') ? 0.05 : 0.01; 
  let amp = (mode === 'active') ? 15 : 5;       // 움직임 범위

  // 로드된 모든 이미지 그리기
  for (let i = 0; i < images.length; i++) {
    let item = images[i];
    
    // 각 이미지마다 고유한 움직임 주기 (i를 더해서 서로 다른 타이밍에 움직이게 함)
    let offsetX = cos(frameCount * speed + i) * amp;
    let offsetY = sin(frameCount * speed + i) * amp;
    
    // active 모드일 때는 약간의 회전도 추가
    push();
    translate(item.x + offsetX, item.y + offsetY);
    
    if (mode === 'active') {
      rotate(sin(frameCount * 0.02 + i) * 0.1); // 살짝 흔들거림
    }

    // 이미지를 300x300 크기로 그림 (result.html의 fixedSize와 동일)
    // 원본 위치값은 result.html에서 중앙점 기준이 아니라 좌상단 기준이었을 수 있으나,
    // 여기서는 translate와 imageMode(CENTER)를 조합해 자연스럽게 배치
    // result.html 로직: x - (size/2) 였으므로, p5의 imageMode(CENTER)와 item.x 그대로 쓰면 위치 얼추 맞음
    image(item.img, 0, 0, 300, 300);
    
    pop();
  }

  // 기본 블렌드 모드로 복귀 (필요 시)
  blendMode(BLEND);
}