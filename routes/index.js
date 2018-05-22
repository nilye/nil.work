var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.use('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/../dist/index/index.html'));
});

module.exports = router;
