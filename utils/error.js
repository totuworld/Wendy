'use strict'

class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

/** 99101 */
class DontHaveRequiredParams extends CustomError {
    constructor() {
        let message = 'req.body에 필요한 값이 빠졌다.';
        let code = 99101;
        super(message, code);
    }
}

/** 80101 */
class UnregisteredDevice extends CustomError {
    constructor() {
        let message = '등록하지 않은 기기';
        let code = 80101;
        super(message, code);
    }
}

/** 80103 */
class UsedOnOtherDevice extends CustomError {
    constructor() {
        let message = '다른기기에서 사용중인 아이디';
        let code = 80103;
        super(message, code);
    }
}

/** 80202 */
class CreateID  extends CustomError {
    constructor() {
        let message = '등록된 기기이나 아이디가 생성되지않았다.';
        let code = 80202;
        super(message, code);
    }
}

/** 80203 */
class UsedNickName  extends CustomError {
    constructor() {
        let message = '이미 사용중인 NickName';
        let code = 80203;
        super(message, code);
    }
}

/** 80204 */
class NickNameToLongOrShot extends CustomError {
    constructor() {
        let message = '3글자보다 짧거나 12글자 이상인 NickName';
        let code = 80204;
        super(message, code);
    }
}

let errorMap = {
    "DontHaveRequiredParams":DontHaveRequiredParams,
    "UnregisteredDevice":UnregisteredDevice,
    "UsedOnOtherDevice":UsedOnOtherDevice,
    "CreateID":CreateID,
    "UsedNickName":UsedNickName,
    "NickNameToLongOrShot":NickNameToLongOrShot
}

module.exports = function(errorName) {
    let error = new errorMap[errorName];
    return error;
}