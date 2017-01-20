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