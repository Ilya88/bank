'use strict';
module.exports = function(sequelize, DataTypes) {
  var CurrencyConverter = sequelize.define('CurrencyConverter', {
    fromCurrencyId: DataTypes.INTEGER,
    toCurrencyId: DataTypes.INTEGER,
    rate: DataTypes.NUMERIC
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return CurrencyConverter;
};
