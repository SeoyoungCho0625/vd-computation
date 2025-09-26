function setup() {
  createCanvas(600, 800);
  background('silver');
  noStroke();
}


function draw() {
background(mouseX/2.35);


  //face
  fill('#F4E2C2');
  circle(341,230,230);

  // ears
  fill('black');
  circle(293,86,136);
  circle(191,188,150);


  //eyes
  fill('black');
  circle(366,205,44);
  circle(417,205,44);
  fill('white');
  circle(355,195,11);
  circle(407,195,11);

  //nose
  fill('black');
  circle(468,244,66); 
  fill('white');
  circle(475,230,22); 

  //hands
  fill('#F4E2C2');
  circle(100,330,80);
  circle(450,330,80)


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

