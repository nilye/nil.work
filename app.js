var express = require('express');
var vhost = require('vhost')
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

//static dir
app.use(express.static(path.join(__dirname, 'dist'), {index:false, redirect: false}));

/*-----------sub domains------------*/
var subdomain = require('express-subdomain');
var apiRoute = require('./routes/api');
app.use(subdomain('api', apiRoute));
//ams
const amsRoutes = require('./routes/ams/index')
app.use(vhost('ams.nil.work', amsRoutes))
app.use(vhost('ams.nil.work', express.static(path.join(__dirname,'dist/ams'), {index:false, redirect: false}) ))

//index route
var index = require('./routes/index');
app.use(index);

//port & server
var port = (process.env.PORT || '3000');
app.use(function(req, res){
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// var port = (process.env.PORT || '80');
var port = (process.env.PORT || '3000');
// let port = (process.env.PORT || '80');

app.set('port', port);
var server = http.createServer(app);
server.listen(port);
