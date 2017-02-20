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

/**
 * low와 high 사이의 숫자를 랜덤으로 리턴한다.
 * @returns {number}
 */
exports.RandomInt = (low, high)=>{
    return Math.floor(Math.random() * (high - low + 1) + low);
};

function async(makeGenerator) {
    return function () {
        let generator = makeGenerator.apply(this, arguments)

        function handle(result) { // { done: [Boolean], value: [Object] }
            if (result.done) return result.value

            return result.value.then(function (res) {
                return handle(generator.next(res))
            }, function (err) {
                return handle(generator.throw(err))
            })
        }

        return handle(generator.next())
    }
}

exports.async = async;