/*
 * @file  pay_info.js
 * @description balance basic information view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.29
 * @version 3.0.1
 */
'use strict';
var MODULENAME = 'pay_info.logic';
var URLPATH = '/v3/pay/payinfo';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../../logic_api");

//models
var mAdRechargeModel = require('../../../../model/account_recharge_log').create();

//utils
var mLogger = require('../../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../../utils/data_helper');
var mUtils = require('../../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../../common/errCode');
var ADCONSTANTS = require('../../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    out_trade_no: {
        data: '',
        rangeCheck: mUtils.notEmpty,
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

    console.error(data);
    
    var resData = {
        out_trade_no: data.id,
        charge_type: ADCONSTANTS.FINANCIALRECHARGE.format(data.charge_type),
        charge_status: ADCONSTANTS.REACHAGESTATUS.format(data.charge_status),
    };

    return resData;
}

function preprocess(param) {
    param.out_trade_no = param.out_trade_no.replace(/\'|\"/ig, '');
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }
    
    var user_id = param.user_id;
    var logmsg = ' to view pay result for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    var select = mAdRechargeModel.refModel;
    var match = {
        user_id: user_id,
        id: param.out_trade_no,
    };
    var query = {
        select: select,
        match: match,
    };

    mAdRechargeModel.lookup(query, function(err, rows) {
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

