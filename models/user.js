'use strict';
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        login: DataTypes.STRING,
        hash: DataTypes.STRING(32)
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });

    return User;
};
