const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
