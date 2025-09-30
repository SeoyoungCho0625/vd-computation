function setup() {
  createCanvas(1080, 1080);
  noStroke();
  noLoop();
}

function draw(){
 background(2255,255,220);
 fill('orange');
 circle(width/2, height/2, random (300,500));

 translate(width/2, height/2);
 fill('pink');
 rectMode(CENTER);
 rect(0, 0, random (300,500));

 push();
  blendMode(MULTIPLY);
  fill('orange');
  circle(width/2, height/2, random(300,500));
  pop();

  push();
  blendMode(MULTIPLY);
  translate(width/2, height/2);
  fill('pink');
  rectMode(CENTER);
  const sz = random(300,500);
  rect(0, 0, sz, sz);
  pop();
}
