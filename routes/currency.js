'use strict'

const debug = require('debug')('Wendy:router:device');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');

const express = require('express');
const router = express.Router();


/**
 * @api {GET} /currency/define 통화 목록 요청
 * @apiName 정의된 통화 목록 요청
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/define', auth.isAuthenticated, (req, res, next)=>{
    models.DefineCurrency.findAll()
        .then((defineCurrencyList)=>{
            res.send({result:0, list:defineCurrencyList});
        })
});

/**
 * @api {GET} /currency/own 보유 통화 목록 요청
 * @apiName 보유 통화 목록 요청
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/own', auth.isAuthenticated, (req, res, next)=>{
    models.OwnCurrency.findAll({where:{GameUserID:req.user.GameUserID}})
        .then((ownCurrencyList)=>{
            res.send({result:0, list:ownCurrencyList});
        })
});

module.exports = router;