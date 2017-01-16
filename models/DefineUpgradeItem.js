'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineUpgradeItem= sequelize.define('DefineUpgradeItem', {
        UpgradeItemID : { type:DataTypes.INTEGER, primaryKey:true}
    }, {
        timestamps: false,
        tableName: 'DefineUpgradeItem',
        classMethods: {
            associate: function (models) {
                DefineUpgradeItem.hasMany(models.DefineUpgradeRequireItem, {
                    foreignKey: {
                        name:'UpgradeRequireItemID',
                        allowNull: false
                    },
                    as:'UpgradeInfo'
                });
            }
        }
    });
    return DefineUpgradeItem;
};