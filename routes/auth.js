'use strict'

const debug = require('debug')('Wendy:router:auth');
const auth = require('../utils/auth');
const commonFunc = require('../utils/commonFunc');
const models = require("../models");
const wendyError = require('../utils/error');
const rewardCtrl = require('../logics/reward');
const validationReceipt = require('../logics/validationReceipt');

const request = require('request');
const express = require('express');
const router = express.Router();

/* 구글 권한 획득 관련 */

let client_id       = process.env.authAOSClientID || 'none';
let client_secret   = process.env.authAOSClientSecret || 'none';
let redirect_uri    = process.env.authAOSRedirectURI || 'none';

router.get('/google/start', (req, res, next)=>{
    if(client_id === 'none') 
        throw Error('cliend_id, client_secret 확인필요')
        
    if(validationReceipt.iapStatus.init === false) {
        res.redirect(`https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/androidpublisher&response_type=code&state=test&access_type=offline&client_id=${client_id}&redirect_uri=${redirect_uri}&approval_prompt=force`);
    }
    else {
        res.redirect('/auth/google/print/token');
    }
})

router.get('/google/return', (req, res, next)=>{
    if( req.query.hasOwnProperty('code') === false
        && 
        req.query.hasOwnProperty('state') === false) {
        res.send(req.body);
        return;
    }
    
    let reqGenTokenUrl = `https://accounts.google.com/o/oauth2/token?code=${req.query.code}&client_id=${client_id}&client_secret=${client_secret}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;
    
    let url = 'https://accounts.google.com/o/oauth2/token';
    let payload = {
        grant_type: 'authorization_code',
        code: req.query.code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri
    };

    request.post(url, { form: payload }, function (error, response, body) {
        let parseBody = JSON.parse(body);
        validationReceipt.UpdateIAPStatus(
            parseBody.access_token,
            parseBody.token_type,
            parseBody.expires_in,
            parseBody.refresh_token
        )

        res.send(body);
    });
})

router.get('/google/print/token', auth.isAdminAuthenticated, (req, res, next)=>{
    res.send(validationReceipt.iapStatus);
})

router.get('/google/refresh/token', auth.isAdminAuthenticated, (req, res, next)=>{
    if(validationReceipt.iapStatus.init === false) {
        throw wendyError('InitializationFirst');
        return;
    }
    let url = 'https://accounts.google.com/o/oauth2/token';
    let payload = {
        refresh_token: validationReceipt.iapStatus.refresh_token,
        grant_type: 'refresh_token',
        client_id: client_id,
        client_secret: client_secret
    };

    request.post(url, { form: payload }, function (error, response, body) {
        if(error) {
            res.send(error);
            return;
        }
        
        let parseBody = JSON.parse(body);
        validationReceipt.UpdateIAPStatus(
            parseBody.access_token,
            parseBody.token_type,
            parseBody.expires_in,
            parseBody.refresh_token
        )
        res.send(body);
    });
})

/* 관리자 권한 처리 */

/**
 * @api {POST} /auth/admin
 * @apiName 관리자 토큰 요청
 * @apiParam {String} email
 * @apiParam {String{8...16}} password
 */
router.post('/admin', (req, res, next)=>{

    let check = commonFunc.ObjectExistThatKeys(req.body, ['email', 'password']);
    if(check === false) 
        throw wendyError('DontHaveRequiredParams', 'email or password');

    models.AdminUser.findOne({where:{email:req.body.email}})
    .then((findAdmin)=>{
        //존재 여부 확인
        if(findAdmin === null || findAdmin === undefined)
            throw wendyError('WrongEmailOrPassword');
        //5회 이상 패스워드 입력 실패 사례인지 확인.
        if(findAdmin.failCount >= 5) 
            throw wendyError('LockdownUserAccess');
        //올바른 패스워드인지 확인.
        let inputPassword = auth.encryptPassword(req.body.password);
        if(inputPassword !== findAdmin['password']) {
            if(findAdmin.failCount+1 >=5) 
                models.AdminUser.update(
                    {failCount:5, grade:0}, 
                    {where:{AdminUserID:findAdmin['AdminUserID']}});
            else
                findAdmin.increment('failCount', {by:1});
            throw wendyError('WrongEmailOrPassword');
        }
        //조회에 관한 권한이 있는지 확인.
        if(findAdmin['grade']<10) {
            throw wendyError('CredentialFailure');
        }

        return Promise.resolve(findAdmin);
    })
    .then((findAdmin)=>{
        //실패 카운터가 1보다 크면 삭감처리.
        if(findAdmin.failCount > 0) 
            return models.AdminUser.update({failCount:0}, {where:{AdmiUserID:findAdmin['AdminUserID']}})
            .then(()=>{
                return Promise.resolve(findAdmin);
            })
        return Promise.resolve(findAdmin);
    })
    .then((findAdmin)=>{
        let token = auth.signToken({
            email:findAdmin.email, 
            grade:findAdmin.grade
        });
        res.send({result:0, token: token });
    })
    .catch((err)=>{
        next(err);
    })
})

/**
 * @api {POST} /auth/admin/add
 * @apiName 관리자 등록
 * @apiParam {String} email
 * @apiParam {String{8...16}} password
 */
router.post('/admin/add', (req, res, next)=>{
    let check = commonFunc.ObjectExistThatKeys(req.body, ['email', 'password']);
    if(check === false) 
        throw wendyError('DontHaveRequiredParams', 'email or password');
    
    models.AdminUser.findOne({where:{email:req.body.email}})
    .then((findAdmin)=>{
        //존재 여부 확인
        if( !(findAdmin === null || findAdmin === undefined) )
            throw wendyError('UsedEmail');
        //이메일 형식 체크
        let checkEmail = commonFunc.checkEmail(req.body.email);
        if(checkEmail === false) 
            throw wendyError('WrongEmail');
        //패스워드 길이 및 특수문자 체크
        let checkPassword = commonFunc.checkPassword(req.body.password);
        if(checkPassword === false) 
            throw wendyError('WrongPassword');
        
        return Promise.resolve();
    })
    .then(()=>{
        let encryptPassword = auth.encryptPassword(req.body.password);
        return models.AdminUser.create({
            email:req.body.email,
            password:encryptPassword,
            createAt:new Date()
        })
    })
    .then((create)=>{
        res.send({result:0});
    })
    .catch((err)=>{
        next(err);
    })
})


module.exports = router;