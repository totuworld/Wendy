'use strict'


/**
 * object에 key가 포함되어있는지 체크한다
 * @param obj       {object}
 * @param keyArr    {Array}
 * @returns {boolean}
 */
exports.ObjectExistThatKeys = (obj, keyArr)=>{
    for(let key of keyArr) {
        if(obj[key]===null || obj[key]===undefined) {
            return false;
        }
    }
    return true;
}