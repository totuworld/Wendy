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

/** 99201 */
class WrongEmailOrPassword extends CustomError {
    constructor() {
        let message = 'email 이나 password가 없거나 틀렸다.';
        let code = 99201;
        super(message, code);
    }
}

/** 99202 */
class UsedEmail extends CustomError {
    constructor() {
        let message = '이미 사용중인 email';
        let code = 99202;
        super(message, code);
    }
}

/** 99203 */
class WrongEmail extends CustomError {
    constructor() {
        let message = 'email 형식이 아니다';
        let code = 99203;
        super(message, code);
    }
}

/** 99204 */
class WrongPassword extends CustomError {
    constructor() {
        let message = 'password는 최소 1개의 숫자 혹은 특수문자를 포함한 8~16자리여야 한다';
        let code = 99204;
        super(message, code);
    }
}

/** 99205 */
class LockdownUserAccess extends CustomError {
    constructor() {
        let message = 'password 입력 실패 5회로 권한 박탈, 관리자에게 문의!';
        let code = 99205;
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

/** 80504 */
class UndefinedItem extends CustomError {
    constructor() {
        let message = '정의되지 않은 아이템이다.';
        let code = 80504;
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

/** 80611 */
class NotPresentRewardSetGroupID extends CustomError {
    constructor() {
        let message = 'RewardSetGroupID가 존재하지 않는다.';
        let code = 80611;
        super(message, code);
    }
}

/** 80612 */
class DidntRegisterRewardSet extends CustomError {
    constructor() {
        let message = 'RewardSetGroupID와 관련된 정보를 RewardSet에 등록하지 않았다.';
        let code = 80612;
        super(message, code);
    }
}


/** 80621 */
class NotPresentRewardGoodsGroupID extends CustomError {
    constructor() {
        let message = 'RewardGoodsGroupID가 존재하지 않는다.';
        let code = 80621;
        super(message, code);
    }
}

/** 80622 */
class DidntRegisterRewardGoods extends CustomError {
    constructor() {
        let message = 'RewardGoodsGroupID와 관련된 정보를 RewardGoods에 등록하지 않았다.';
        let code = 80622;
        super(message, code);
    }
}

/** 80701 */
class UnsupportedReceiptType extends CustomError {
    constructor() {
        let message = '지원하지 않거나 존재하지 않는 영수증타입(ReceipType)';
        let code = 80701;
        super(message, code);
    }
}

/** 80702 */
class InitializationFirst extends CustomError {
    constructor() {
        let message = '초기화를 먼저 진행해야한다.';
        let code = 80702;
        super(message, code);
    }
}

/** 90101 */
class UndefinedCoupon extends CustomError {
    constructor() {
        let message = '쿠폰이 존재하지 않는다.';
        let code = 90101;
        super(message, code);
    }
}

/** 90102 */
class ExpiredCoupon extends CustomError {
    constructor() {
        let message = '만료된 쿠폰';
        let code = 90102;
        super(message, code);
    }
}

/** 90103 */
class DidntRegisterCouponReward extends CustomError {
    constructor() {
        let message = '쿠폰에 지급할 상품이 정의되지 않았다.';
        let code = 90103;
        super(message, code);
    }
}

/** 90104 */
class NotEnoughCouponQNTY extends CustomError {
    constructor() {
        let message = '쿠폰 재고 모두 소진';
        let code = 90104;
        super(message, code);
    }
}

/** 90105 */
class AlreadyUsedCoupon extends CustomError {
    constructor() {
        let message = '이미 사용한 쿠폰';
        let code = 90105;
        super(message, code);
    }
}


let errorMap = {
    "DontHaveRequiredParams":DontHaveRequiredParams,
    "CredentialFailure":CredentialFailure,
    "WrongEmailOrPassword":WrongEmailOrPassword,
    "UsedEmail":UsedEmail,
    "WrongEmail":WrongEmail,
    "WrongPassword":WrongPassword,
    "LockdownUserAccess":LockdownUserAccess,
    "UnregisteredDevice":UnregisteredDevice,
    "UsedOnOtherDevice":UsedOnOtherDevice,
    "CreateID":CreateID,
    "UsedNickName":UsedNickName,
    "NickNameToLongOrShot":NickNameToLongOrShot,

    "NotInOwnItemList":NotInOwnItemList,
    "MaterialDoesNotExistOwnItemList":MaterialDoesNotExistOwnItemList,
    "NotEnoughItem":NotEnoughItem,
    "UndefinedItem":UndefinedItem,

    "CantReinfoceItem":CantReinfoceItem,
    "DidntRegisterReinfoceRequireItem":DidntRegisterReinfoceRequireItem,
    "NoLongerReinforce":NoLongerReinforce,

    "CantUpgradeItem":CantUpgradeItem,
    "DidntRegisterUpgradeRequireItem":DidntRegisterUpgradeRequireItem,
    "NoLongerUpgrade":NoLongerUpgrade,

    "NotPresentRewardSetGroupID":NotPresentRewardSetGroupID,
    "DidntRegisterRewardSet":DidntRegisterRewardSet,

    "NotPresentRewardGoodsGroupID":NotPresentRewardGoodsGroupID,
    "DidntRegisterRewardGoods":DidntRegisterRewardGoods,

    "UndefinedCoupon":UndefinedCoupon,
    "ExpiredCoupon":ExpiredCoupon,
    "DidntRegisterCouponReward":DidntRegisterCouponReward,
    "NotEnoughCouponQNTY":NotEnoughCouponQNTY,
    "AlreadyUsedCoupon":AlreadyUsedCoupon,

    "UnsupportedReceiptType":UnsupportedReceiptType,
    "InitializationFirst":InitializationFirst
}

module.exports = function(errorName) {
    let error = new errorMap[errorName];
    return error;
}