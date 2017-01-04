'use strict';

module.exports = function(sequelize, DataTypes) {
    let OwnCurrency= sequelize.define('OwnCurrency', {
        OwnCurrencyUID : { type : DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
        CurrencyID : { type : DataTypes.INTEGER },
        CurrentQNTY : { type:DataTypes.INTEGER, defaultValue:0 }, //실제 현재보유수량
        NowMaxQNTY : { type:DataTypes.INTEGER, defaultValue:100 }, //현재 최대보유수량
        AddMaxQNTY : { type:DataTypes.INTEGER, defaultValue:0 }, //어떤 조건으로 추가되는 최대 보유수량
        UpdateTimeStamp: { type:DataTypes.DATE, defaultValue:sequelize.NOW }
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
        },
        getterMethods: {
            //전체 보유수량 = NowMaxQNTY + AddMaxQNTY
            TotalQNTY : function() { return this.NowMaxQNTY + this.AddMaxQNTY }
        }
    });
    return OwnCurrency;
};