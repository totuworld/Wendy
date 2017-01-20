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

/** 99102 */
class CredentialFailure extends CustomError {
    constructor() {
        let message = '대상 리소스에 유효한 인증 자격 증명이 없기 때문에 요청이 적용되지 않았다.';
        let code = 99102;
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

/** 80501 */
class NotInOwnItemList extends CustomError {
    constructor() {
        let message = '보유한 아이템 중에 해당 아이템이 없다.';
        let code = 80501;
        super(message, code);
    }
}

/** 80502 */
class MaterialDoesNotExistOwnItemList extends CustomError {
    constructor() {
        let message = '보유한 아이템 중에 재료로 사용할 아이템이 없다.';
        let code = 80502;
        super(message, code);
    }
}

/** 80503 */
class NotEnoughItem extends CustomError {
    constructor() {
        let message = '해당 아이템이 충분하지 않다.';
        let code = 80503;
        super(message, code);
    }
}

/** 80511 */
class CantReinfoceItem extends CustomError {
    constructor() {
        let message = '강화가 불가능한 아이템';
        let code = 80511;
        super(message, code);
    }
}

/** 80512 */
class DidntRegisterReinfoceRequireItem extends CustomError {
    constructor() {
        let message = '강화에 필요한 아이템이 등록하지 않았다';
        let code = 80512;
        super(message, code);
    }
}

/** 80513 */
class NoLongerReinforce extends CustomError {
    constructor() {
        let message = '더 이상 강화되지 않는다(최대레벨도달)';
        let code = 80513;
        super(message, code);
    }
}

/** 80521 */
class CantUpgradeItem extends CustomError {
    constructor() {
        let message = '승급이 불가능한 아이템';
        let code = 80521;
        super(message, code);
    }
}

/** 80522 */
class DidntRegisterUpgradeRequireItem extends CustomError {
    constructor() {
        let message = '승급에 필요한 아이템이 등록하지 않았다';
        let code = 80522;
        super(message, code);
    }
}

/** 80523 */
class NoLongerUpgrade extends CustomError {
    constructor() {
        let message = '더 이상 승급이 불가능(최대 등급 도달)';
        let code = 80523;
        super(message, code);
    }
}

let errorMap = {
    "DontHaveRequiredParams":DontHaveRequiredParams,
    "CredentialFailure":CredentialFailure,
    "UnregisteredDevice":UnregisteredDevice,
    "UsedOnOtherDevice":UsedOnOtherDevice,
    "CreateID":CreateID,
    "UsedNickName":UsedNickName,
    "NickNameToLongOrShot":NickNameToLongOrShot,

    "NotInOwnItemList":NotInOwnItemList,
    "MaterialDoesNotExistOwnItemList":MaterialDoesNotExistOwnItemList,
    "NotEnoughItem":NotEnoughItem,

    "CantReinfoceItem":CantReinfoceItem,
    "DidntRegisterReinfoceRequireItem":DidntRegisterReinfoceRequireItem,
    "NoLongerReinforce":NoLongerReinforce,

    "CantUpgradeItem":CantUpgradeItem,
    "DidntRegisterUpgradeRequireItem":DidntRegisterUpgradeRequireItem,
    "NoLongerUpgrade":NoLongerUpgrade
}

module.exports = function(errorName) {
    let error = new errorMap[errorName];
    return error;
}