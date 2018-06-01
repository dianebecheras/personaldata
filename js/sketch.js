const app = new Clarifai.App({
  apiKey: 'b4c34657e0a448819177a1c9b923481e'
});

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
// data.data.concepts

var circles = [];

function preload() {
  // img files end in jpg, data files end in json
  var files = ["img01", "img02", "img03", "img04", "img05", "img06", "img07",
               "img08", "img09", "img10", "img11", "img12", "img13", "img14"]
  var img_path = 'img/';
  var data_path = 'data/';

  var data = [];

  for (var i = 0; i < files.length; i++) {
    data.push({'img': img_path + files[i] + '.jpg', 'data': data_path + files[i] + '.json'});
  }

  var randIdx = Math.floor(Math.random() * data.length);
  img = loadImage(data[randIdx].img);
  console.log(data[randIdx].data)
  d = loadJSON(data[randIdx].data);

  fontRegular = loadFont('regular.ttf');
}

function setup() {

  //createCanvas();
  var canvas = document.createElement('canvas');
  canvas.width = div.clientWidth;
  canvas.height = div.clientHeight;
  ellipseMode(CENTER); // Set ellipseMode to CENTER
  console.clear();
  console.log("CLICK to see what the computer understands \n Pictures are revealed at the end \n\n\n The machine analyses the rectangle around where you click ")

  /*

CLICK to see what the computer
understands
Pictures are revealed at the end

  concepts = d.concepts;
  rows = concepts.length;
  cols = concepts[0].length;

  console.log('rows ' + rows);
  console.log('cols ' + cols);

  console.log(concepts);

  frameRate(30);

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

  if (isFading) {
    a = a + 1;
    tint(255, 255, 255, a);
    if (a >= 300) {
      document.location.reload(true);
    }

    image(img, 0, 0);
  }

  stroke(0, 0, 0, 255);

  noFill();
  strokeWeight(0);

  for (var i = 0; i < textData.length; i++) {
    var txtData = textData[i];
    fill(0, 0, 0);
    text(txtData.mot, txtData.x, txtData.y);
  }
  strokeWeight(1);

  for (var i = circles.length - 1; i >= 0; i--) {
    var circle = circles[i];

    stroke(0, 0, 0, 1 / circle.r * 2000);
    noFill();

    circle.r += 4;
    ellipse(circle.x, circle.y, circle.r, circle.r);

    if (circle.r > 400) {
      circles.splice(i, 1);
    }
  }

  if (textData.length >= 80) {
    fadeIn();
  }
}

function mousePressed() {

  // get concept
  var x = Math.floor(mouseX / s);
  var y = Math.floor(mouseY / s);

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
  //msg.voice = window.speechSynthesis.getVoices()[1];

  // window.speechSynthesis.speak(msg);

  // msg.onerror = function(event) {
  //   console.log('An error has occurred with the speech synthesis: ' + event.error);
  //   isSpeaking = false;
  // }

  // msg.onend = function(e) {
  //   isSpeaking = false;
  // }

  textData.push({'mot': concept, 'x': mouseX, 'y': mouseY});
}
