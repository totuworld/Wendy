'use strict';

module.exports = function(sequelize, DataTypes) {
    let OwnCurrency= sequelize.define('OwnCurrency', {
        OwnCurrencyUID : { type : DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
        CurrencyID : { type : DataTypes.INTEGER },
        QNTY:{type:DataTypes.INTEGER, defaultValue:0}
    }, {
        timestamps: false,
        tableName: 'OwnCurrency',
        classMethods: {
            associate: function (models) {
                //보유한 GameUserID 외래키 등록
                OwnCurrency.belongsTo(models.GameUser, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'GameUserID',
                        allowNull: false
                    }
                });
                //보유한 CurrencyID 외래키 등록
                OwnCurrency.belongsTo(models.DefineCurrency, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'CurrencyID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return OwnCurrency;
};