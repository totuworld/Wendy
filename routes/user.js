'use strict'

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

const debug = require('debug')('Wendy:router:user');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');

const express = require('express');
const router = express.Router();


//사용자 등록
router.post('/', (req, res, next)=>{
    //req.body
    //NickName
    //Locale
    //UUID
    //OffsetTime


    let checkRequestBody = commonFunc.ObjectExistThatKeys(req.body, ['UUID', 'NickName', 'Locale']);
    if(checkRequestBody === false) {
        throw wendyError('DontHaveRequiredParams');
    }
    
    if( (req.body.NickName.length >= 3 && req.body.NickName.length <= 12)=== false) {
        throw wendyError('NickNameToLongOrShot');
    }

    
    //검증
    //UUID로 등록된 기기가 있는가?
    //yes:pass
    //no:error 기기등록 필요
    //기기에 GameUserID가 0인가?
    //yes: 신규 등록 진행
    //no:error 이미 아이디를 생성했음.
    //NickName이 이미 사용중인가?
    //yes:error 다른 닉네임 사용권고
    //no:pass

    let saveGameDeviceUID = 0;
    let saveGameUserID = 0;
    
    function CreateResult() {
        let tokenObj = {GameUserID:saveGameUserID, GameDeviceUID:saveGameDeviceUID};
        let token = auth.signToken(tokenObj);
        return Promise.resolve({
            result:0,
            token:token
        })
    }
    
    //UUID로 등록된 기기가 있는가?
    models.GameDevice.findOne({where:{UUID:req.body.UUID}})
        .then((findGameDevice)=>{
            if(findGameDevice === null) {
                //err 기기미등록
                throw wendyError('UnregisteredDevice');
            }
            //기기에 GameUserID가 null인가?
            else if(findGameDevice.GameUserID !== null) {
                saveGameDeviceUID = findGameDevice.GameDeviceUID;
                saveGameUserID = findGameDevice.GameUserID;
                //err 등록된 기기이며 아이디가 이미 있는 상태
                return Promise.reject('pass')
            }
            saveGameDeviceUID = findGameDevice.GameDeviceUID;
            return Promise.resolve();
        })
        .catch((err)=>{
            switch(err) {
                case 'pass':
                    return CreateResult()
                        .then((resultObj)=>{
                            return Promise.reject(resultObj);
                        })
                    break;
                default:
                    return Promise.reject(err);
                    break;
            }
        })
        //NickName이 이미 사용중인가?
        .then(()=>{
            return models.GameUser.findOne({where:{NickName:req.body.NickName}})
        })
        .then((findGameUser)=>{
            if(findGameUser !== null) {
                //err 이미 사용중인 NickName
                throw wendyError('UsedNickName');
            }
            return Promise.resolve();
        })
        //GameUser 등록
        .then(()=>{
            return models.GameUser.create({NickName:req.body.NickName, Locale:req.body.Locale, OffsetTime:req.body.OffsetTime});
        })
        .then((createGameUser)=>{
            saveGameUserID = createGameUser.GameUserID;
            return Promise.resolve();
        })
        //GameDevice 업데이트
        .then(()=>{
            if(saveGameDeviceUID === 0) {
                return Promise.resolve();
            }
            return models.GameDevice.update({GameUserID:saveGameUserID}, {where:{GameDeviceUID:saveGameDeviceUID}});
        })
        //전송 결과 제작
        .then(CreateResult)
        //결과 전달.
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            if(err && err instanceof Error) {
                next(err);
            }
            else {
                res.send(err);
            }
        })
});

//사용자 정보 조회
router.get('/', auth.isAuthenticated, (req, res, next)=>{
    let nowDate = new Date();

    models.GameUser.update({loginAt:nowDate}, {where:{GameUserID:req.user.GameUserID}})
        .then(()=>{
            return models.GameUser.findOne({where:{GameUserID:req.user.GameUserID}})
        })
        .then((findGameUser)=>{
            let returnObj = {result:0, UserInfo:findGameUser};
            res.send(returnObj);
        })
});

module.exports = router;
