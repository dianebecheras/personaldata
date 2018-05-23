var jsonfile = require('jsonfile')
var Jimp = require('jimp');
const commandLineArgs = require('command-line-args')
const Clarifai = require('clarifai');

const optionDefinitions = [
  { name: 'in', alias: 'i', type: String, defaultOption: '../img/img.jpg' },
  { name: 'out', alias: 'o', type: String, defaultOption: 'data.json' },
  { name: 'size', alias: 's', type: Number, defaultOption: 100 },
  { name: 'apikey', alias: 'k', type: String, defaultOption: 'XXX' }
]

const options = commandLineArgs(optionDefinitions)

const app = new Clarifai.App({
 apiKey: options.apikey
});

let p = options.in
let file = options.out
let size = options.size

async function sendImageToClarify(_img) {
  await _img.getBase64(mime, (err, imgData) => {
    if (err) throw err;
    app.models.predict(Clarifai.GENERAL_MODEL, {
      base64: imgData
    }).then(function(response) {
        console.log(response);
        return response;
      })
  });
}

Jimp.read(p, function(err, img){
  if (err) throw err;
  let w = img.bitmap.width
  let h = img.bitmap.height
  let mime = img.getMIME()

  let data = [];
  for (var j = 0; j < h; j += size) {
    var colData = [];
    for (var i = 0; i < w; i += size) {
      let _img = img.clone().crop(i, j, size, size)
      let response = sendImageToClarify(_img);
      colData.push(response);
    }
    data.push(colData);
  }

  jsonfile.writeFile(file, data, function (err) {
    console.log(['Writing to file ... ' + file].join());
    if (err) console.error(err)
  })
});
