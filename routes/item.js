'use strict'

const debug = require('debug')('Wendy:router:item');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');

const materialCtrl = require('../logics/materialCtrl');

const express = require('express');
const router = express.Router();

/**
 * @api {GET} /item/own
 * @apiName 보유 아이템 목록 요청
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/own', auth.isAuthenticated, (req, res, next) => {
    models.OwnItem.findAll({
        where: { GameUserID: req.user.GameUserID }
    })
    .then((ownItemList) => {
        res.send({ result: 0, list: ownItemList });
    })
    .catch((err) => {
        next(err);
    });
})

/**
 * @api {GET} /item/define
 * @apiName 정의된 아이템 정보 요청
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/define', auth.isAuthenticated, (req, res, next)=>{
    models.DefineItem.findAll()
    .then((DefineItemList) => {
        res.send({ result: 0, list: DefineItemList });
    })
    .catch((err) => {
        next(err);
    });
})

/**
 * @api {GET} /item/define/reinforce
 * @apiName 강화 관련 아이템 데이터 조회
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/define/reinforce', auth.isAuthenticated, (req, res, next)=>{
    models.DefineReinforceItem.findAll({
        include: [{
            model: models.DefineReinforceRequireItem,
            as: 'LevelInfo'
        }]
    })
    .then((defineReinforceItem)=>{
        res.send({result:0, list:defineReinforceItem});
    })
})

/**
 * @api {GET} /item/define/upgrade
 * @apiName 승급 관련 아이템 데이터 조회
 * @apiHeader {String} Authorization JWT토큰을 전송
 */
router.get('/define/upgrade', auth.isAuthenticated, (req, res, next)=>{
    models.DefineUpgradeItem.findAll({
        include: [{
            model: models.DefineUpgradeRequireItem,
            as: 'UpgradeInfo'
        }]
    })
    .then((defineUpgradeItem)=>{
        res.send({result:0, list:defineUpgradeItem});
    })
})


function LoadOwnItem(OwnItemUID, GameUserID) {
    //소유 아이템 조회
    return models.OwnItem.findOne(
        {where:
            {
                OwnItemUID: OwnItemUID, 
                GameUserID: GameUserID
            }
        })
    .then((ownItem)=>{
        //아이템이 존재하는지 체크
        if(ownItem === null || ownItem === undefined)
            throw wendyError('NotInOwnItemList');
        return Promise.resolve(ownItem);
    })
}

function LoadDefineItem(ItemID, errType='CantReinfoceItem') {
    //아이템 정보 로딩
    return models.DefineItem.findOne({
                where:{
                    ItemID:ItemID
                }
            })
    .then((itemInfo)=>{
        if(itemInfo.ReinforceItemID === null)
            throw wendyError(errType);
        return Promise.resolve(itemInfo);
    })
}

/**
 * 소모할 아이템 및 통화를 fn에 따라서 검증 및 소모.
 * @param {function} fn 실행할 메서드
 * materialCtrl의 existEnoughMaterial, decrementMaterial을 사용
 */
function DecoretorMaterials(
    fn, 
    LoadInfos, GameUserID, 
    materialItemUID, materialCurrencyUID) {

    let promises = [];
    LoadInfos.forEach((value, key)=>{
        promises.push(
            fn(
                GameUserID,
                value.ItemID,
                value.RequireQNTY,
                value.DefineItem.ItemType===10
                    ?materialItemUID
                    :materialCurrencyUID)
        );
    })

    if(promises.length > 0)
        return Promise.all(promises);
    return Promise.resolve();
}

/**
 * @api {POST} /item/reinforce/:OwnItemUID
 * @apiName 강화 요청
 * @apiHeader {String} Authorization JWT토큰을 전송
 * @apiParam {Array} materialItemUID 소모할 ItemUID
 * @apiParam {Array} materialCurrencyUID 소모할 CurrencyUID
 */
router.post('/reinforce/:OwnItemUID', auth.isAuthenticated, (req, res, next)=>{

    let checkRequestBody = commonFunc.ObjectExistThatKeys(
            req.body, 
            ['materialItemUID', 'materialCurrencyUID']);
    if(checkRequestBody === false) {
        throw wendyError('DontHaveRequiredParams');
    }

    let loadItems = { 
        targetItem : null,
        targetItemInfo : null,
        LoadInfos : new Map()
    };

    //보유 아이템 로딩
    LoadOwnItem(
        req.params.OwnItemUID, 
        req.user.GameUserID)
    .then((OwnItem)=>{
        loadItems.targetItem = OwnItem;
        return Promise.resolve();
    })
    //아이템 정보 로딩
    .then(()=>{
        return LoadDefineItem(
            loadItems.targetItem.ItemID
        );
    })
    .then((itemInfo)=>{
        loadItems.targetItemInfo = itemInfo;
        return Promise.resolve();
    })
    //강화 데이터 로딩.
    .then(()=>{
        return  models.DefineReinforceItem.findOne({
            where:{
                ReinforceItemID:
                    loadItems.targetItemInfo['ReinforceItemID']
            },
            include: [{
                model: models['DefineReinforceRequireItem'],
                as: 'LevelInfo',
                include: [{
                    model: models.DefineItem,
                    attributes : ['ItemType', 'Multiple']
                }]
            }]
        })
    })
    .then((reinfoceInfos)=>{

        //강화에 사용되는 아이템이 정의되었는가?
        if(reinfoceInfos.LevelInfo.length === 0) 
            throw wendyError('DidntRegisterReinfoceRequireItem');

        //Level로 정렬.
        reinfoceInfos.LevelInfo.sort((a,b)=>{
            return a.Level - b.Level;
        })

        //다음 레벨로 강화가 가능한지 확인?
        let possibleLevelUp = false;
        for(let row of reinfoceInfos.LevelInfo) {
            if(row['Level'] === loadItems.targetItem['Level']) {
                possibleLevelUp = true;
                loadItems.LoadInfos.set(row.ItemID, row);
            }
        }
        if(possibleLevelUp === false)
            throw wendyError('NoLongerReinforce')

        return Promise.resolve();
    })
    //아이템과 통화를 충분한 량 보유했는지 체크.
    .then(()=>{
        return DecoretorMaterials(
            materialCtrl.existEnoughMaterial,
            loadItems.LoadInfos,
            req.user.GameUserID,
            req.body.materialItemUID,
            req.body.materialCurrencyUID
        );
    })
    //아이템 및 통화, 삭제 혹은 차감처리
    .then(()=>{
        return DecoretorMaterials(
            materialCtrl.decrementMaterial,
            loadItems.LoadInfos,
            req.user.GameUserID,
            req.body.materialItemUID,
            req.body.materialCurrencyUID
        );
    })
    //강화로 레벨업 반영.
    .then(()=>{
        return models.OwnItem.update({
            Level:loadItems.targetItem['Level']+1
        },
        {where:{
            OwnItemUID:loadItems.targetItem.OwnItemUID
        }});
    })
    .then(()=>{
        res.send({result:0});
    })
    .catch((err)=>{
        next(err);
    })
})

module.exports = router;