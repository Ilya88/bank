'use strict';
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: DataTypes.INTEGER,
        login: DataTypes.STRING,
        hash: DataTypes.STRING(32)
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Task)
            }
        }
    });

    return User;
};
