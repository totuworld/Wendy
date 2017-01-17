'use strict';

module.exports = function(sequelize, DataTypes) {
    let OwnItem= sequelize.define('OwnItem', {
        OwnItemUID : { type : DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
        ItemID : { type : DataTypes.INTEGER },
        CurrentQNTY : { type:DataTypes.INTEGER, defaultValue:0 },
        Level : { type:DataTypes.INTEGER, defaultValue:1 },
        Tier : { type:DataTypes.INTEGER, defaultValue:1 },
        UpdateTimeStamp: { type:DataTypes.DATE, defaultValue:sequelize.NOW }
    }, {
        timestamps: false,
        tableName: 'OwnItem',
        classMethods: {
            associate: function (models) {
                //보유한 GameUserID 외래키 등록
                OwnItem.belongsTo(models.GameUser, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'GameUserID',
                        allowNull: false
                    }
                });
                //보유한 ItemID 외래키 등록
                OwnItem.belongsTo(models.DefineItem, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'ItemID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return OwnItem;
};