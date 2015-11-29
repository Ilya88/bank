'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
        'CurrencyConverters',
        {
          id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          fromCurrencyId: {
            type: Sequelize.INTEGER,
            field: 'from_currency_id',
            references: 'Currencies',
            referencesKey: 'id'
          },
          toCurrencyId: {
            type: Sequelize.INTEGER,
            field: 'to_currency_id',
            references: 'Currencies',
            referencesKey: 'id'
          },
          rate: {
            type: Sequelize.NUMERIC
          }
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('CurrencyConverters');
  }
};
