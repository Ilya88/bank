var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieSession = require('cookie-session');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('express-flash');
var bcrypt = require('bcryptjs');
var User = require('./models').User;

var routes = require('./routes/index');
var users = require('./routes/users');
var billing = require('./routes/billing');

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
app.use(cookieSession( {secret: 'afs531a#1'} ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(data, done) {
    try {
        done(null, JSON.parse(data));
    } catch (e) {
        done(e)
    }
});

passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        // проверка в mongo, существует ли пользователь с таким логином
        User.findOne({ where: {username: username}}).then(
            function(user) {
                // Пользователь не существует, ошибка входа и перенаправление обратно
                if (!user) {
                    console.log('User Not Found with username '+username);
                    return done(null, false,
                        req.flash('message', 'User Not found.'));
                }
                // Пользователь существует, но пароль введен неверно, ошибка входа
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false,
                        req.flash('message', 'Invalid Password'));
                }
                // Пользователь существует и пароль верен, возврат пользователя из
                // метода done, что будет означать успешную аутентификацию
                return done(null, user);
            }
        );
    })
);

var isValidPassword = function(user, password){
    return bcrypt.compareSync(password, user.hash);
};

passport.use('signup', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        if (password != req.body.confirm) {
            return done(null, false, req.flash('message','Password not confirm!'));
        }
        User.findOne({where: {username: username}}).then(
            function(user) {
            if (user) {
                console.log('User already exists');
                return done(null, false,
                    req.flash('message','User already Exists'));
            } else {
                User.create({ username : username, hash: createHash(password)}).then(function(user) {
                    if (!user) {
                        req.flash('message','Error');
                    }
                    console.log('User Registration succesful');
                    return done(null, user);
                });
            }
        });
    })
);

var createHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

app.use('/', routes);
app.use('/users', users);
app.use('/billing', billing);

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
