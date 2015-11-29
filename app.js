var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieSession = require('cookie-session');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var currencies = require('./routes/currencies');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession( {secret: 'mySecretKey'} ));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
      // set the field name here
      usernameField: 'username',
      passwordField: 'password'
    },
    function(login, password, done) {
      /* get the username and password from the input arguments of the function */

      // query the user from the database
      // don't care the way I query from database, you can use
      // any method to query the user from database
      User.find( { where: {login: username}} )
        .success(function(user) {
          if (!user) {
            // if the user is not exist
            return done(null, false, {message: "The user is not exist"});
          } else if (!hashing.compare(password, user.password)) {
            // if password does not match
            return done(null, false, {message: "Wrong password"});
          } else {
            // if everything is OK, return null as the error
            // and the authenticated user
            return done(null, user);
          }
        })
        .error(function(err) {
          // if command executed with error
          return done(err);
        });
    }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // query the current user from database
  User.find(id)
    .success(function(user){
      done(null, user);
    }).error(function(err) {
    done(new Error('User ' + id + ' does not exist'));
  });
});

app.use('/', routes);
app.use('/users', users);
app.use('/currencies', currencies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
