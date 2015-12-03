'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addIndex(
        'Bills', ['userId']
    );
    queryInterface.addIndex(
      'CurrencyConverters', ['fromCurrencyId', 'toCurrencyId'], {
          indexName: 'from_to_Currency_id',
          indicesType: 'UNIQUE'
      }
    );
    queryInterface.addIndex(
        'Users', ['username'], {
          indexName: 'username',
          indicesType: 'UNIQUE'
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeIndex('Bills', 'userId');
      queryInterface.removeIndex('CurrencyConverters', 'from_to_Currency_id');
      queryInterface.removeIndex('Users', 'username');
  }
};
