var express = require('express');
var passport = require('passport');
var router = express.Router();
var models  = require('../models');

/* Получение страницы авторизации. */
router.get('/login', function(req, res) {
  res.render('index', { message: req.flash('message') });
});


/* Обработка POST-данных авторизации */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
}));

/* Получение страницы регистрации */
router.get('/signup', function(req, res){
  res.render('register',{message: req.flash('message')});
});

/* Обработка регистрационных POST-данных */
router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash : true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}, function(req, res) {
  models.Bill.findAll({
    where: {userId: req.user.id},
    include: [
      { model: models.Currency }
    ]
  }).then(function(bills) {
    res.render('home', {
      user: req.user,
      bills: bills
    });
  });
});

module.exports = router;
