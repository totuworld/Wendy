'use strict';

module.exports = function(sequelize, DataTypes) {
    let LogCoupon= sequelize.define('LogCoupon', {
        CouponLogID : { type : DataTypes.INTEGER, primaryKey: true,  autoIncrement:true },
        UseTimeStamp : { type : DataTypes.DATE, defaultValue: sequelize.NOW}
    }, {
        timestamps: false,
        tableName: 'LogCoupon',
        classMethods: {
            associate: function (models) {
                LogCoupon.belongsTo(models.GameUser, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'GameUserID',
                        allowNull: false
                    }
                });
                LogCoupon.belongsTo(models.DefineCoupon, {
                    foreignKey: {
                        name:'CouponID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return LogCoupon;
};