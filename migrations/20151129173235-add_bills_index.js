'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addIndex(
        'Bills', ['user_id']
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeIndex('Bills', 'user_id');
  }
};
