var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var okta = require('@okta/okta-sdk-nodejs');
var ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;
var bodyParser = require('body-parser');

/* Router create */
const gameRouter = require('./routes/game');
const publicRouter = require('./routes/public');
const usersRouter = require('./routes/users');
const resultRouter = require('./routes/result');

var oktaClient = new okta.Client({
  orgUrl: 'https://dev-274585.okta.com',
  token: '00ptt6X2OZgzt9JiDXOhFY9iMpzht8vGYedx1yJfZS'
});

const oidc = new ExpressOIDC({
  issuer: 'https://dev-274585.okta.com/oauth2/default',
  client_id: '0oaniwmwmpdS7qpFJ356',
  client_secret: 'gl8oNKLfuS1Lky29hOXvQLaTG5mnk76zXUHkHth4',
  redirect_uri: 'https://18.184.76.126:443/users/callback',
  scope: 'openid profile',
  routes: {
    login: {
      path: '/users/login'
    },
    callback: {
      path: '/users/callback',
      defaultRedirect: '/game'
    }
  }
});

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  secret: 'neptun gdansk ptaszek ,wequrq4380598ujdhasl',
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  oktaClient.getUser(req.userinfo.sub)
      .then(user => {
        req.user = user;
        res.locals.user = user;
        next();
      }).catch(err => {
    next(err);
  });
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render('unauthenticated');
  }

  next();
}

/* Database configuration */
const database = require('./config/dbconfig');

/* Init database */
database.init();

app.use('/', publicRouter);
app.use('/game',loginRequired ,gameRouter);
app.use('/result', loginRequired, resultRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
