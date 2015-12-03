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
        var newValue = bill.balance;
        if (!isNaN(req.body.credit) && req.body.credit > 0) {
            newValue += Number(req.body.credit);
        } else if (!isNaN(req.body.debit) && req.body.debit > 0) {
            newValue -= Number(req.body.debit);
        } else {
            req.flash('message', 'Invalid value');
            return res.redirect('/billing/' + req.params.id);
        }
        models.Bill.update(
            { balance: newValue }, {where: {id: req.params.id, userId: req.user.id}}
        ).then(function(bill) {
            res.redirect('/home');
        }).catch(
            function (err) {
                req.flash('message', 'Error');
                res.redirect('/billing/' + req.params.id);
            }
        );
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
    var transfer = Number(req.body.transfer);
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
                        models.Bill.update(
                            { balance: billTo.balance + transfer },
                            { where: {id: billTo.id, userId: req.user.id} }
                        ).then(
                            function() {
                                models.Bill.update(
                                    { balance: billFrom.balance - transfer },
                                    { where: {id: billFrom.id, userId: req.user.id} }
                                ).then(
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
                                var newValue = billTo.balance + convertItem.rate * transfer;
                                models.Bill.update(
                                    { balance: newValue }, {where: {id: billTo.id, userId: req.user.id}}
                                ).then(
                                    function() {
                                        models.Bill.update(
                                            { balance: billFrom.balance - transfer }, {where: {id: billFrom.id, userId: req.user.id}}
                                        ).then(
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
