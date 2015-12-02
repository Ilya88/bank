'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE "Bills" ADD CONSTRAINT "balance_constraint" CHECK ("balance" > 0)');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE "Bills" DROP CONSTRAINT "balance_constraint"');
  }
};
