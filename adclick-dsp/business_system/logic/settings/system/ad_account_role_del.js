/*
 * @file  ad_account_role_del.js
 * @description ad account role to del API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.05
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_role_del.logic';
var URLPATH = '/v3/ad/account/role/del';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mAccountRoleModel = require('../../../model/role').create();
var mAccountRoleContentModel = require('../../../model/role_content').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    role_id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
        },
    },
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

    var resData = {
        role_id: data.role_id,
        role_name: data.role_name,
    };

    return resData;
}

function preprocess(param) {
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
}

function removeAccoutRoleContents(param, fn) {
    mLogger.debug('calling removeTargetContents!');

    var match = {
        user_id: param.user_id,
        role_id: param.role_id,
    };

    var query = {
        match: match,
    };

    mAccountRoleContentModel.remove(query, fn);
}

function removeAccountRole(param, fn) {
    mLogger.debug('calling removeTarget!');

    var match = {
        user_id: param.user_id,
        id: param.role_id,
    };

    var query = {
        match: match,
    };

    mAccountRoleModel.remove(query, fn);
}

function transactionCallback(param, fn) {
    mLogger.debug('calling transactionCallback!');

    mAsync.series([
        function(next) {
            removeAccoutRoleContents(param, next);
        }, 
        function(next) {
            removeAccountRole(param, next);
        }
    ], function(err) {
        if (err) {
            fn(err);
        }else {
            fn(null);
        }
    });
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    var user_id = param.user_id;
    var logmsg = ' to del ad accout role from user:' + user_id;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.series([
        //1. check total number of ad plans in the system
        function(next) {
            var match = {
                user_id: user_id,
                id: param.role_id,
            };
            var select = {
                role_name: '',
            }
            var query = {
                match: match,
                select: select,
            };
            mAccountRoleModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows.length==0) {
                        var msg = 'There is no such template info!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        var role_name = rows[0].role_name;
                        param.role_name = rows[0].role_name;
                        if (ADCONSTANTS.ROLE.find(role_name)) {
                            var msg = 'System role cannot be deleted';
                            mLogger.error(msg);
                            return next({code: ERRCODE.PARAM_INVALID, msg: msg});
                        }
                        next(null);
                    }
                }
            });
        },
        //2. remove
        function(next) {
            param.transactionFun = transactionCallback;
            mAccountRoleModel.doTransaction(param, next);
        },
    ], function(err) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(param);
            fn(null, resData);
        }
    });
}

/*
* export the get interface
*/
mRouter.post(URLPATH, function(req, res, next){
    var param = req.body;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,
    });
});

module.exports.router = mRouter;