const app = require('express')()
const s3 = require('@auth0/s3')
const busboy = require('express-busboy')
const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))
const axios = require('axios')
const config = require('./config')
const api = require('./api')
const path = require('path')
const os = require('os')

busboy.extend(app, {
  upload: true,
  limits: {
    fileSize: 8000000,
    files: 1  
  }
})

var client = s3.createClient({
  s3Options: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secret,
    region: "us-east-2"
  },
});

function requireAuth(req, res, next) {
  var apiPrefix = `${api.otpw2}/authenticate`
  var uid = encodeURIComponent(req.body.uid)
  axios
    .get(`${apiPrefix}?token=${req.body.token}&uid=${uid}`)
    .then(results => {
      res.locals.user = results.data
      next()
    })
    .catch(err => res.status(401).end())
}
app
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept")
    next()
  })
  .post('/post', requireAuth, (req, res) => {
    // [ "image": <file> ]
    var files = req.files
    if (Object.keys(files).length === 0) return res.status(400).end()
    if (files.image.truncated == true) return res.status(400).end()
    
    sizeOf(files.image.file)
      .then(d => {
        if (d.width > 10000 || d.height > 10000) {
          res.status(400).end()
          throw new Error();
        }
      })
      .then(() => {
        var imageKey = `${(new Date()).getTime()}${path.extname(files.image.file)}`
        client
          .uploadFile({
            localFile: files.image.file,
            s3Params: { 
              Bucket: "pancdn",
              Key: imageKey
            }
          })
        return imageKey
      })
      .then(key => res.json({ key: key }))
      .catch(err => res.status(400).end())
  })
  .get('/*', (req, res) => {
    var key = path.basename(req.originalUrl)
    var downloadFolder = path.join(os.tmpdir(), key)
    client
      .downloadFile({
        localFile: downloadFolder,
        s3Params: {
          Bucket: "pancdn",
          Key: key
        }
      })
      .on('end', () => {
        res.setHeader('Cache-Control', 'max-age=31536000, public')
        res.sendFile(downloadFolder)
      })
      .on('error', function(err) {
        res.status(404).send("Not found.")
      })
  })
  .listen(process.env.PORT || 3002)