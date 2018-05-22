var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();

//general
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//cros
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();

});
// sub domain
var subdomain = require('express-subdomain')


//static dir
app.use(express.static(path.join(__dirname, 'dist')));

//index route
app.use(function(req, res){
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// var port = (process.env.PORT || '80');
var port = (process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
