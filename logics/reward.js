"use strict";

const models = require('../models');
const wendyError = require('../utils/error');
const commonFunc = require('../utils/commonFunc');
const materialCtrl = require('../logics/materialCtrl');

exports.paymentMaterial = (GameUserID, RewardSetGroupID, isSet=true)=>{
    return new Promise((resolve, reject)=>{
        if(isSet) resolve();
        else reject('PassSet');
    })
    .then(()=>{
        return LoadRewardSetInfo(RewardSetGroupID)
    })
    .then((rewardSetGroupInfo)=>{
        let forLoop = commonFunc.async(function* () {
            let returnArr = [];
            for(let row of rewardSetGroupInfo['SetInfo']) {
                let pickRandom = Math.random();
                if(pickRandom<=row['DropRatio']) {
                    returnArr.push(
                        yield paymentMaterialWithRewardGroup(
                            GameUserID, row['RewardGoodsGroupID']
                        ));
                }
            }
            return returnArr;
        })

        return forLoop();
    })
    .catch((err)=>{
        if(err && err instanceof Error) {
            return Promise.reject(err);
        }
        else if(err === 'PassSet') 
            return paymentMaterialWithRewardGroup(GameUserID, RewardSetGroupID)
            .then((result)=>{
                return Promise.resolve([result]);
            })
    })
    .then((resultArr)=>{
        let mapObj = {item:new Map(), currency:new Map()};
        for(let row of resultArr) {
            if(row['OwnItemUID'] !== undefined) {
                if(mapObj.item.has(row['OwnItemUID']))
                    mapObj.item.delete(row['OwnItemUID']);
                mapObj.item.set(row['OwnItemUID'], row)
            }
            else {
                if(mapObj.currency.has(row['OwnCurrencyUID']))
                    mapObj.currency.delete(row['OwnCurrencyUID']);
                mapObj.currency.set(row['OwnCurrencyUID'], row)
            }
        }

        let returnObj = {item:[], currency:[]};
        mapObj.item.forEach((value, key)=>{
            returnObj.item.push(value);
        })
        mapObj.currency.forEach((value, key)=>{
            returnObj.currency.push(value);
        })

        return Promise.resolve(returnObj);
    })
}

/**
 * RewardSetGroupID를 바탕으로 
 */
let LoadRewardSetInfo = (RewardSetGroupID)=>{
    return models.RewardSetGroup.findOne(
        {
            where:{RewardSetGroupID:RewardSetGroupID},
            include: [{
                model: models.RewardSet,
                as:'SetInfo'
            }]
        })
    .then((rewardSetGroupInfo)=>{
        if(rewardSetGroupInfo === null || rewardSetGroupInfo === undefined)
            throw wendyError('NotPresentRewardSetGroupID');
        else if(rewardSetGroupInfo['SetInfo'].length === 0) 
            throw wendyError('DidntRegisterRewardSet');
        
        rewardSetGroupInfo['SetInfo']
        .sort((a,b)=>{
            return b.DropRatio - a.DropRatio;
        })
        
        return Promise.resolve(rewardSetGroupInfo);
    })
}


let paymentMaterialWithRewardGroup = (GameUserID, RewardGoodsGroupID)=>{
    //대상 상품 정보 로딩.
    return LoadRewardGoodsInfo(RewardGoodsGroupID)
    //상품 선택.
    .then((rewardGoodsInfo)=>{
        let pickRandom = Math.random();
        let totalRatio = 0;

        for(let row of rewardGoodsInfo['GoodsInfo']) {
            totalRatio += row['DropRatio'];
            if(pickRandom<= totalRatio)
                return Promise.resolve(row);
        }
        //대상 상품을 모두 검색해도 지급할 상품이 없는 경우.
        return Promise.reject('pass');
    })
    //상품 지급.
    .then((targetGoods)=>{
        let amount = 
            (targetGoods['AmountMin'] === targetGoods['AmountMax'])
            ? targetGoods['AmountMin']
            : commonFunc.RandomInt(targetGoods['AmountMin'], targetGoods['AmountMax']);
        //TODO : 생성으로 자원을 추가할 때 통화의 NowMaxQNTY를 처리하는 로직을 넣어서 여기서 값을 넘길 수 있다.
        return materialCtrl.incrementMaterial(GameUserID, targetGoods['ItemID'], amount);
    })
    .catch((err)=>{
        if(err && err instanceof Error) {
            return Promise.reject(err);
        }
        else if(err === 'pass') 
            return Promise.resolve(null);
        
        return Promise.reject(err);
    })
}

/**
 * RewardGoodsGroupID로 데이터 로딩. 
 */
let LoadRewardGoodsInfo = (RewardGoodsGroupID)=>{
    return models.RewardGoodsGroup.findOne({
        where : {
            RewardGoodsGroupID:RewardGoodsGroupID
        },
        include : [{
            model: models.RewardGoods,
            as:'GoodsInfo'
        }]
    })
    .then((rewardGoodsInfo)=>{
        if(rewardGoodsInfo === null || rewardGoodsInfo === undefined)
            throw wendyError('NotPresentRewardGoodsGroupID');
        else if(rewardGoodsInfo['GoodsInfo'].length === 0)
            throw wendyError('DidntRegisterRewardGoods');
        
        rewardGoodsInfo['GoodsInfo']
        .sort((a, b)=>{
            return b.DropRatio - a.DropRatio;
        })
        return Promise.resolve(rewardGoodsInfo);
    })
}