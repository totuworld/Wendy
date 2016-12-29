'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineCurrency= sequelize.define('DefineCurrency', {
        CurrencyID : { type : DataTypes.INTEGER, primaryKey: true}, //고유한 번호를 할당해야한다.
        Name:{type:DataTypes.STRING(10)},
        MaxQNTY:{type:DataTypes.INTEGER, defaultValue:9000}
    }, {
        timestamps: false,
        tableName: 'DefineCurrency'
    });
    return DefineCurrency;
};