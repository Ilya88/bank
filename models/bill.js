'use strict';
module.exports = function(sequelize, DataTypes) {
  var Bill = sequelize.define('Bill', {
    userId: DataTypes.INTEGER,
    currencyId: DataTypes.INTEGER,
    balance: DataTypes.NUMERIC
  }, {
    classMethods: {
      associate: function(models) {
        Bill.belongsTo(models.Currency, { foreignKey: 'currencyId' })
      }
    }
  });
  return Bill;
};
