<<<<<<< HEAD
let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let http = require('http');
let app = express();
app.use(logger('dev'));

//general
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

<<<<<<< HEAD
// routes
let index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
=======
//cros
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();

>>>>>>> 64aee768d04ad9b77cda2b90fc793009a1bffd18
});
// sub domain
var subdomain = require('express-subdomain')


//static dir
app.use(express.static(path.join(__dirname, 'dist')));

//index route
app.use(function(req, res){
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

<<<<<<< HEAD
// var port = (process.env.PORT || '80');
var port = (process.env.PORT || '3000');
=======
let port = (process.env.PORT || '80');
>>>>>>> 54880d55b468f7957121d27ad332e7aab6a3782a
app.set('port', port);

let server = http.createServer(app);
server.listen(port);
