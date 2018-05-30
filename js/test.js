// todo - check if the calculations are ok

var concepts;
var cols = 0;
var rows = 0;
var d;
var isSpeaking = false;

var textData = [];
var fontRegular;
var s = 100;


var msg = new SpeechSynthesisUtterance(' ');
msg.voice = window.speechSynthesis.getVoices()[1];
window.speechSynthesis.speak(msg);

var a = 0;
var isFading = false;

var circles = [];

function preload() {
  var files = ["img01", "img02", "img03", "img04", "img05", "img06", "img07",
               "img08", "img09", "img10", "img11", "img12", "img13", "img14"]
  var img_path = 'img/';
  var data_path = 'data/';

  var data = [];

  for (var i = 0; i < files.length; i++) {
    data.push({'img': img_path + files[i] + '.jpg', 'data': data_path + files[i] + '.json'});
  }

  var randIdx = Math.floor(Math.random() * data.length);
  randIdx = 6;

  img = loadImage(data[randIdx].img);
  console.log(data[randIdx].data)
  d = loadJSON(data[randIdx].data);

  fontRegular = loadFont('regular.ttf');
}

function setup() {
  createCanvas(1024, 767);
  ellipseMode(CENTER);

  concepts = d.concepts;
  rows = concepts.length;
  cols = concepts[0].length;

  console.log('rows ' + rows);
  console.log('cols ' + cols);

  console.log(concepts);

  frameRate(20);

  fill('rgba(255, 255, 255)');
  rect(0, 0, width, height);
  fill(0)
    .textSize(15);
  textFont(fontRegular);
  text('Font Style Normal');
}

function fadeIn() {
  isFading = true;
}

function keyPressed() {
  if (keyCode === RETURN) {
    fadeIn();
  }
}

function draw() {
  background(255);

  // if (isFading) {
  //   a = a + 1;
  //   tint(255, 255, 255, a);
  //   if (a >= 300) {
  //     document.location.reload(true);
  //   }
  //
  //   image(img, 0, 0);
  // }
  tint(255, 0, 255, 125)
  image(img, 0, 0);

  stroke(255);
  noFill();
  strokeWeight(1);

  textAlign(CENTER);
  for (var c = 0; c < cols; c++) {
    line(c * s, 0, c * s, height);
    for (var r = 0; r < rows; r++) {
      line(0, r * s, width, r * s);
      text(concepts[r][c], c * s + s / 2, r * s + s / 2);
    }
  }


  stroke(0, 0, 0, 255);

  noFill();
  strokeWeight(0);

  for (var i = 0; i < textData.length; i++) {
    var txtData = textData[i];
    fill(0, 0, 0);
    console.log("draw " + txtData);
    text(txtData.mot, txtData.x + 50, txtData.y + 40, 1000, 1000); /////
  }
  strokeWeight(1);

  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];

    stroke(0, 0, 0, 1 / circle.r * 2000);
    noFill();

    circle.r += 5;
    ellipse(circle.x, circle.y, circle.r, circle.r);
  }

  if (textData.length >= 80) {
    fadeIn();
  }
}

function mousePressed() {

  // get concept
  var x = Math.floor(mouseX / width * cols);
  var y = Math.floor(mouseY / height * rows);

  console.log(x);
  console.log(y);
  // round down images

  x = constrain(x, 0, rows - 1);
  y = constrain(y, 0, height - 1);

  var concept = concepts[x][y];

  console.log(concept);

  circles.push({
    'x': mouseX,
    'y': mouseY,
    'r': 0
  });

  isSpeaking = true;

  var msg = new SpeechSynthesisUtterance(concept);
  msg.voice = window.speechSynthesis.getVoices()[1];

  window.speechSynthesis.speak(msg);

  msg.onerror = function(event) {
    console.log('An error has occurred with the speech synthesis: ' + event.error);
    isSpeaking = false;
  }

  msg.onend = function(e) {
    isSpeaking = false;
  }

  textData.push({'mot': concept, 'x': mouseX - s / 2, 'y': mouseY - s / 2});
}
