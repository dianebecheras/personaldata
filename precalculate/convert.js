var jsonfile = require('jsonfile')
var Jimp = require('jimp');
const commandLineArgs = require('command-line-args')
const Clarifai = require('clarifai');

const optionDefinitions = [
  { name: 'in', alias: 'i', type: String, defaultValue: '../img/img.jpg' },
  { name: 'out', alias: 'o', type: String, defaultValue: 'data.json' },
  { name: 'size', alias: 's', type: Number, defaultValue: 100 },
  { name: 'apikey', alias: 'k', type: String, defaultValue: 'b4c34657e0a448819177a1c9b923481e' }
]

const options = commandLineArgs(optionDefinitions)

const app = new Clarifai.App({
 apiKey: options.apikey
});
console.log('PATH IS ' + options.in)
let p = options.in
let file = options.out
let size = options.size

const makeRequest = async () => {
  const img = await Jimp.read(p)
  let w = img.bitmap.width
  let h = img.bitmap.height

  let data = [];
  for (var j = 0; j < h - size; j += size) {
    var colData = [];
    for (var i = 0; i < w - size; i += size) {
      const _img = img.clone().crop(i, j, size, size)
      const mime = _img.getMIME()
      const makeBase64 = (image) => new Promise(
            (res, rej)=>image.getBase64(image.getMIME(), (err,ret)=> err ? rej(err) : res(ret))
          )
      const _base64 = await makeBase64(_img)
      // strip data:image/png;base64,
      const imgData = _base64.substring(22);
      const response = await app.models.predict(Clarifai.GENERAL_MODEL, {base64: imgData});
      const concept = response.outputs[0].data.concepts[1].name;
      console.log('New concept: ' + concept);
      colData.push(concept);
    }
    data.push(colData);
  }

  const d = {'size': size,
            'file': options.in,
            'concepts': data
          }

  jsonfile.writeFile(file, d, function (err) {
    console.log(['Writing to file ... ' + file].join());
    if (err) console.error(err)
  })
}

makeRequest().catch(err => {
    console.log(err);
})
