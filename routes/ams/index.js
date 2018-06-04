var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get(['/','/upload','/v/:videoId'], function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../../dist/ams/index.html'));
});

var uploadRoutes = require('./upload')
var videoRoutes = require('./video')
router.use('/api/upload', uploadRoutes)
router.use('/api/video', videoRoutes)

module.exports = router;
