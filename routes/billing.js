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
            bill: bill,
            message: req.flash('message')
        });
    });
});

router.post('/:id', isAuthenticated, function(req, res) {
    models.Bill.findOne({
        where: {id: req.params.id, userId: req.user.id}
    }).then(function(bill) {
        if (!isNaN(req.body.credit) && req.body.credit > 0) {
            bill.increment({ balance: req.body.credit }).then(
                function() {
                    res.redirect('/home');
                }
            );
        } else if (!isNaN(req.body.debit) && req.body.debit > 0) {
            bill.decrement({ balance: req.body.debit }).then(
                function() {
                    res.redirect('/home');
                }
            ).catch(
                function (err) {
                    req.flash('message', 'Error');
                    res.redirect('/billing/' + req.params.id);
                }
            );
        } else {
            req.flash('message', 'Invalid value');
            return res.redirect('/billing/' + req.params.id);
        }
    });
});

router.get('/:id/transfer', isAuthenticated, function(req, res) {
    models.Bill.findAll({
        where: {
            userId: req.user.id,
            id: {
                $ne: req.params.id
            },
            balance: {
                $gt: 0
            }
        },
        include: [
            { model: models.Currency }
        ]
    }).then(function(bills) {
        res.render('billing/transfer', {
            user: req.user,
            billId: req.params.id,
            bills: bills,
            message: req.flash('message')
        });
    });
});

router.post('/:id/transfer', isAuthenticated, function(req, res) {
    if (isNaN(req.body.transfer) || req.body.transfer <= 0) {
        req.flash('message', 'Invalid value');
        return res.redirect('/billing/' + req.params.id + '/transfer');
    }
    var transfer = req.body.transfer;
    return models.Bill.findOne({
        where: {
            userId: req.user.id,
            id: req.body.bill_id
        }
    }).then(
        function(billFrom) {
            models.Bill.findOne({
                where: {
                    userId: req.user.id,
                    id: req.params.id
                }
            }).then(
                function(billTo) {
                    if (billFrom.currencyId == billTo.currencyId) {
                        billTo.increment({ balance: transfer }).then(
                            function () {
                                billFrom.decrement({ balance: transfer }).then(
                                    function() {
                                        res.redirect('/billing/' + billTo.id);
                                    }
                                );
                            }
                        );
                    } else {
                        models.CurrencyConverter.findOne({
                            where: {
                                fromCurrencyId: billFrom.currencyId,
                                toCurrencyId: billTo.currencyId
                            }
                        }).then(
                            function(convertItem) {
                                billTo.increment({ balance: (convertItem.rate * transfer) }).then(
                                    function () {
                                        billFrom.decrement({ balance: transfer }).then(
                                            function() {
                                                res.redirect('/billing/' + billTo.id);
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                }
            );
        }
    );
});

module.exports = router;
