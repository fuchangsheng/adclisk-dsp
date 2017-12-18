/*
 * @file  ad_account_role_view.js
 * @description get the account role view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.05
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_role_view.logic';
var URLPATH = '/v3/ad/account/role/view';

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
var mAccountRoleContentModel = require('../../../model/role_content').create()

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

    var contents = data;
    var resData = {
        size: contents.length,
        list: []
    };

    for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        var value = {
            category: ADCONSTANTS.ROLECATEGORIES.format(content.category),
            subcategory: ADCONSTANTS.ROLESUBCATEGORIES.format(content.subcategory),
            channel: ADCONSTANTS.ROLECHANNEL.format(content.channel),
        };
        resData.list.push(value);
    }
    return resData;
}

function preprocess(param) {

}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    var user_id = param.user_id;
    var logmsg = ' to get accout role view for user:' + user_id;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
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
                    if (rows.length == 0) {
                        var msg = 'There is no such role!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        next(null, rows[0]);
                    }
                }
            });
        },
        //2. role info
        function(role, next) {
            var match = {
                user_id: user_id,
                role_id: param.role_id,
            };
            var query = {
                match: match,
                select: mAccountRoleContentModel.refModel,
            };
            mAccountRoleContentModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, rows);
                }
            });
        },
    ], function(err, contents) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(contents);
            fn(null, resData);
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

