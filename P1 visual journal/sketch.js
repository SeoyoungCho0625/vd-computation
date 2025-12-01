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

// [sketch.js] draw 함수 전체를 이것으로 교체하세요

function draw() {
  clear(); 
  // background('#fff'); // 필요 시 주석 해제

  blendMode(MULTIPLY);

  // 모드별 설정
  let speed, amp;

  if (mode === 'active') {
    speed = 0.05; 
    amp = 15;
  } else if (mode === 'calm') {
    speed = 0.01; 
    amp = 5;
  }
  // 'angry'는 불규칙한 움직임이라 위 변수 대신 아래에서 따로 처리합니다.

  for (let i = 0; i < images.length; i++) {
    let item = images[i];
    let offsetX = 0;
    let offsetY = 0;
    
    // --- [핵심] 움직임 계산 ---
    if (mode === 'angry') {
      // 1. 화난 무드: 격렬한 진동 (Shake)
      // 매 프레임마다 -5 ~ +5 사이의 랜덤한 위치로 튐
      offsetX = random(-5, 5); 
      offsetY = random(-5, 5);
    } else {
      // 2. 잔잔/활기찬 무드: 부드러운 파동 (Wave)
      offsetX = cos(frameCount * speed + i) * amp;
      offsetY = sin(frameCount * speed + i) * amp;
    }
    
    push();
    translate(item.x + offsetX, item.y + offsetY);
    
    // --- [핵심] 회전 및 효과 ---
    if (mode === 'active') {
      rotate(sin(frameCount * 0.02 + i) * 0.1); // 살짝 흔들
    } else if (mode === 'angry') {
      rotate(random(-0.1, 0.1)); // 거칠게 틱틱거리는 회전
      
      // (선택사항) 이미지를 붉게 만듦 (RGB값 조절: 빨간색은 그대로, 초록/파랑을 줄임)
      tint(255, 100, 100); 
    } else {
       noTint(); // 다른 모드일 때는 원래 색
    }

    image(item.img, 0, 0, 300, 300);
    
    pop();
  }

  blendMode(BLEND);
}