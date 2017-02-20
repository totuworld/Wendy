

'use strict';

module.exports = function(sequelize, DataTypes) {
    let RewardSetGroup= sequelize.define('RewardSetGroup', {
        RewardSetGroupID : { type:DataTypes.INTEGER, primaryKey:true},
        Description : { type:DataTypes.STRING(32)}
    }, {
        timestamps: false,
        tableName: 'RewardSetGroup',
        classMethods: {
            associate: function (models) {
                RewardSetGroup.hasMany(models.RewardSet, {
                    foreignKey: {
                        name:'RewardSetGroupID',
                        allowNull: false
                    },
                    as:'SetInfo'
                });
            }
        }
    });
    return RewardSetGroup;
};