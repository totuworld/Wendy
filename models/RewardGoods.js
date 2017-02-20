'use strict';

module.exports = function(sequelize, DataTypes) {
    let RewardGoods= sequelize.define('RewardGoods', {
        RewardGoodsUID : { type : DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
        AmountMin : { type:DataTypes.INTEGER, defaultValue:1},
        AmountMax : { type:DataTypes.INTEGER, defaultValue:1},
        DropRatio : { type:DataTypes.FLOAT, defaultValue:0}
    }, {
        timestamps: false,
        tableName: 'RewardGoods',
        classMethods: {
            associate: function (models) {
                RewardGoods.belongsTo(models.DefineItem, {
                    foreignKey: {
                        name:'ItemID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return RewardGoods;
};