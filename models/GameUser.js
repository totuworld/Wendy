'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    let GameUser = sequelize.define('GameUser', {
        GameUserID : { type : DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        NickName : { type : DataTypes.STRING(32) },
        Locale : { type : DataTypes.STRING(6)},
        OffsetTime : { type :DataTypes.INTEGER, defaultValue: 0},
        OffsetTimeUpdateAt : { type : DataTypes.DATE, defaultValue: Sequelize.NOW},
        createAt : { type : DataTypes.DATE, defaultValue: Sequelize.NOW},
        loginAt : { type : DataTypes.DATE, defaultValue: Sequelize.NOW}
    }, {
        timestamps: false,
        tableName: 'GameUser'
    });
    return GameUser;
};