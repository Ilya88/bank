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
            references: 'Currencies',
            referencesKey: 'id'
          },
          toCurrencyId: {
            type: Sequelize.INTEGER,
            references: 'Currencies',
            referencesKey: 'id'
          },
          rate: {
            type: Sequelize.NUMERIC
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
            },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('CurrencyConverters');
  }
};
