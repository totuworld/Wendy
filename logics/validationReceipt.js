'use strict';

const request = require('request');
const models = require("../models");

let iapStatus = {
    init: false,
    access_token: null,
    token_type: null,
    expires_in: null,
    refresh_token: null
};

exports.iapStatus = iapStatus;

function InitIAPStatus() {
    models.AuthGoogle.findOne({where:{expireTimeStamp:{$gte:new Date()}}})
    .then((findAuthGoogle)=>{
        if( (findAuthGoogle===null
            ||findAuthGoogle==undefined) ) {
            iapStatus.init = false;
            return;
        }

        iapStatus.init = true;
        iapStatus.access_token = findAuthGoogle.access_token;
        iapStatus.token_type = findAuthGoogle.token_type;
        iapStatus.expires_in = findAuthGoogle.expires_in;
        iapStatus.refresh_token = findAuthGoogle.refresh_token;

        console.log(`IAPStatus init : ${iapStatus.init}`)
    })
}

InitIAPStatus();

exports.UpdateIAPStatus = (access_token, token_type, expires_in, refresh_token='none')=>{
    let timeStamp = new Date();
    timeStamp = timeStamp.setTime(timeStamp.getTime() + 3600*1000);
    let updateObj = {
        access_token : access_token,
        token_type : token_type,
        expires_in : expires_in,
        expireTimeStamp : timeStamp
    }
    iapStatus.access_token = updateObj.access_token;
    iapStatus.token_type = updateObj.token_type;
    iapStatus.expires_in = updateObj.expires_in;
    if(refresh_token !== 'none') {
        updateObj['refresh_token'] = refresh_token;
        iapStatus.refresh_token = updateObj.refresh_token;
    }
    iapStatus.init = true;
    
    return models.AuthGoogle.findAll()
    .then((findList)=>{
        if( !(findList===null || findList===undefined) ) 
            return models.AuthGoogle.update(
                updateObj, 
                {where:{AuthGoogleID:findList[0]['AuthGoogleID']}
            })
        return models.AuthGoogle.create(updateObj);
    })
}


exports.checkIOSReceipt = (receipt)=>{
    return new Promise((resolve, reject)=>{
        request.post( {url:'https://buy.itunes.apple.com/verifyReceipt', body:{"Content-type":"application/json"}, json:{'receipt-data':receipt}}, (error, response, data)=>{
            if (error) {
                // 1 is unknown
                status = data ? data.status : 1;
                reject({ result: 1, err:error });
            }
            if (data.status === 21007) {
                // the receipt is for sandbox
                request.post( {url:'https://sandbox.itunes.apple.com/verifyReceipt', body:{"Content-type":"application/json"}, json:{'receipt-data':receipt}}, (error, response, data)=>{
                    if (error) {
                        // 1 is unknown
                        status = data ? data.status : 1;
                        reject({ result: 1, err:error });
                    }
                    // sandbox validated
                    let productName = 
                        data.receipt.in_app.length > 0
                        ? data.receipt.in_app[0]['product_id']
                        : null;
                    resolve({ result: 0, store:'dev', ProductName:productName});
                });
                return;
            }
            let productName = 
                data.receipt.in_app.length > 0
                ? data.receipt.in_app[0]['product_id']
                : null;
            // production validated
            resolve({ result: 0, store:'production', ProductName:productName });
        });
    })
}

exports.checkAOSReceipt =(receipt)=>{
    
    let jsonStr = receipt;

    if(typeof jsonStr === 'string') {
        jsonStr = receipt
            .replace(/\\"/g, '"')
            .replace('"{', '{')
            .replace('}"', '}');
    }
    let parseRawRecipt = jsonStr;
    
    if(typeof jsonStr === 'string') {
        try {
            parseRawRecipt = JSON.parse(jsonStr);
        }
        catch(e) {
            return Promise.reject(e);
        }
    }
    else if(receipt.hasOwnProperty('json')) {
        jsonStr = receipt['json']
            .replace(/\\"/g, '"')
            .replace('"{', '{')
            .replace('}"', '}');
        parseRawRecipt = jsonStr;
    }

    let packageName = parseRawRecipt.packageName;
    let productId = parseRawRecipt.productId;
    let token = parseRawRecipt.purchaseToken;

    return new Promise(function (resolve, reject) {
        
        let getUrl = `https://www.googleapis.com/androidpublisher/v2/applications/${packageName}/purchases/products/${productId}/tokens/${token}?access_token=${iapStatus.access_token}`;
        request.get(getUrl, function (error, response, body) {


            let parseBody = JSON.parse(body);
            
            if (!(parseBody.error === null || parseBody.error === undefined)) {
                reject({result:1, err:null});
            }
            else if (parseBody.purchaseState === 0) {
                resolve({result:0, res:body, ProductName:productId});
            }
            else {
                reject({result:1, err:body, ProductName:productId});
            }
        });
    });

}

const onestoreUrl = {
    dev:"https://iapdev.tstore.co.kr/digitalsignconfirm.iap",
    production:"https://iap.tstore.co.kr/digitalsignconfirm.iap"
}

exports.checkOneStoreReceipt = (receipt)=>{
    return CheckOneStoreReceipt(receipt, 'production')
    .then((resultValue)=>{
        if(resultValue.result !== 0) {
            return CheckOneStoreReceipt(receipt, 'dev')
        }
        return Promise.resolve(resultValue);
    })
    .then((resultValue)=>{
        if(resultValue.result !== 0) {
            return Promise.reject(resultValue);
        }
        return Promise.resolve(resultValue);
    })
}

function CheckOneStoreReceipt(jsonReceipt, storeType) {
    let jsonObj = jsonReceipt;
    try {
        if(typeof jsonStr === 'string') {
            jsonObj = JSON.parse(jsonReceipt);
        }
    }
    catch(e) {
        return Promise.reject(e);
    }
    
    return new Promise((resolve, reject)=>{
        request.post( {url:onestoreUrl[storeType], body:{"Content-type":"application/json"}, json:jsonObj}, (err, response, body)=>{
            if(err) {
                reject(err);
                return;
            }
            let jsonResult = body;
            if(jsonResult.status === 0) {
                let productName = 
                    jsonResult.product[0].hasOwnProperty('product_id')
                    ? jsonResult.product[0]['product_id']
                    : null;
                resolve({result:0, res:jsonResult, store:storeType, ProductName:productName});
            }
            else {
                resolve({result:1, err:jsonResult.Detail*1, store:storeType});
            }
        });
    })
}