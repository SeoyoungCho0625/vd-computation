let characterWidth = 400;
let characterHeight = 400;

// 초기 설정: 캔버스 크기와 기본 속성 설정
function setup() {
    createCanvas(characterWidth, characterHeight);
    noStroke(); // 모든 도형의 외곽선(테두리)을 없앱니다.
    rectMode(CENTER); // 사각형을 그릴 때 중심 좌표 기준으로 설정합니다.
}

// 드로잉 루프: 초당 60회 반복 실행됩니다.
function draw() {
    // 1. 배경 (그라데이션 사각형)
    // 배경은 draw 함수 내에서 매번 다시 그려야 깜빡임이 없습니다.
    for (let y = 0; y < height; y++) {
        let r = map(y, 0, height, 255, 0); // Y축에 따라 빨간색(255)에서 검은색(0)으로
        let g = map(y, 0, height, 99, 0);
        let b = map(y, 0, height, 71, 0);
        stroke(r, g, b); // 선 색깔을 지정
        line(0, y, width, y); // 가로 선을 하나씩 그려서 그라데이션을 만듭니다.
    }
    noStroke(); // 다시 외곽선을 끕니다.

    // 캐릭터의 중심을 캔버스 중앙으로 가정하고 배치합니다. (x: 200, y: 200)
    let centerX = width / 2;

    // --- 2. 몸통 (둥근 사각형 + 흰색 원) ---
    // (캐릭터의 레이어 순서를 고려해 가장 먼저 그립니다.)
    
    // 몸통 (녹색 둥근 사각형)
    fill(160, 211, 85); // 연두색 (#A0D355)
    rect(centerX, 280, 140, 140, 70, 70, 30, 30); // x, y, width, height, TL, TR, BR, BL

    // 배 (흰색 원)
    fill(255); // 흰색
    circle(centerX, 280, 60); // x, y, 지름

    // --- 3. 머리 (원형) ---
    
    // 귀 (황토색 둥근 사각형)
    fill(192, 127, 55); // 황토색 (#C07F37)
    // 왼쪽 귀
    push();
    translate(centerX - 80, 100);
    rotate(radians(-10));
    rect(0, 0, 30, 60, 15); // x, y, width, height, radius
    pop();
    // 오른쪽 귀
    push();
    translate(centerX + 80, 100);
    rotate(radians(10));
    rect(0, 0, 30, 60, 15);
    pop();

    // 머리 (연두색 원)
    fill(160, 211, 85); // 연두색 (#A0D355)
    circle(centerX, 120, 160); // x, y, 지름

    // --- 4. 얼굴 요소 ---
    
    // 모자/띠 (베이지색 사각형)
    fill(238, 221, 153); // 베이지색 (#EEDD99)
    rect(centerX, 60, 170, 15, 10); // x, y, width, height, radius

    // 눈 가리개/코 (어두운 연두색 둥근 사각형)
    fill(85, 119, 51); // 어두운 연두색 (#557733)
    rect(centerX, 130, 80, 30, 15); // x, y, width, height, radius
    
    // 눈 (흰색 원)
    fill(255); // 흰색
    circle(centerX - 45, 120, 40); // 왼쪽 눈
    circle(centerX + 45, 120, 40); // 오른쪽 눈
    
    // 입 (연분홍색 사각형)
    fill(248, 187, 208); // 연분홍색 (#F8BBD0)
    rect(centerX, 175, 25, 10, 5); // x, y, width, height, radius

    // 수염/턱 (흰색 삼각형)
    fill(255); // 흰색
    triangle(
        centerX - 15, 185, // 왼쪽 꼭짓점
        centerX + 15, 185, // 오른쪽 꼭짓점
        centerX, 200        // 아래쪽 꼭짓점 (역삼각형)
    );
}

// 참고: p5.js에서는 stroke()와 noStroke()를 사용하여 테두리를 제어합니다.
// 테두리를 추가하려면 fill() 전에 stroke(0) (검은색)를 추가하고,
// stroke(4)로 두께를 설정하면 됩니다.