'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
        'Bills',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          userId: {
            type: Sequelize.INTEGER,
            field: 'user_id',
            references: 'Users',
            referencesKey: 'id'
          },
          currencyId: {
            type: Sequelize.INTEGER,
            field: 'currency_id',
            references: 'Currency',
            referencesKey: 'id'
          },
          balance: {
            type: Sequelize.NUMERIC
          }
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Bills');
  }
};
