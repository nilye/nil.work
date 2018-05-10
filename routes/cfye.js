var express = require('express');
var router = express.Router();
var path = require('path')

router.get('/:id', function(req, res){
  res.sendFile(path.join(__dirname+ '/../dist/cfye-eco-presentation/'+req.params.id+'/index.html'));
});

module.exports = router;
