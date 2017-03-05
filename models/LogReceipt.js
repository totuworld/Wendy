'use strict';

module.exports = function(sequelize, DataTypes) {
    let LogReceipt= sequelize.define('LogReceipt', {
        ReceiptLogID : { type : DataTypes.INTEGER, primaryKey: true,  autoIncrement:true },
        State : { type : DataTypes.INTEGER, defaultValue:0 },
        ProductName : { type : DataTypes.STRING(32) },
        Receipt : { type : DataTypes.TEXT },
        TimeStamp : { type : DataTypes.DATE, defaultValue: sequelize.NOW}
    }, {
        timestamps: false,
        tableName: 'LogReceipt',
        classMethods: {
            associate: function (models) {
                LogReceipt.belongsTo(models.GameUser, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:'GameUserID',
                        allowNull: false
                    }
                });
            }
        }
    });
    return LogReceipt;
};