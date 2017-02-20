'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineCoupon= sequelize.define('DefineCoupon', {
        CouponID : { type : DataTypes.INTEGER, primaryKey: true,  autoIncrement:true},
        CouponName : { type:DataTypes.STRING(20) },
        ExpiredDate : { type : DataTypes.DATE, defaultValue: '2012-06-05'}
    }, {
        timestamps: false,
        tableName: 'DefineCoupon',
        classMethods: {
            associate: function (models) {
                DefineCoupon.belongsTo(models.CouponQNTY, {
                    foreignKey: {
                        name:'CouponQNTYID',
                        allowNull: true
                    }
                });
                DefineCoupon.belongsTo(models.RewardSetGroup, {
                    foreignKey: {
                        name:'RewardSetGroupID',
                        allowNull: true
                    }
                });
                DefineCoupon.belongsTo(models.RewardGoodsGroup, {
                    foreignKey: {
                        name:'RewardGoodsGroupID',
                        allowNull: true
                    }
                });
            }
        },
        indexes:[
            { 
                name: 'definecoupon_name',
                 fields: ['CouponName']
            }
        ]
    });
    return DefineCoupon;
};