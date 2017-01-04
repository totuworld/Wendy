'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineCurrency= sequelize.define('DefineCurrency', {
        CurrencyID : { type : DataTypes.INTEGER, primaryKey: true }, //고유한 번호를 할당해야한다.
        Name : { type:DataTypes.STRING(10) },
        MaxQNTY : { type:DataTypes.INTEGER, defaultValue:9000 }
    }, {
        timestamps: false,
        tableName: 'DefineCurrency',
        classMethods: {
            associate: function (models) {
                //재충전되는 통화인 경우 해당 값을 가진다.
                DefineCurrency.belongsTo(models.DefineRechargeCurrency, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'RechargeCurrencyID',
                        allowNull: true
                    },
                    as: 'RechargeInfo'
                });
            }
        }
    });
    return DefineCurrency;
};