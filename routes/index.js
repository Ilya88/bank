var express = require('express');
var passport = require('passport');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

/* Получение страницы авторизации. */
router.get('/', function(req, res) {
  res.render('index', { message: req.flash('message') });
});


/* Обработка POST-данных авторизации */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash : true
}));

/* Получение страницы регистрации */
router.get('/signup', function(req, res){
  res.render('register',{message: req.flash('message')});
});

/* Обработка регистрационных POST-данных */
router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash : true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/home', isAuthenticated, function(req, res) {
  res.render('home', { user: req.user });
});

module.exports = router;
