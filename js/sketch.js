const app = new Clarifai.App({
  apiKey: 'b4c34657e0a448819177a1c9b923481e'
});

var img;
var crop;
var isSpeaking = false;

var textData = [];
var fontRegular;

var msg = new SpeechSynthesisUtterance(' ');
msg.voice = window.speechSynthesis.getVoices()[1];
window.speechSynthesis.speak(msg);

var a = 0;
var isFading = false;

var circles = [];





function preload() {
  var imgs = ["img01.jpg", "img02.jpg", "img03.jpg", "img04.jpg", "img05.jpg", "img06.jpg", "img07.jpg", "img08.jpg", "img09.jpg", "img10.jpg", "img11.jpg", "img12.jpg", "img13.jpg", "img14.jpg"]
  var path = 'img/';
  var fullPaths = [];
  for (var i = 0; i < imgs.length; i++) {
    var fullPath = path + imgs[i];
    fullPaths.push(fullPath);
  }
  imgs = fullPaths;

  var randIdx = Math.floor(Math.random() * imgs.length);
  img = loadImage(imgs[randIdx]);
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


The machine analyses the rectangle around where you click

  */

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

  if (isFading) {
    tint(255, 255, 255, a++);
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
  var s = 120;
  crop = img.get(mouseX - s / 2, mouseY - s / 2, s, s);

  circles.push({
    'x': mouseX,
    'y': mouseY,
    'r': 0
  });


  if (crop) {
    crop.loadPixels();
    var imgData = crop.canvas.toDataURL().substring(22);

    sendBase64ToClarifai(imgData, mouseX - s / 2, mouseY - s / 2);
  } else {
    console.log("CROP IS NULL")
  }
}





function sendBase64ToClarifai(imgData, posX, posY) {
  isSpeaking = true;

  app.models.predict(Clarifai.GENERAL_MODEL, {
    base64: imgData
  }).then(
    function(response) {
      console.log(response);

      var mot = response.outputs[0].data.concepts[1].name;
      var msg = new SpeechSynthesisUtterance(mot);
      msg.voice = window.speechSynthesis.getVoices()[1];

      window.speechSynthesis.speak(msg);

      msg.onerror = function(event) {
        console.log('An error has occurred with the speech synthesis: ' + event.error);
        isSpeaking = false;

      }

      msg.onend = function(e) {
        isSpeaking = false;

      }

      console.log(mot);

      var txtData = {
        'x': posX,
        'y': posY,
        'mot': mot
      };

      textData.push(txtData);

    },

    function(err) {


      console.log("Error happened");
      console.log(err);
    }
  );
}
