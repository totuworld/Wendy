'use strict';

module.exports = function(sequelize, DataTypes) {
    let RewardGoodsGroup= sequelize.define('RewardGoodsGroup', {
        RewardGoodsGroupID : { type:DataTypes.INTEGER, primaryKey:true},
        Description : { type:DataTypes.STRING(32)}
    }, {
        timestamps: false,
        tableName: 'RewardGoodsGroup',
        classMethods: {
            associate: function (models) {
                RewardGoodsGroup.hasMany(models.RewardGoods, {
                    foreignKey: {
                        name:'RewardGoodsGroupID',
                        allowNull: false
                    },
                    as:'GoodsInfo'
                });
            }
        }
    });
    return RewardGoodsGroup;
};