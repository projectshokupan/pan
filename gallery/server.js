const app = require('express')()
const { JsonBox } = require('jsonbox-node')
const bodyParser = require('body-parser')
const check = require('check-types')
const sanitize = require('express-sanitizer');
const generate = require('nanoid/generate')
const axios = require('axios')
const config = require('./config')
const api = require("./api")
var port = process.env.PORT || 3003

app
  .use(sanitize())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200)
    }
    else {
      next()
    }
  })
  .use((req, res, next) => {
    var apiPrefix = `${api.otpw2}/authenticate`
    var uid = encodeURIComponent(req.body.uid)
    axios
      .get(`${apiPrefix}?token=${req.body.token}&uid=${uid}`)
      .then(results => {
        res.locals.user = results.data
        next()
      })
      .catch(err => res.status(401).end())
  })
  .post('/new', (req, res) => {
    // { name: "", css?: "" }
    const json = req.body
    if (Object.keys(json).length === 0) return res.status(400).end()
    if (
      check.any(
        check.map(
          {
            name: json.name,
            nameNotEmpty: json.name
          },
          {
            name: check.not.string,
            nameNotEmpty: check.emptyString
          }
        )
      )
    ) return res.status(400).end()
    const name = req.sanitize(json.name)
    const css = json.css || ""
    if (name.length > 30) return res.status(400).end()

    const jbn = new JsonBox();
    jbn
      .create({
        id: parseInt(generate('123456789', 16)),
        name: name,
        owner: res.locals.user,
        css: css,
        posts: []
      }, config.boxId)
      .then(gallery => res.json({ id: gallery.id }))
  })
  .post('/post', (req, res) => {
    // { gallery: 0, no: 0 }
    const json = req.body
    if (Object.keys(json).length === 0) return res.status(400).end()
    if (
      check.any(
        check.map(
          { gallery: json.gallery, no: json.no },
          { gallery: check.not.integer, no: check.not.integer }
        )
      )
    ) return res.status(400).end()
    
    const gallery = json.gallery
    const no = json.no
    var img, ext

    const jbn = new JsonBox();
    jbn
      .read(config.postBoxId, undefined, { query: `no:=${no}` })
      .then(results => {
        if (results.length == 0) throw new Error('404')
        if (!results[0].img) throw new Error('400')
        img = results[0].img
        ext = results[0].ext
      })
      .then(() => jbn.read(config.boxId, undefined, { query: `id:=${gallery}` }))
      .then(results => {
        if (results.length === 0) throw new Error('404')
        if (results[0].owner != res.locals.user) throw new Error('401')
        results[0].posts.push(`${img}${ext}`)
        jbn.update(results[0], config.boxId, results[0]._id)
      })
      .then(() => res.end())
      .catch(code => res.sendStatus(parseInt(code.message)))
  })
  .listen(port)