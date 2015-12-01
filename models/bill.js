'use strict';
module.exports = function(sequelize, DataTypes) {
  var Bill = sequelize.define('Bill', {
    userId: DataTypes.INTEGER,
    currencyId: DataTypes.INTEGER,
    balance: {
      type: DataTypes.NUMERIC,
      validate: { min: 0 }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Bill.belongsTo(models.Currency, { foreignKey: 'currencyId' })
      }
    }
  });
  return Bill;
};
