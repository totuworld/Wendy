'use strict'

const debug = require('debug')('Wendy:router:device');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');

const express = require('express');
const router = express.Router();


//토큰 요청
router.get('/token/:UUID', (req, res, next)=>{
    
    //UUID로 등록된 기기가 있는가?
    models.GameDevice.findOne({where:{UUID:req.params.UUID}})
        .then((findGameDevice)=>{
            if(findGameDevice === null) {
                //err 기기미등록
                throw wendyError('UnregisteredDevice');
            }
            //기기에 GameUserID가 null인가?
            if(findGameDevice.GameUserGameUserID === null) {
                //err 등록된 기기이며 아이디가 미생성된 경우
                throw wendyError('CreateID');
            }
            //주 사용 기기가 아닌가?(다른 기기에서 사용중인가?)
            if(findGameDevice.MainFlag === false) {
                //err 다른 기기에서 Main으로 사용중인 경우.
                throw wendyError('UsedOnOtherDevice');
            }
            return Promise.resolve(findGameDevice);
        })
        .then((findGameDevice)=>{
            let tokenObj = {GameUserID:findGameDevice.GameUserGameUserID, GameDeviceUID:findGameDevice.GameDeviceUID};
            let token = auth.signToken(tokenObj);
            return Promise.resolve({
                result:0,
                token:token
            })
        })
        //결과 전달.
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            next(err);
        })
});

//기기 등록
router.post('/', (req, res, next)=>{   
    //req.body
    //UUID
    //DeviceType
    
    let checkRequestBody = commonFunc.ObjectExistThatKeys(req.body, ['UUID', 'DeviceType']);
    if(checkRequestBody === false) {
        throw wendyError('DontHaveRequiredParams');
    }

    //UUID로 등록된 기기가 있는가?
    models.GameDevice.findOne({where:{UUID:req.body.UUID}})
        .then((findGameDevice)=>{
            if(findGameDevice === null) {
                //기기등록 시작
                return models.GameDevice.create({UUID:req.body.UUID, DeviceType:req.body.DeviceType})
            }
            return Promise.reject(findGameDevice);
        })
        .then((gameDeviceData)=>{
            return Promise.resolve({result:0})
        })
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            next(err);
        })
})


module.exports = router;