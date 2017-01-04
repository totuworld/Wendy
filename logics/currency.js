'use strict'

const later = require('later');

function GetOffSetTime(time, offsetTime) {
    return new Date(time + (offsetTime*3600000)).getTime();
}


/**
 * 재충전 가능한 통화의 충전 처리
 * 최대치 충전 주기나 재충전 주기를 고려한다.
 * @param OwnCurrencyData {Object}
 * @param GameUser  {Object}
 * @param RechargeInfo  {Object}
 * @param NowDate   {Date}
 */
exports.CheckForRecharge = (OwnCurrencyData, GameUser, RechargeInfo, NowDate)=>{

    //재충전 가능한 통화인가?
    if(OwnCurrencyData.RechargeCurrencyID === null
        || OwnCurrencyData.CurrentQNTY >= OwnCurrencyData.TotalQNTY) //혹은 최대치만큼 보유했는가?
        return {code:false};

    let nowTime = NowDate.getTime();
    let oldTime = new Date(OwnCurrencyData.UpdateTimeStamp).getTime();
    let oldOffTime = GetOffSetTime(oldTime, GameUser.OffsetTime);
    let updateValue = {CurrentQNTY:null, UpdateTimeStamp:null};

    //최대치 충전 주기가 있는가?
    if(RechargeInfo.SetMaxSwitch === true) {
        let convertLater = later.parse.cron(RechargeInfo.SetMaxPattern);
        let prevTime = later.schedule(convertLater).prev();
        let prevOffsetTime = GetOffSetTime(prevTime.getTime(), GameUser.OffsetTime );
        //UpdateTimeStamp가 prevTime보다 뒤에있는가?
        if(oldOffTime < prevOffsetTime) {
            updateValue.CurrentQNTY = OwnCurrencyData.TotalQNTY;
            updateValue.UpdateTimeStamp = NowDate;
            return {code:true, update:updateValue}
        }
    }

    //시간경과에 따른 업데이트 항목만 작동.
    let spendTime = (nowTime - oldTime)/1000;
    let rechargeAmount  = Math.floor(spendTime / RechargeInfo.IntervalTime);

    let totalAmount = OwnCurrencyData.CurrentQNTY + rechargeAmount;


    //현재 보유할 수 있는 최대수량을넘어가는가?
    if(totalAmount >= OwnCurrencyData.TotalQNTY) {
        updateValue.CurrentQNTY = OwnCurrencyData.TotalQNTY;
        updateValue.UpdateTimeStamp = NowDate;
        return {code:true, update:updateValue}
    }
    //최대 수량에 미치지 못하나 충전할만한 량이 있을때
    else if( rechargeAmount > 0) {
        updateValue.CurrentQNTY = totalAmount;
        updateValue.UpdateTimeStamp =
            new Date(
                oldTime +
                (rechargeAmount * RechargeInfo.IntervalTime)*1000
            );
        return {code:true, update:updateValue}
    }

    return {code:false};
}