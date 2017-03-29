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
 * object에 key가 적어도 하나라도 포함되어있는지 체크.
 */
exports.ObjectIncludeOneKey = (obj, keyArr)=>{
    for(let argValue of keyArr) {
        if(obj.hasOwnProperty(argValue) === true)
            return true;
    }
    return false;
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

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

exports.checkEmail = (email)=>{
    return emailRegEx.test(email);
}

const passwordRegEx = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/

exports.checkPassword = (password)=>{
    return passwordRegEx.test(password);
}
