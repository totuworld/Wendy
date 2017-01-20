'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineReinforceItem= sequelize.define('DefineReinforceItem', {
        ReinforceItemID : { type:DataTypes.INTEGER, primaryKey:true}
    }, {
        timestamps: false,
        tableName: 'DefineReinforceItem',
        classMethods: {
            associate: function (models) {
                DefineReinforceItem.hasMany(models.DefineReinforceRequireItem, {
                    foreignKey: {
                        name:'ReinforceItemID',
                        allowNull: false
                    },
                    as:'LevelInfo'
                });
            }
        }
    });
    return DefineReinforceItem;
};