'use strict'

const debug = require('debug')('Wendy:router:coupon');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');
const rewardCtrl = require('../logics/reward');

const express = require('express');
const router = express.Router();

/**
 * @api {GET} /coupon/list
 * @apiName 쿠폰 리스트 반환
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/list', auth.isAuthenticated, (req, res, next) => {
    models.DefineCoupon.findAll({
        include: [{
            model: models.CouponQNTY
        }]
    })
    .then((couponList)=>{
        res.send({result:0, list:couponList});
    })
})

/**
 * @api {GET} /coupon/use/:CouponName
 * @apiName 쿠폰 사용
 */
router.post('/use/:CouponName', auth.isAuthenticated, (req, res, next)=>{

    let now = new Date();

    let saveCoupon=null;
    let saveCouponQNTY=null;
    
    models.DefineCoupon.findOne({where:{CouponName:req.params.CouponName}})
    .then((defineCoupon)=>{
        //쿠폰이 존재하는가?
        if(defineCoupon === null || defineCoupon === undefined) 
            throw wendyError('UndefinedCoupon')
        //쿠폰이 사용가능한 기간인가?
        else if(defineCoupon['ExpiredDate'] < now) 
            throw wendyError('ExpiredCoupon')
        //지급할 상품이 정의되어있는가?
        else if(defineCoupon['RewardSetGroupID']===null 
            && defineCoupon['RewardGoodsGroupID']===null)
            throw wendyError('DidntRegisterCouponReward')
        saveCoupon = defineCoupon;
        return Promise.resolve(defineCoupon);
    })
    
    .then((defineCoupon)=>{
        //쿠폰의 잔여 수량이 존재하는가?
        //CounponQNTYID !== null
        if(defineCoupon['CouponQNTYID'] === null) {
            return Promise.resolve(defineCoupon);
        }
        return models.CouponQNTY.findOne({where:{CouponQNTYID:defineCoupon['CouponQNTYID']}})
        .then((couponQNTY)=>{
            if(couponQNTY['CurrentQNTY'] <= 0 ) {
                throw wendyError('NotEnoughCouponQNTY')
            }
            saveCouponQNTY = couponQNTY;
            return Promise.resolve()
        })
    })
    //쿠폰 기 사용 여부 확인
    .then(()=>{
        return models.LogCoupon.findOne({
            where:{
                GameUserID:req.user.GameUserID, 
                CouponID:saveCoupon['CouponID']}
            })
            .then((useLog)=>{
                if(useLog !== null) {
                    throw wendyError('AlreadyUsedCoupon')
                }
                return Promise.resolve();
            })
    })
    //쿠폰 카운트 차감(차감형 상품의 경우)
    .then(()=>{
        if(saveCouponQNTY !== null) {
            return saveCouponQNTY.decrement('CurrentQNTY', {by:1});
        }
        return Promise.resolve();
    })
    //쿠폰 사용 기록.
    .then(()=>{
        return models.LogCoupon.create({
                GameUserID:req.user.GameUserID, 
                CouponID:saveCoupon['CouponID'],
                UseTimeStamp:now
            })
    })
    //지급.
    .then(()=>{
        let rewardItem = 0;
        let isSet = true;
        if(saveCoupon['RewardSetGroupID']===null) {
            rewardItem = saveCoupon['RewardGoodsGroupID'];
            isSet = false;
        }
        else
            rewardItem = saveCoupon['RewardSetGroupID'];

        return rewardCtrl.paymentMaterial(req.user.GameUserID, rewardItem, isSet)
    })
    .then((result)=>{
        res.send({result:0, reward:result});
    })
    .catch((err)=>{
        next(err);
    })
})

module.exports = router;