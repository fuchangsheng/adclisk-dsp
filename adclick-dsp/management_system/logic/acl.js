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
    if (!(req.session && req.session.auth && req.session.userInfo)) {
        return false;
    }

    return true;
}

function checkRole(req) {
    if (req.session.userInfo.role == ADCONSTANTS.ROLE.CREATOR.code ||
        req.session.userInfo.role == ADCONSTANTS.ROLE.ADMIN.code) {
        return true;
    }
    return false;
}

module.exports.checkLogin = checkLogin;
module.exports.checkRole= checkRole;

//FIXME
var mSkipUrl = [
    '/v1/mgr/login',
    '/v1/mgr/logout',
    '/v1/sms/request',
    '/v1/sms/verify',
    '/v1/mgr/captha/request',
    '/v1/mgr/captha/request/img',
    '/v1/mgr/captha/verify',
    '/emailverify',
];

var mAdminUrls = [
    '/admin/add',
    '/admin/update',
    '/admin/delete',
    '/views/admin/add',
    '/views/admin/update',
    '/views/admin/delete',
];
var mStaticurls= [
    '/js',
    '/css',
    '/icon',
    '/bootstrap',
    '/img',
    '/jquery',
];

//FIXME
function isStaticResource(url) {
    for (var i = 0; i < mStaticurls.length; i++) {
        var skiped = mStaticurls[i];
        var index = url.indexOf(skiped);
        if ( index == 0) {
            return true;
        }
    }

    return false;
}

function skipUrls(url) {
    if (isStaticResource(url)) {
        return true;
    }

    for (var i = 0; i < mSkipUrl.length; i++) {
        var skiped = mSkipUrl[i];
        var index = url.indexOf(skiped);
        if (index === 0) {
            return true;
        }
    }

    return false;
}

function isAdminUrl(url) {
    if (skipUrls(url)) {
        return false;
    }

    for (var i = 0; i < mAdminUrls.length; i++) {
        var adminUrl = mAdminUrls[i];
        var index = url.indexOf(adminUrl);
        if (index === 0) {
            return true;
        }
    }
    return false;
}

mRouter.use(URLPATH, function(req, res, next){
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
    if (!checkLogin(req)) {
        if (!skipUrls(req.originalUrl)) {
            if (CONFIG.NGINX===true) {
                var json = {};
                json.code = ERRCODE.NEED_LOGIN;
                json.message = 'Need login';
                res.json(json);
            }else {
                res.statusCode = 302;
                res.setHeader("Location", '/login.html');
                res.end();
            }
        }else {
            next('route');
        }    
    } else {
        var param = req.method==='GET' ?
                req.query : (req.body && req.body.param) || req.body;

        if (!isAdminUrl(req.originalUrl)) {
            var param = req.method==='GET' ? 
                req.query : (req.body && req.body.param) || req.body;

            param.mgr_id = req.session.userInfo.mgr_id;
            
            mLogger.debug('acl check on param');
            next('route');
        } else {
            if (!checkRole(req)) {
                res.statusCode = 404;
                var err = new Error('Not Found');
                next(err);
            } else {
                next('route');
            }
        }
    }
});

module.exports.router = mRouter;
