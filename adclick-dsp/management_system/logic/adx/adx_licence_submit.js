/*
 * @file  adx_licence_submit.js
 * @description adx licences submit API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.03.22
 * @version 1.6 
 */
'use strict';
var MODULENAME = 'adx_licence_submit.logic';
var URLPATH = '/v1/adx/licence/submit';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdxAuditUserModel = require('../../model/adlib_audit_users').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//adx route
var mGetAdx = require('./adx_router');

var mRefModel = {
    id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
        }
    }
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function validate(data){
    if(!data){
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function packageResponseData(data){
    if (!data) {
        return {};
    }
    return data;
}


function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    var msg = ' to process adx licence upload request for :' +  param.id;
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.select adx
        function(next) {
            var select = {
                adx_id: 1,
                user_id: 1
            };
            var match = {
                id: param.id
            };
            var query = {
                select: select,
                match: match
            };
            mAdxAuditUserModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (!rows || rows.length === 0) {
                        var msg = 'There is no match data!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        next(null, rows[0]);
                    }
                }
            });
        },
        // 2.query from adx
        function(data, next) {
            var adx = mGetAdx.getAdx(data);
            if (!adx) {
                next({code: ERRCODE.PARAM_INVALID, msg: 'adx尚未接入!'});
            } else {
                var query = {
                    user_id: data.user_id
                };
                adx.licenceSubmitRouter(query, function(err, res) {
                    if (err) {
                        next(err);
                    } else {
                        next(null, res);
                    }
                });               
            }
        }
    ], function(err, result) {
        if (err) {
            mLogger.error('Failed ' + msg);
            fn(err);
        } else {
            mLogger.debug('Success' + msg);
            fn(null, result);
        }
    });
}

/*
* export the get interface
*/
mRouter.get(URLPATH, function(req, res, next){
    var param = req.query;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,
    });
});

module.exports.router = mRouter;

