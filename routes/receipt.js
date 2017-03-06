'use strict'

const debug = require('debug')('Wendy:router:receipt');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');
const rewardCtrl = require('../logics/reward');
const validationReceipt = require('../logics/validationReceipt');

const express = require('express');
const router = express.Router();

const ReceiptType = {
    'apple':1,
    'google':2,
    'onestore':5
}

/**
 * @api {POST} /receipt/validation/:ReceiptType
 * @apiName 인앱 영수증 검증
 * @apiHeader {String} Authorization JWT토큰을 전송
 * @apiParam {String} ProductName 구매한 상품명
 * @apiParam {Object} RawReceipt 결제 시 받은 영수증
 */
router.post('/validation/:ReceiptType', auth.isAuthenticated, (req, res, next)=>{
    
    let checkRequestBody = 
        commonFunc.ObjectExistThatKeys(req.body, ['RawReceipt', 'ProductName']);

    if(checkRequestBody  === false )
        throw wendyError('DontHaveRequiredParams');

    if(ReceiptType.hasOwnProperty(req.params.ReceiptType)===false)
        throw wendyError('UnsupportedReceiptType');
    
    let saveValidationResult = 0;

    Promise.resolve()
    //영수증 검증.
    .then(()=>{
        let convertReceiptType = 
            ReceiptType[req.params.ReceiptType];
        switch(convertReceiptType) {
            case ReceiptType.apple:
                return validationReceipt.checkIOSReceipt(req.body.RawReceipt);
                break;
            case ReceiptType.google:
                if(validationReceipt.iapStatus.init === false)
                    throw wendyError('InitializationFirst');
                return validationReceipt.checkAOSReceipt(req.body.RawReceipt);
                break;
            case ReceiptType.onestore:
                return validationReceipt.checkOneStoreReceipt(req.body.RawReceipt);
                break;
        }
        //혹시 위 케이스로  걸로지지 않으면 에러치리한다.
        throw wendyError('UnsupportedReceiptType');
    })
    .catch((err)=>{
        if(err && err instanceof Error) 
            return Promise.reject(err);
        return Promise.resolve({result:1});
    })
    //검증 결과 기록.
    .then((result)=>{
        saveValidationResult = result.result;
        return models.LogReceipt.create({
            State:result.result===1?1:10,
            ProductName:req.body.ProductName,
            Receipt:JSON.stringify(req.body.RawReceipt),
            TimeStamp:new Date(),
            GameUserID:req.user.GameUserID
        });
    })
    .then((createLogReceipt)=>{
        if(createLogReceipt.State === 10) {
            return models.DefineShop.findOne({
                where:{ProductName:req.body.ProductName}})
        }
        return Promise.resolve(null);
    })
    //자원 지급.
    .then((findShopData)=>{
        if(findShopData === null || findShopData === undefined) 
            return Promise.resolve({currency:null, item:null});
        return rewardCtrl.paymentMaterial(
            req.user.GameUserID, 
            findShopData['RewardSetGroupID']!==null
            ?findShopData['RewardSetGroupID']
            :findShopData['RewardGoodsGroupID'],
            findShopData['RewardSetGroupID']!==null
            );
    })
    .then((rewardResult)=>{
        res.send({result:saveValidationResult, reward:rewardResult})
    })
    .catch((err)=>{
        next(err);
    })
    
})

module.exports = router;