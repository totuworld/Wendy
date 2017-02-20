'use strict';

module.exports = function(sequelize, DataTypes) {
    let CouponQNTY= sequelize.define('CouponQNTY', {
        CouponQNTYID : { type : DataTypes.INTEGER, primaryKey: true,  autoIncrement:true }, 
        CurrentQNTY : { type:DataTypes.INTEGER }
    }, {
        timestamps: false,
        tableName: 'CouponQNTY'
    });
    return CouponQNTY;
};