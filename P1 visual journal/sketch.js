let images = []; // 로드된 이미지들을 담을 배열
let mode = 'calm'; // 기본 모드 (URL 파라미터가 없으면 calm)

// result.html의 IMAGE_SOURCES와 동일한 매핑
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

// 로컬스토리지 값 가져오기 헬퍼 함수
function getMealAssignment(mealType) {
  let value = localStorage.getItem(`mealAssignment_${mealType}`);
  // 유효한 값이 아니면 medium으로 처리
  if (value !== 'small' && value !== 'medium' && value !== 'large') {
    value = 'medium';
  }
  return value;
}

function preload() {
  // 1. URL 파라미터 파싱
  let params = getURLParams();
  if (params.mode) mode = params.mode;

  let todoVal = params.todo || 'high';
  // p5.js에서 배열 파라미터 가져오기 위한 우회 방법
  const urlObj = new URL(window.location.href);
  const exerciseVals = urlObj.searchParams.getAll('exercise');
  
  let relVal = parseInt(params.relationship || '50', 10);
  let relKey = (relVal <= 33) ? 'low' : (relVal <= 66) ? 'medium' : 'high';

  // 2. 이미지 로드 (result.html의 좌표 x, y 그대로 사용)
  
  // (1) To-do
  if (IMAGE_MAP.todo[todoVal]) {
    images.push({ 
      img: loadImage(IMAGE_MAP.todo[todoVal]), 
      x: 250, y: 250 
    });
  }

  // (2) Exercise
  if (exerciseVals.includes('workout')) {
    images.push({ 
      img: loadImage(IMAGE_MAP.exercise.workout), 
      x: 300, y: 300 
    });
  }
  if (exerciseVals.includes('water')) {
    images.push({ 
      img: loadImage(IMAGE_MAP.exercise.water), 
      x: 300, y: 300 
    });
  }

  // (3) Relationship
  images.push({ 
    img: loadImage(IMAGE_MAP.relationship[relKey]), 
    x: 300, y: 300 
  });

  // (4) Meals
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('breakfast')) {
    let assign = getMealAssignment('breakfast');
    images.push({ img: loadImage(IMAGE_MAP.meals[assign]), x: 340, y: 340 });
  }
  if (urlParams.has('lunch')) {
    let assign = getMealAssignment('lunch');
    images.push({ img: loadImage(IMAGE_MAP.meals[assign]), x: 340, y: 340 });
  }
  if (urlParams.has('dinner')) {
    let assign = getMealAssignment('dinner');
    images.push({ img: loadImage(IMAGE_MAP.meals[assign]), x: 340, y: 340 });
  }
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER); // 이미지를 중심점 기준으로 그리기
  noStroke();
}

function draw() {
  clear(); // 배경 투명하게 (또는 background('#fefee5');)
  blendMode(MULTIPLY); // 색상 섞임 효과

  // ---------------------------------------------------------
  // 1. 모드별 움직임 속도(speed)와 범위(amp) 설정
  // ---------------------------------------------------------
  let speed = 0.01; // 기본값
  let amp = 5;      // 기본값

  if (mode === 'active') {
    speed = 0.05; amp = 15;
  } else if (mode === 'calm') {
    speed = 0.01; amp = 5;
  } else if (mode === 'love') {
    speed = 0.1; amp = 0;   // Love는 위치 이동보다 두근거림(Scale) 위주
  } else if (mode === 'chaos') {
    speed = 0.05; amp = 10; // Chaos는 빠르고 범위도 있음
  }
  // angry는 아래에서 따로 처리

  // ---------------------------------------------------------
  // 2. 이미지 그리기 반복문
  // ---------------------------------------------------------
  for (let i = 0; i < images.length; i++) {
    let item = images[i];
    
    // [중요] push()로 시작해야 이전 이미지의 변형이 다음 이미지에 영향을 안 줍니다.
    push(); 
    
    // (A) 위치 이동 계산 (Translate)
    let offsetX = 0;
    let offsetY = 0;

   if (mode === 'angry') {
  // 화남: 거친 진동
      offsetX = random(-5, 5);
      offsetY = random(-5, 5);
    } else if (mode === 'anxious') {
      // 불안: 초조하게 덜덜 떨림 (범위는 작게)
      offsetX = random(-2, 2);
      offsetY = random(-2, 2);
    
  // 나머지 Wave 움직임 ...
    } else {
      // 나머지 모드: 물결처럼 부드러운 파동
      // Love 모드일 때 amp가 0이면 움직이지 않음 (의도된 바)
      offsetX = cos(frameCount * speed + i) * amp;
      offsetY = sin(frameCount * speed + i) * amp;
    }

    // 계산된 위치로 좌표축 이동
    translate(item.x + offsetX, item.y + offsetY);


    // (B) 회전, 크기, 필터 효과 적용
    if (mode === 'active') {
      // 활기참: 살짝 흔들거리며 회전
      rotate(sin(frameCount * 0.02 + i) * 0.1);
      noTint();

    } else if (mode === 'angry') {
      // 화남: 붉은색 + 거칠게 회전
      rotate(random(-0.1, 0.1));
      tint(255, 100, 100); 

    } else if (mode === 'love') {
      // 💕 설렘 (Love): 핑크색 + 쿵닥쿵닥 심장박동 (Scale)
      // 납작해지지 않도록 가로/세로 비율을 동일하게(scale 1개 값) 줍니다.
      let beat = 1 + sin(frameCount * 0.15) * 0.1; // 0.15 속도로 1.0 ~ 1.1 배 크기 변화
      scale(beat); 
      tint(255, 200, 220); // 사랑스러운 핑크빛

    } else if (mode === 'chaos') {
      // 🌀 혼란 (Chaos): 보라색 + 울렁거림 + 회전
      // [납작해짐 해결 포인트] shear 값을 너무 크게 주면 이미지가 종이처럼 접혀 보입니다.
      // 값을 0.3 -> 0.1~0.2 수준으로 낮춰서 '살짝 찌그러짐' 정도로 조절했습니다.
      let shearVal = sin(frameCount * 0.05 + i) * 0.15; 
      
      shearX(shearVal); // 가로 비틀기
      rotate(frameCount * 0.01); // 빙글빙글 회전
      tint(200, 180, 255); // 몽환적인 보라빛

      } else if (mode === 'anxious') {
        speed = 0.5; amp = 2; // 속도는 매우 빠르고, 범위는 작게 (떨림)
        tint(200, 255, 200); // 창백한 연두빛
  
        // 크기도 미세하게 계속 변함 (긴장감)
        let nervousScale = 0.95 + random(0.1); 
        scale(nervousScale);

    } else {
      // calm (기본): 효과 없음, 원래 색
      noTint();
    }

    // (C) 이미지 그리기
    // result.html과 동일하게 300x300 크기로 그립니다.
    // 이미 좌표를 translate로 옮겼으므로 (0, 0)에 그립니다.
    image(item.img, 0, 0, 300, 300);

    // [중요] pop()으로 끝내야 변형 효과가 초기화됩니다.
    pop(); 
  }

  blendMode(BLEND);
}

// 녹화버튼

function saveVideo() {
  // 1. 현재 화면에 있는 캔버스 찾기
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    alert('캔버스를 찾을 수 없습니다.');
    return;
  }

  // 2. 버튼 스타일 변경 (녹화 중임을 알림)
  const btn = document.getElementById('record-btn');
  if (btn) {
    btn.innerText = '🔴 Recording... (wait for a sec!)';
    btn.style.backgroundColor = 'red';
    btn.disabled = true; // 중복 클릭 방지
  }

  // 3. 녹화 시작 (MediaRecorder API 사용)
  // 초당 30프레임으로 캡처
  const stream = canvas.captureStream(30); 
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  // 데이터가 모이면 배열에 저장
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  // 녹화가 멈추면 파일로 만들어서 다운로드
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    // 다운로드 링크 생성 및 클릭
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-emotion-${mode}.webm`; // 파일명: my-emotion-love.webm 등
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // 버튼 원래대로 복구
    if (btn) {
      btn.innerText = '🎥 Save your emotion ';
      btn.style.backgroundColor = '#333';
      btn.disabled = false;
    }
  };

  // 녹화 시작
  recorder.start();

  // 4. 5초(5000ms) 뒤에 자동으로 녹화 종료
  setTimeout(() => {
    recorder.stop();
  }, 5000);
}