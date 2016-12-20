"use strict";

/// <reference path="../typings/node/node.d.ts"/>

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const env       = process.env.NODE_ENV || "development";
const config    = require('../config/config.json')[env];

//db에 접속하는 username과 password는 환경변수를 우선적용한다.
//// 절대 주의!!!! 공개된 레포지토리에 username과 password를 입력하지 마세요.
const username =  process.env.dbUsername || config.username;
const password =  process.env.dbPassword || config.password;

let sequelize = new Sequelize(config.database, username, password, config);
let db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;