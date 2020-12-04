var express = require('express');
var router = express.Router();

/* GET users listing. */
// this page has 3 url: /register, /login, /logout

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
