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

// sub domainss
var subdomain = require('express-subdomain');
var apiRoute = require('./routes/api');
app.use(subdomain('api', apiRoute));

//static dir
app.use(express.static(path.join(__dirname, 'dist'), {index:false, redirect: false}));

//index route
var index = require('./routes/index');
app.use(index);

//port & server
var port = (process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
