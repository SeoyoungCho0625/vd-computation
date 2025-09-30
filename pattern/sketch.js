const GRID = 15;
const CELL = 1080 / GRID;
let isDaytime = false;

function setup() {
 createCanvas(1080, 1080);
 noStroke();
 frameRate(7);

 

 const currentHour = hour();
  isDaytime = (currentHour >= 7 && currentHour < 19);
}

function draw() {
 background(255, 255, 220);
 const cz = random(80, CELL);
 const sz = random(80, CELL);

 if (isDaytime == true) {
    background('#fcf9d2ff'); 
  } else {
    background('#000022'); 
  }

 for (let gy = 0; gy < GRID; gy++) {

   for (let gx = 0; gx < GRID; gx++) {
     const cx = gx * CELL + CELL / 2;
     const cy = gy * CELL + CELL / 2;

     // cy + 270

     push();
     blendMode(MULTIPLY);
     fill('orange');
     circle(cx, cy, cz);
     pop();

     push();
     blendMode(MULTIPLY);
     translate(cx, cy);
     fill('cyan');
     rectMode(CENTER);
     rect(0, 0, sz, sz);
     pop();

     push();
     translate(width/2, height/2); // move origin to canvas center
     rotate(random(TWO_PI));       // random rotation
      const s = random(300, 500);   // side length
      const h = (sqrt(3) / 2) * s;  // height of equilateral triangle
      fill('coral'); 
      triangle(-s/2, h/3, s/2, h/3, 0, -2*h/3);
      pop();


   }
 }
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 5);
  }
}
