const app = require('express')()
const bodyParser = require("body-parser")
const sanitize = require('express-sanitizer');
const config = require("./config")
const api = require("./api")
const check = require('check-types')
const { JsonBox } = require('jsonbox-node')
const axios = require('axios')
const generate = require('nanoid/generate')

let port = process.env.PORT || 3001

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
      res.sendStatus(200);
    }
    else {
      next();
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
  .post('/', (req, res) => {
    // { text : "", resto: 0, img: 0, ext?: "" }
    const json = req.body
    if (Object.keys(json).length === 0) return res.status(400).end()
    if (
      check.any(
        check.map(
          { 
            text: json.text,
            resto: json.resto,
            img: json.img,
            textString: json.text,
            restoInt: json.resto,
            imgInt: json.img
          },
          { 
            text: check.undefined,
            resto: check.undefined,
            img: check.undefined,
            textString: check.not.string,
            restoInt: check.not.integer,
            imgInt: check.not.integer
          }
        )
      )
    ) return res.status(400).end()
    const text = req.sanitize(json.text)
    const resto = json.resto
    const img = json.img
    const ext = json.ext || ""

    const jbn = new JsonBox();
    jbn
      .create({
        no: parseInt(generate('123456789', 16)),
        tno: parseInt(generate('123456789', 8)),
        owner: res.locals.user,
        text: text,
        resto: resto,
        img: img,
        ext: ext
      }, config.boxId)
      .then(results => res.json({no: results.no}))
  })
  .delete('/delete', (req, res) => {
    const json = req.body
    if (Object.keys(json).length === 0) return res.status(400).end()
    if (
      check.any(
        check.map(
          { no: json.no },
          { no: check.not.integer }
        )
      )
    ) return res.status(400).end()
    const no = json.no
    const jbn = new JsonBox()
    jbn
      .read(config.boxId, undefined, { query: `no:=${no}` })
      .then(results => {
        if (results.length === 0) throw new Error()
        if (results[0].owner != res.locals.user) {
          res.status(401).end()
          throw new Error()
        }
        jbn.delete(config.boxId, results[0]._id)
      })
      .then(() => res.end())
      .catch(() => res.status(404).end())
  })
  .listen(port)