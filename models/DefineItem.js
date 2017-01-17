'use strict';

module.exports = function(sequelize, DataTypes) {
    let DefineItem= sequelize.define('DefineItem', {
        ItemID : { type : DataTypes.INTEGER, primaryKey: true },
        ItemType : {type : DataTypes.INTEGER },
        Name : { type:DataTypes.STRING(10) },
        Multiple : { type : DataTypes.BOOLEAN, defaultValue:false },
        MaxQNTY : { type:DataTypes.INTEGER, defaultValue:1 }
    }, {
        timestamps: false,
        tableName: 'DefineItem',
        classMethods: {
            associate: function (models) {
                //레벨업 가능한 상품
                DefineItem.belongsTo(models.DefineReinforceItem, {
                    foreignKey: {
                        name:'ReinforceItemID',
                        allowNull: true
                    },
                    as: 'ReinforceInfo'
                });

                //승급 가능한 상품
                DefineItem.belongsTo(models.DefineUpgradeItem, {
                    foreignKey: {
                        name:'UpgradeItemID',
                        allowNull: true
                    },
                    as: 'UpgradeInfo'
                });
            }
        }
    });
    return DefineItem;
};