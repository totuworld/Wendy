'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineUpgradeRequireItem= sequelize.define('DefineUpgradeRequireItem', {
        Level : { type:DataTypes.INTEGER},
        RequireQNTY : { type:DataTypes.INTEGER, defaultValue:1 }
    }, {
        timestamps: false,
        tableName: 'DefineUpgradeRequireItem',
        classMethods: {
            associate: function (models) {
                DefineUpgradeRequireItem.belongsTo(models.DefineItem, {
                    foreignKey: {
                        name:'ItemID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return DefineUpgradeRequireItem;
};