var express = require('express');
var router = express.Router();

var passwordless = require('passwordless');
// var passwordless = require('../../../');

router.get('/authenticate', passwordless.restricted(),
	(req, res) => {
		res.send(req.user)
	}
)

/* GET logout. */
router.get('/logout', passwordless.logout());

/* POST login screen. */
router.post('/sendtoken', passwordless.requestToken(
	function(user, delivery, callback) {
		callback(null, user)
	}),
	function(req, res) {
  		res.render('sent');
	}
)

if (!process.env.ENV) { // development
	/* GET home page. */
	router.get('/', function(req, res) {
	  res.render('index', { user: req.user });
	});
	
	/* GET restricted site. */
	router.get('/restricted', passwordless.restricted(),
	function(req, res) {
	 res.render('restricted', { user: req.user });
	});

	/* GET login screen. */
	router.get('/login', function(req, res) {
	 res.render('login', { user: req.user });
	});
}

module.exports = router;