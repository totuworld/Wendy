'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineReinforceRequireItem= sequelize.define('DefineReinforceRequireItem', {
        Level : { type:DataTypes.INTEGER},
        RequireQNTY : { type:DataTypes.INTEGER, defaultValue:1 }
    }, {
        timestamps: false,
        tableName: 'DefineReinforceRequireItem',
        classMethods: {
            associate: function (models) {
                DefineReinforceRequireItem.belongsTo(models.DefineItem, {
                    foreignKey: {
                        name:'ItemID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return DefineReinforceRequireItem;
};