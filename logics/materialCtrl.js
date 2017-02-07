'use strict'

const models = require('../models');
const wendyError = require('../utils/error');


exports.existEnoughMaterial = (GameUserID, ItemID, Amount, ItemUIDList=null)=>{

    return models.DefineItem.findOne({
        where:{
            ItemID:ItemID
        }
    })
    .then((defineItem)=>{
        switch(defineItem.ItemType) {
            case 10://통화 상품
                return existEnoughMaterialForCurrency(
                    GameUserID, ItemID, Amount);
                break;
            default ://특별한 정의가 없다면 모두 아이템을 처리한다.
                return existEnoughMaterialForItem(
                    GameUserID, ItemID, Amount, ItemUIDList);
                break;
        }
    })

}

let existEnoughMaterialForItem = ( GameUserID, ItemID, Amount, ItemUIDList = null )=>{

    return Promise.resolve()
    .then(()=>{
        if(ItemUIDList !== null) 
            return models.OwnItem.findAll({where:{OwnItemUID:{$in:ItemUIDList}, ItemID:ItemID}});
        return models.OwnItem.findAll({where:{GameUserID:GameUserID, ItemID:ItemID}});
    })
    .then((ownItemList)=>{
        if( ownItemList === null 
            || ownItemList === undefined 
            ||ownItemList.length === 0)
            throw wendyError('NotEnoughItem');

        let totalAmount = 0;
        let ownItemUIDList = ItemUIDList || [];
        ownItemList.forEach((entry)=>{
            totalAmount += entry.CurrentQNTY;
            if(ItemUIDList === null) 
                ownItemUIDList.push(entry.OwnItemUID)
        })

        if(totalAmount < Amount)
            throw wendyError('NotEnoughItem');

        
        return Promise.resolve(ownItemList);
    })
    .catch((err)=>{
        return Promise.reject(err);
    })
}

let existEnoughMaterialForCurrency = ( GameUserID, ItemID, Amount)=>{

    return Promise.resolve()
    .then(()=>{
        return models.OwnCurrency.findOne({where:{GameUserID:GameUserID, CurrencyID:ItemID}});
    })
    .then((ownCurrency)=>{
        if(ownCurrency === null || ownCurrency === undefined)
            throw wendyError('NotEnoughItem');
        
        if(ownCurrency.CurrentQNTY < Amount)
            throw wendyError('NotEnoughItem');

        return Promise.resolve(ownCurrency.OwnCurrencyUID);
    })
    .catch((err)=>{
        return Promise.reject(err);
    })
}


exports.decrementMaterial = (GameUserID, ItemID, Amount, ItemUIDList=null)=>{
    console.log(`decrementMaterial ${ItemID}`);
     return models.DefineItem.findOne({
        where:{
            ItemID:ItemID
        }
    })
    .then((defineItem)=>{
        switch(defineItem.ItemType) {
            case 10://통화 상품
                return decrementMaterialForCurrency(
                    GameUserID, ItemID, Amount);
                break;
            default ://특별한 정의가 없다면 모두 아이템을 처리한다.
                return decrementMaterialForItem(
                    GameUserID, defineItem, ItemID, Amount, ItemUIDList);
                break;
        }
    })
}

let decrementMaterialForItem = (GameUserID, DefineItemInfo, ItemID, Amount, ItemUIDList=null)=>{
    let findQuery = {
        GameUserID:GameUserID,
        ItemID:ItemID
    }
    if(ItemUIDList !== null)
        findQuery['OwnItemUID'] = {$in:ItemUIDList};

    console.log(`findQuery : ${findQuery}`);
    console.log(findQuery);
    
    //다수 보유가 불가능한 아이템이면 row를 갯수만큼 삭제.
    if(DefineItemInfo.Multiple===false)
        return models.OwnItem.destroy({
            where:findQuery,
            limit:Amount
        });
    
    //다수 보유가 가능하면 한 상품에서 Amount만큼 차감.
    return models.OwnItem.findOne({where:findQuery})
    .then((ownItem)=>{
        return ownItem.decrement('CurrentQNTY', {by:Amount});
    })
}

let decrementMaterialForCurrency = (GameUserID, ItemID, Amount)=>{

    return models.OwnCurrency.findOne({
        where:{
            GameUserID:GameUserID, 
            CurrencyID:ItemID
        }})
    .then((ownCurrency)=>{
        return ownCurrency.decrement('CurrentQNTY', {by:Amount});
    })
}

let incrementMaterial = (GameUserID, ItemID, Amount, NowMaxQNTY=null)=>{
    return models.DefineItem.findOne({
        where:{
            ItemID:ItemID
        }
    })
    .then((defineItem)=>{
        if(defineItem === null || defineItem === undefined)
            throw wendyError('UndefinedItem');

        switch(defineItem.ItemType) {
            case 10://통화 상품
                return incrementMaterialForCurrency(
                    GameUserID, ItemID, Amount, NowMaxQNTY);
                break;
            default ://특별한 정의가 없다면 모두 아이템을 처리한다.
                return incrementMaterialForItem(
                    GameUserID, defineItem, ItemID, Amount);
                break;
        }
    })
}

exports.incrementMaterial = incrementMaterial;

let createCurrency = (GameUserID, ItemID, Amount, defineCurrency=null, NowMaxQNTY=null)=>{
    let createObj = {
        GameUserID:GameUserID, 
        CurrencyID:ItemID,
        CurrentQNTY:Amount,
        NowMaxQNTY:NowMaxQNTY===null?100:NowMaxQNTY,
        UpdateTimeStamp:new Date()
    }

    return Promise.resolve()
    .then(()=>{
        if(NowMaxQNTY!==null)
            return Promise.reject('pass');
        return Promise.resolve();
    })
    .then(()=>{
        if( defineCurrency!==null )
            createObj.NowMaxQNTY = defineCurrency.MaxQNTY;
        return Promise.resolve();
    })
    .catch((err)=>{
        if(err && err instanceof Error) {
            return Promise.reject(err);
        }
        else if(err==='pass')
            return Promise.resolve();
    })
    .then(()=>{
        return models.OwnCurrency.create(createObj);
    })
}

let incrementMaterialForCurrency = (GameUserID, ItemID, Amount, NowMaxQNTY=null)=>{
    let defineCurrency = null;

    return models.DefineCurrency.findOne({where:{CurrencyID:ItemID}})
    .then((loadDefineCurrency)=>{
        if( !(loadDefineCurrency === null || loadDefineCurrency===undefined) )
            defineCurrency = loadDefineCurrency;
        return Promise.resolve();
    })
    .then(()=>{
        return models.OwnCurrency.findOne({
            where:{
                GameUserID:GameUserID, 
                CurrencyID:ItemID
            }})
    })
    .then((ownCurrency)=>{
        if(ownCurrency === null || ownCurrency === undefined)
            return createCurrency(
                GameUserID, 
                ItemID, 
                Amount, 
                defineCurrency,
                NowMaxQNTY);
        
        let incrementValue = (ownCurrency.CurrentQNTY + Amount);
        if(incrementValue>defineCurrency.MaxQNTY)
            incrementValue = defineCurrency.MaxQNTY;

        return models.OwnCurrency.update(
            { CurrentQNTY: incrementValue, UpdateTimeStamp: new Date() },
            { where: { OwnCurrencyUID: ownCurrency['OwnCurrencyUID'] } }
        )
            .then(() => {
                return models.OwnCurrency.findOne({
                    where: { OwnCurrencyUID: ownCurrency['OwnCurrencyUID'] }
                })
            })
    })
    
}

let incrementMaterialForItem = (GameUserID, defineItem, ItemID, Amount)=>{
    return Promise.resolve()
    .then(()=>{
        if(defineItem.Multiple===false)
            return Promise.reject('create');
        return Promise.resolve();
    })
    .then(()=>{
        return models.OwnItem.findOne({where:{
            GameUserID:GameUserID,
            ItemID:ItemID
        }})
    })
    .then((ownItem)=>{
        if(ownItem === null || ownItem === undefined)
            return Promise.reject('create');
        
        let incrementValue = 
            (ownItem.CurrentQNTY + Amount)>defineItem.MaxQNTY
            ? defineItem.MaxQNTY - ownItem.CurrentQNTY
            : Amount;
        
        return ownItem.increment('CurrentQNTY', {by:incrementValue})
        .then(()=>{
            return models.OwnItem.findOne({where:{
                OwnItemID:ownItem['OwnItemUID']
            }})
        })
    })
    .catch((err)=>{
        if(err && err instanceof Error) {
            return Promise.reject(err);
        }
        else if(err==='create') {
            return models.OwnItem.create({
                GameUserID:GameUserID,
                ItemID:ItemID,
                CurrentQNTY:Amount,
                UpdateTimeStamp:new Date()
            });
        }
    })
}