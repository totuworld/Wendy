'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineShop= sequelize.define('DefineShop', {
        ShopID : { type : DataTypes.INTEGER, primaryKey: true,  autoIncrement:true},
        ProductName : { type:DataTypes.STRING(20) },
        PriceType : { type:DataTypes.INTEGER },
        Price : { type : DataTypes.FLOAT}
    }, {
        timestamps: false,
        tableName: 'DefineShop',
        classMethods: {
            associate: function (models) {
                DefineShop.belongsTo(models.RewardSetGroup, {
                    foreignKey: {
                        name:'RewardSetGroupID',
                        allowNull: true
                    }
                });
                DefineShop.belongsTo(models.RewardGoodsGroup, {
                    foreignKey: {
                        name:'RewardGoodsGroupID',
                        allowNull: true
                    }
                });
            }
        }
    });
    return DefineShop;
};