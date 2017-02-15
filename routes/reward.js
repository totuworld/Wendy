'use strict'

const debug = require('debug')('Wendy:router:item');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');
const rewardCtrl = require('../logics/reward');

const express = require('express');
const router = express.Router();

/**
 * @api {GET} /reward/set
 * @apiName 재화 세트 상품 정보 제공
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/set', auth.isAuthenticated, (req, res, next) => {
    models.RewardSetGroup.findAll({
        include: [{
            model: models.RewardSet,
            as:'SetInfo'
        }]
    })
    .then((rewardSetGroupList)=>{
        res.send({result:0, list:rewardSetGroupList});
    })
})

/**
 * @api {GET} /reward/goods
 * @apiName 지급가능한 재화 정보 제공
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/goods', auth.isAuthenticated, (req, res, next) => {
    models.RewardGoodsGroup.findAll({
        include: [{
            model: models.RewardGoods,
            as:'GoodsInfo'
        }]
    })
    .then((rewardSetGroupList)=>{
        res.send({result:0, list:rewardSetGroupList});
    })
})

const env       = process.env.NODE_ENV || "development";

router.get('/test/:RewardGroupID', auth.isAuthenticated, (req, res, next)=>{

    return Promise.resolve()
    .then(()=>{
        return Promise.resolve();
    })
    .then(()=>{
        return rewardCtrl.paymentMaterial(req.user.GameUserID, req.params.RewardGroupID);
    })
    .then((result)=>{
        res.send({result:0, reward:result});
    })
    .catch((err)=>{
        if(err === 'pass')
            res.send({result:0, reward:[]})
        else
            next(err);
    })
});

module.exports = router;