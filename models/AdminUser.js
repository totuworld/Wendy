'use strict';

module.exports = function(sequelize, DataTypes) {
    let AdminUser= sequelize.define('AdminUser', {
        AdminUserID : { type : DataTypes.INTEGER, primaryKey: true,  autoIncrement:true }, 
        email : { type : DataTypes.STRING(64) },
        password : { type : DataTypes.STRING(128)},
        grade : {type : DataTypes.INTEGER, defaultValue:0},
        failCount : {type : DataTypes.INTEGER, defaultValue:0},
        createAt : { type:DataTypes.DATE, defaultValue:sequelize.NOW }
    }, {
        timestamps: false,
        tableName: 'AdminUser'
    });
    return AdminUser;
};