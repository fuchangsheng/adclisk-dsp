/*
 * @file  acl.js
 * @description dsp logic helper model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'acl.logic';
var DEBUG = require('debug')(MODULENAME);
var URLPATH = '/*';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

//helper
var mLogger = require('../../utils/logger')(MODULENAME);

//common
var ADCONSTANTS = require('../../common/adConstants');
var ERRCODE = require('../../common/errCode');
var CONFIG = require('../../common/config');

//check whether user login
function checkLogin(req) {
    //return true; 
    if (!(req.session && req.session.auth && req.session.userInfo)) {
        return false;
    }

    return true;
}

function checkRole(acls, fn) {

}

module.exports.checkLogin = checkLogin;
module.exports.checkRole = checkRole;

//FIXME
var mSkipUrls = [
    '/v1/pay/alipay/notify_url',
    '/v1/pay/alipay/return_url',
    '/v1/pay/wechat/notify_url',
    '/v3/user/login',
    '/v3/password/forget',
    '/v3/user/regist',
    '/v3/sms/request',
    '/v3/sms/verify',
    '/v3/captha/request',
    '/v3/captha/request/img',
    '/v3/captha/verify',
    '/emailverify',
    //'/v1/upload',
    '/v1/tool/mgtv_mobike/usercreate',
    '/v1/ad/conversion/cb',
    '/v1/ad/conversion/listall',
    '/v1/ad/conversion/setprice',
    '/v1/adx/conversion/detail',
    '/v1/adx/conversion/list'
];

//adminisitrator
var mAdmimisitratorDeniedUrls = [
    '/v1/user/invoice/add',
    '/v1/user/invoice/del',
    '/v1/user/invoice/edit',
    '/v1/faccount/invoice/sign',
    '/v1/faccount/invoice/request',
    '/v1/pay/',
];

//operator
var mOperatorDeniedUrls = [
    '/v1/user/invoice/',
    '/v1/faccount/invoice/',
    '/v1/faccount/records',
    '/v1/pay/',
    '/v1/user/operator/'
];

//observer
var mObserverDeniedUrls = [
    '/v1/dashboard/unit/', //dashboard
    '/v1/dashboard/idea/',
    '/v1/ad/unit/', //ad
    '/v1/ad/idea/',
    '/v1/faccount/', //finacial
    '/v1/pay/',
    '/v1/message/email/', //message
    '/v1/message/smsreceivers/verify',
    '/v1/message/receivers/',
    '/v1/message/set/',
    '/v1/auditlog/',
    '/v1/user/edit', //account management
    '/v1/user/qualification/edit',
    '/v1/user/operator/',
];

//treasurer
var mTreasurerDeniedUrls = [
    '/v1/dashboard/',
    '/v1/ad/',
    '/v1/message/',
    '/v1/auditlog/',
    '/v1/user/contact/'
];



function isAccessDeniedResource(arr, url) {
    for (var i = 0; i < arr.length; i++) {
        var skiped = arr[i];
        var index = url.indexOf(skiped);
        if (index == 0) {
            return true;
        }
    }
    return false;
}

var checkLoginURL = '/v3/user/check-login';

var mStaticurls = [
    '/js',
    '/css',
    '/icon',
    '/bootstrap',
    '/img',
    '/jquery',
    '/captha',
    '/operator',
    '/license',
    '/qualification',
    '/invoice',
    '/idea',
    '/static',
    '/index',
];

//FIXME
function isStaticResource(url) {
    for (var i = 0; i < mStaticurls.length; i++) {
        var skiped = mStaticurls[i];
        var index = url.indexOf(skiped);
        if (index == 0) {
            return true;
        }
    }
    return false;
}

function skipUrls(url) {
    //check static resourse
    if (CONFIG.NGINX === false) {
        if (isStaticResource(url)) {
            return true;
        }
    }

    for (var i = 0; i < mSkipUrls.length; i++) {
        var skiped = mSkipUrls[i];
        var index = url.indexOf(skiped);
        if (index == 0) {
            return true;
        }
    }
    return false;
}

function acl(userInfo) {

}

mRouter.use(URLPATH, function(req, res, next) {
    DEBUG('req.headers:%j', req.headers);
    DEBUG('req.cookies:%j', req.cookies);
    DEBUG('req.session:%j', req.session);

    if (CONFIG.CROSSENABLE) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        //res.setHeader('Access-Control-Allow-Credentials', true);
    }
    var param = req.method === 'GET' ?
        req.query : (req.body && req.body.param) || req.body;
    param.user_id = 39003550;
    param.oper_id = 'c4398558f23756e86454b29e4d722141';
    param.user_name = 'dmtec_0a326c2f';
    param.role = 0;
    next('route');
    return;
    if (!checkLogin(req)) {
        //console.log(skipUrls(req.originalUrl));
        if (!skipUrls(req.originalUrl)) {
            //console.log('No login and need login');
            //direct answer status if is check login
            if (req.originalUrl === checkLoginURL) {
                var json = {};
                json.code = ERRCODE.NOLOGIN;
                json.message = 'No login';
                res.json(json);
                return;
            }

            if (CONFIG.NGINX === true) {
                var json = {};
                json.code = ERRCODE.NEED_LOGIN;
                json.message = 'Need login';
                res.json(json);
            } else {
                res.statusCode = 302;
                res.setHeader("Location", ADCONSTANTS.DEFAULTPAGE);
                res.end();
            }
        } else {
            next('route');
        }
    } else {
        if ((req.session.userInfo.role == 1 && isAccessDeniedResource(mAdmimisitratorDeniedUrls, req.originalUrl)) ||
            (req.session.userInfo.role == 2 && isAccessDeniedResource(mOperatorDeniedUrls, req.originalUrl)) ||
            (req.session.userInfo.role == 3 && isAccessDeniedResource(mObserverDeniedUrls, req.originalUrl)) ||
            (req.session.userInfo.role == 4 && isAccessDeniedResource(mTreasurerDeniedUrls, req.originalUrl))) {
            var json = {};
            json.code = ERRCODE.REQUEST_DENIED;
            json.message = 'access denied';
            res.json(json);
        } else {
            if (!skipUrls(req.originalUrl)) {
                var param = req.method === 'GET' ?
                    req.query : (req.body && req.body.param) || req.body;

                mLogger.debug('acl check on param');
                param.user_id = req.session.userInfo.user_id;
                param.oper_id = req.session.userInfo.oper_id;
                param.user_name = req.session.userInfo.user_name;
                param.role = req.session.userInfo.role;
            }
            next('route');
        }
    }
});

module.exports.router = mRouter;