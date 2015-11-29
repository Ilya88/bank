'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
        'Currency_converter',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          fromCurrencyId: {
            type: Sequelize.INTEGER,
            field: 'from_currency_id',
            references: 'Currency',
            referencesKey: 'id'
          },
          toCurrencyId: {
            type: Sequelize.INTEGER,
            field: 'to_currency_id',
            references: 'Currency',
            referencesKey: 'id'
          },
          rate: {
            type: Sequelize.NUMERIC
          }
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Currency_converter');
  }
};
