'use strict';

module.exports = function(sequelize, DataTypes) {
    let GameDevice= sequelize.define('GameDevice', {
        GameDeviceUID : { type : DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        UUID:{type:DataTypes.STRING(60)},
        DeviceType:{type:DataTypes.INTEGER, defaultValue:0},
        MainFlag : { type : DataTypes.BOOLEAN, defaultValue:true }
    }, {
        timestamps: false,
        tableName: 'GameDevice',
        classMethods: {
            associate: function (models) {
                GameDevice.belongsTo(models.GameUser, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'GameUserID',
                        allowNull: true
                    }
                });
            }
        }
    });
    return GameDevice;
};