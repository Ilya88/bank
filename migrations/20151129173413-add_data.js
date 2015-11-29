'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.bulkInsert('Currency', [
        {
          title: "Ruble",
          code: "RUB"
        },
        {
          title: "Dollar",
          code: "USD"
        },
        {
          title: "Euro",
          code: "EUR"
        }
      ]),
      queryInterface.bulkInsert('Currency_converter', [
        {
          from_currency_id: 1,
          to_currency_id: 2,
          rate: 0.015
        },
        {
          from_currency_id: 1,
          to_currency_id: 3,
          rate: 0.014
        },
        {
          from_currency_id: 2,
          to_currency_id: 1,
          rate: 66.24
        },
        {
          from_currency_id: 2,
          to_currency_id: 3,
          rate: 0.94
        },
        {
          from_currency_id: 3,
          to_currency_id: 1,
          rate: 70.39
        },
        {
          from_currency_id: 3,
          to_currency_id: 2,
          rate: 1.06
        }
      ])];
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropAllTables();
  }
};
