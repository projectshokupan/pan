var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config')
var api = require("./api")
var passwordless = require('passwordless');
//var passwordless = require('../../');

var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

var routes = require('./routes/index');

var app = express();

// TODO: email setup (has to be changed)
var yourEmail = config.mail;
var yourPwd = config.mailPassword;
var yourSmtp = config.mailHost;
var smtpServer  = email.server.connect({
   user:    yourEmail, 
   password: yourPwd, 
   host:    yourSmtp, 
   ssl:     true
});

// TODO: MongoDB setup (given default can be used)
var pathToMongoDb = config.dbUrl
// TODO: Path to be send via email

// Setup of Passwordless
passwordless.init(new MongoStore(pathToMongoDb), {allowTokenReuse:true});
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        // Send out token
        smtpServer.send({
           text:    'Hello. Click the link below to complete the login process: \n' 
                + api.host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend), 
           from:    yourEmail, 
           to:      recipient,
           subject: 'Login Verification'
        }, function(err, message) { 
            if(err) {
                console.log(err);
            }
            callback(err);
        });
    },
    { ttl: 8760 * 60 * 60 * 1000 }) // 1 year

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept")
    next()
})
// Standard express setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Passwordless middleware
app.use(passwordless.acceptToken());

// CHECK /routes/index.js to better understand which routes are needed at a minimum
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
