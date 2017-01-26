var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var polls = require('./server/routes/polls');
var users = require('./server/routes/users');

var app = express();

var db = require('./config/sequelize')

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'cave opener', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'client')))

//use passport session
var passport = require('./config/passport')
app.use(passport.initialize());
app.use(passport.session());

// custom middleware for logging user from requests
app.use(function(req,res,next){
  if(req.user) console.log(req.user.twitterName);
  else console.log('Not signed in.');
  next();
})

// app.use('/', index);
app.use('/polls', polls);
app.use('/', users);
app.use('/', express.static(path.join(__dirname, 'client/views')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
