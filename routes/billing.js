var models  = require('../models');
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

router.get('/create', isAuthenticated, function(req, res) {
    models.Currency.findAll().then(function(currencies) {
        res.render('billing/create', {
            currencies: currencies
        });
    });
});

router.post('/create', isAuthenticated, function(req, res) {
    models.Bill.create({
        userId: req.user.id,
        balance: req.body.balance,
        currencyId: req.body.currency_id
    }).then(function(bill) {
        if (!bill) {
            req.flash('message','Error');
        }
        res.redirect('/home');
    });
});


router.get('/:id', isAuthenticated, function(req, res) {
    models.Bill.findOne({
        where: {id: req.params.id, userId: req.user.id},
        include: [
            { model: models.Currency }
        ]
    }).then(function(bill) {
        res.render('billing/bill', {
            user: req.user,
            bill: bill
        });
    });
});

router.post('/:id', isAuthenticated, function(req, res) {
    models.Bill.findOne({
        where: {id: req.params.id, userId: req.user.id}
    }).then(function(bill) {
        models.Bill.update(
            { balance: bill.balance - req.body.debit }, {where: {id: req.params.id, userId: req.user.id}}
        ).then(function(bill) {
            res.redirect('/home');
        });
    });
});
module.exports = router;
