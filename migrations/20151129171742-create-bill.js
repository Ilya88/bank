'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
        'Bills',
        {
          id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          userId: {
            type: Sequelize.INTEGER,
            references: 'Users',
            referencesKey: 'id'
          },
          currencyId: {
            type: Sequelize.INTEGER,
            references: 'Currencies',
            referencesKey: 'id'
          },
          balance: {
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
    return queryInterface.dropTable('Bills');
  }
};
