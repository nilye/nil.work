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
app.set('trust proxy', true);

//cros
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});
<<<<<<< HEAD

// sub domainss
var subdomain = require('express-subdomain');
var apiRoute = require('./routes/api');
app.use(subdomain('api', apiRoute));
=======
// sub domain
var subdomain = require('express-subdomain')

>>>>>>> ac91be00f95127c366eb630277709aa56f47d1a1

//static dir
app.use(express.static(path.join(__dirname, 'dist'), {index:false, redirect: false}));

//index route
<<<<<<< HEAD
var index = require('./routes/index');
app.use(index);

//port & server
var port = (process.env.PORT || '3000');
=======
app.use(function(req, res){
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

<<<<<<< HEAD
// var port = (process.env.PORT || '80');
var port = (process.env.PORT || '3000');
=======
let port = (process.env.PORT || '80');
>>>>>>> 54880d55b468f7957121d27ad332e7aab6a3782a
>>>>>>> ac91be00f95127c366eb630277709aa56f47d1a1
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
