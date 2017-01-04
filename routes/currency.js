'use strict'

const debug = require('debug')('Wendy:router:currency');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');
const currencyLogic = require('../logics/currency');

const express = require('express');
const router = express.Router();


/**
 * @api {GET} /currency/define 통화 목록 요청
 * @apiName 정의된 통화 목록 요청
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/define', auth.isAuthenticated, (req, res, next)=>{
    models.DefineCurrency.findAll({
        include: [{
            model: models.DefineRechargeCurrency,
            as: 'RechargeInfo'
        }]
    })
        .then((defineCurrencyList)=>{
            res.send({result:0, list:defineCurrencyList});
        })
});

/**
 * @api {GET} /currency/own 보유 통화 목록 요청
 * @apiName 보유 통화 목록 요청
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/own', auth.isAuthenticated, (req, res, next) => {

    let saveGameUser;
    let saveOwnCurrencyList;

    //OwnCurrency 목록조회
    models.OwnCurrency.findAll({
        where: { GameUserID: req.user.GameUserID },
        //재충전 계산이 필요할 수 있으니 DefineCurrency도 포함한다.
        include: [{
            model: models.DefineCurrency,
            include: {
                model: models.DefineRechargeCurrency,
                as: 'RechargeInfo'
            }
        }
        ]
    })
        .then((ownCurrencyList) => {
            saveOwnCurrencyList = ownCurrencyList;
            //재충전 주기를 체크해야하는지 확인한다.
            for (let row of saveOwnCurrencyList) {
                if (row.DefineCurrency.RechargeCurrencyID !== null)
                    return Promise.resolve();
            }
            return Promise.reject('pass');
        })
        //재충전 주기 확인 시 사용될 GameUser를 찾는다.
        .then(() => {
            return models.GameUser.findOne({
                where: { GameUserID: req.user.GameUserID }
            })
        })
        .then((gameUser) => {
            saveGameUser = gameUser;
            return Promise.resolve();
        })
        //재충전 주기를 살필 통화가 있는지 확인한다.
        .then(() => {
            let nowDate = new Date();
            let promises = [];
            let tempResult;
            for (let row of saveOwnCurrencyList) {
                if (row.DefineCurrency.RechargeCurrencyID !== null) {
                    tempResult = currencyLogic.CheckForRecharge(
                        row,
                        saveGameUser,
                        row.DefineCurrency.RechargeInfo,
                        nowDate);

                    if (tempResult.code === true) {
                        promises.push(
                            models.OwnCurrency.update(
                                tempResult.update,
                                { where: { OwnCurrencyUID: row.OwnCurrencyUID } })
                        );
                    }
                }
            }
            if (promises.length > 0) return Promise.all(promises);
            return Promise.resolve();
        })
        .catch((err) => {
            if (err === 'pass') return Promise.resolve(saveOwnCurrencyList);
            return Promise.reject(err);
        })
        //업데이트된 항목이 있을 수 있으니 OwnCurrency를 다시 로딩한다.
        .then(() => {
            //OwnCurrencyUID를 Array로 뽑아서 쿼리에 사용한다.
            let OwnCurrencyUIDs = [];
            for (let row of saveOwnCurrencyList) {
                OwnCurrencyUIDs.push(row.OwnCurrencyUID);
            }
            return models.OwnCurrency.findAll({
                where: { OwnCurrencyUID: { $in: OwnCurrencyUIDs } }
            })
        })
        .then((ownCurrencyList)=>{
            res.send({result:0, list:ownCurrencyList});
        })
        .catch((err)=>{
            next(err);
        })
});

module.exports = router;