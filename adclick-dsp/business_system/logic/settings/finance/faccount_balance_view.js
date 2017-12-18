/*
 * @file  faccount_balance_view.js
 * @description balance basic information view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1
 */
'use strict';
var MODULENAME = 'faccount_balance_view.logic';
var URLPATH = '/v3/settings/finance/balance';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mDspAduserModel = require('../../../model/dsp_aduser').create();
var mAdLibUserModel = require('../../../model/adlib_user').create();

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
        user_id: data.user_id,
        balance: mUtils.fenToYuan(data.balance/1000),
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }
    
    var user_id = param.user_id;
    var logmsg = ' to view financial account balance info for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    var select = mAdLibUserModel.refModel;
    var match = {
        user_id: user_id,
    };
    var query = {
        select: select,
        match: match,
    };

    mAdLibUserModel.lookup(query, function(err, rows) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            if (rows.length == 0) {
                var msg = 'There is no match data!';
                mLogger.error(msg);
                return fn({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
            }

            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(rows[0]);
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

