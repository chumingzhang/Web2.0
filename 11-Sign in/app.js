/*
  张楚明:18342125
  app.js
*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

module.exports = function(db) {
  var Index = require('../Index/index')(db);
  var app = express();

  app.set('jades', path.join(__dirname, 'jades'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
    store: new FileStore(),
    resave: false,
    saveUninitialized: false,
    secret: 'Web Homework is a litter more but useful'
  }));

  //asign static dir (for including *.css, *.js)
  app.use(express.static(path.join(__dirname, 'others')));

  app.use('/', Index);

  //if not found， catch 404 error
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  //handel error
  app.use(function(err, req, res, next) {
    //provide error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //render to the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
}
