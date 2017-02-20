'use strict';

module.exports = function(sequelize, DataTypes) {
    let RewardSet= sequelize.define('RewardSet', {
        RewardSetUID : { type : DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
        DropRatio : { type:DataTypes.FLOAT, defaultValue:0}
    }, {
        timestamps: false,
        tableName: 'RewardSet',
        classMethods: {
            associate: function (models) {
                RewardSet.belongsTo(models.RewardGoodsGroup, {
                    foreignKey: {
                        name:'RewardGoodsGroupID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return RewardSet;
};