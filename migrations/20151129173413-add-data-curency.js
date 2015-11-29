'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var now = new Date();
    return [
      queryInterface.bulkInsert('Currencies', [
        {
          id: 1,
          title: "Ruble",
          code: "RUB",
          createdAt: now,
          updatedAt: now
        },
        {
          id: 2,
          title: "Dollar",
          code: "USD",
          createdAt: now,
          updatedAt: now
        },
        {
          id: 3,
          title: "Euro",
          code: "EUR",
          createdAt: now,
          updatedAt: now
        }
      ])];
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Currencies');
  }
};
