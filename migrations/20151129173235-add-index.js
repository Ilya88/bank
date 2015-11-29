'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addIndex(
        'Bills', ['user_id']
    );
    queryInterface.addIndex(
        'Users', ['login'], {
          indexName: 'login',
          indicesType: 'UNIQUE'
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeIndex('Bills', 'user_id');
    queryInterface.removeIndex('Users', 'login');
  }
};
