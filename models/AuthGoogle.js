'use strict';

module.exports = function(sequelize, DataTypes) {
    let AuthGoogle= sequelize.define('AuthGoogle', {
        AuthGoogleID : { type : DataTypes.INTEGER, primaryKey: true,  autoIncrement:true }, 
        access_token : { type:DataTypes.STRING(256), defaultValue:'' },
        token_type : { type:DataTypes.STRING(32), defaultValue:'' },
        expires_in : { type:DataTypes.INTEGER, defaultValue:0},
        refresh_token : { type:DataTypes.STRING(128), defaultValue:'' },
        expireTimeStamp : { type:DataTypes.DATE, defaultValue:'2002-06-05' }
    }, {
        timestamps: false,
        tableName: 'AuthGoogle'
    });
    return AuthGoogle;
};