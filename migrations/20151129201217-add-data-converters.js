'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var now = new Date();
    return [
      queryInterface.bulkInsert('CurrencyConverters', [
        {
          fromCurrencyId: 1,
          toCurrencyId: 2,
          rate: 0.015,
          createdAt: now,
          updatedAt: now
        },
        {
          fromCurrencyId: 1,
          toCurrencyId: 3,
          rate: 0.014,
          createdAt: now,
          updatedAt: now
        },
        {
          fromCurrencyId: 2,
          toCurrencyId: 1,
          rate: 66.24,
          createdAt: now,
          updatedAt: now
        },
        {
          fromCurrencyId: 2,
          toCurrencyId: 3,
          rate: 0.94,
          createdAt: now,
          updatedAt: now
        },
        {
          fromCurrencyId: 3,
          toCurrencyId: 1,
          rate: 70.39,
          createdAt: now,
          updatedAt: now
        },
        {
          fromCurrencyId: 3,
          toCurrencyId: 2,
          rate: 1.06,
          createdAt: now,
          updatedAt: now
        }
      ])];
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('CurrencyConverters');
  }
};
