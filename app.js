var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var polls = require('./server/routes/polls');
var users = require('./server/routes/users');

var app = express();

var db = require('./config/sequelize');

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// session options
var ms = require('millisecond');
app.use(session({
  secret: 'cave opener',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: ms('1 year')
  },
  store: new SequelizeStore({db: db.sequelize})
}));

//use passport session
var passport = require('./config/passport')
app.use(passport.initialize());
app.use(passport.session());

// static content
app.use(express.static(path.join(__dirname, 'client')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/angular-chart.js/dist/')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/angular-socialshare/dist/')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/angular-spinners/dist/')));
app.use('/img', express.static(path.join(__dirname, 'client/images/')));

app.use('/polls', polls);
app.use('/', users);
app.use('/', express.static(path.join(__dirname, 'client/views')));
app.use('/', express.static(path.join(__dirname, 'favicon')));

app.get('/*', function(req, res){
    res.sendFile(__dirname + '/client/views/index.html');
});

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
