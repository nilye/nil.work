var express = require('express')
var router = express.Router()
var videoDB = require('./videoSchema')

router.get('/all', function (req, res, next) {
  videoDB.find(function (err, videos) {
    res.status(200).json(videos)
  })
})

router.get('/:videoId', function (req, res, next) {
  videoDB.findOne({id: req.params['videoId']}, function (err, video) {
    if (err) return res.status(401).send(err)
    res.status(200).json(video)
  })
})


module.exports = router
