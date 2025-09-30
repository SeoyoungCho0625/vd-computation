const GRID = 2;
const CELL = 1080 / GRID;

function setup() {
 createCanvas(1080, 1080);
 noStroke();
 // frameRate(2);
 noLoop();
}

function draw() {
 background(255, 255, 220);
 const cz = random(40, CELL);
 const sz = random(40, CELL);

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
     fill('pink');
     rectMode(CENTER);
     rect(0, 0, sz, sz);
     pop();
   }
 }
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 5);
  }
}