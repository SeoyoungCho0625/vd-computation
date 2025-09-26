function setup() {
  createCanvas(800, 800);
  background('#302A38');
  noStroke();
}


function draw() {
background(mouseY/2.35);


  //face
  fill('#61B45F');
  circle(341,230,230);

  // ears
  fill('#B18D43');
  circle(293,86,136);
  circle(191,188,150);


  //eyes
  fill('white');
  circle(366,205,44);
  circle(417,205,44);


  //mouth
  fill('red');
  circle(390,260,55);  
  
  //body
  circle(384,443,220);    

  //buttons
  fill('black');
  circle(463,405,48);
  circle(413,424,48);

  //feet
  fill('yellow');
  circle(169,600,120);
  circle(410,679,120);
}

