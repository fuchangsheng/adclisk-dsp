/*
 * @file  wechat_pay_query.js
 * @description wechat pay query status API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'wechat_pay_query.logic';
var URLPATH = '/v3/settings/finance/pay/wechat-query';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');
var mUrl = require('url');

var LogicApi = require("../../../logic_api");

//models
var mDspAduserModel = require('../../../../model/dsp_aduser').create();
var mAdRechargeModel = require('../../../../model/account_recharge_log').create();

//utils
var mLogger = require('../../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../../utils/data_helper');
var mUtils = require('../../../../../utils/utils');

var Payment = require('wechat-pay').Payment;
var mWechatPayConfig = require('./pay_config').WechatPayConfig;
var mWechatPayment = new Payment(mWechatPayConfig);

//common constants
var ERRCODE = require('../../../../../common/errCode');
var ADCONSTANTS = require('../../../../../common/adConstants');


var mAlipayConfig = require('./pay_config').AlipayConfig;

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    id: {
        data: '1',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
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
        id: data.id,
        account_type : data.account_type,
        oper_id: data.oper_id,
        amount:mUtils.fenToYuan( data.amount),
        charge_type: data.charge_type,
        charge_status: data.charge_status,
    };

    if (data.charge_status==ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
        resData.redirect = true;
        resData.html= ADCONSTANTS.PAYDONEHTML+ '?status=0';
    }else if (data.charge_status==ADCONSTANTS.REACHAGESTATUS.FAIL.code) {
        resData.redirect = true;
        resData.html = ADCONSTANTS.PAYDONEHTML+'?status=1';
    }else {
        resData.redirect = false;
    }
    
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id || 0;
    var logmsg = ' to do wechat pay for user:' + user_id ;
    mLogger.debug('Try '+logmsg);


    mAsync.waterfall([
        function( next) {
            var match = {
                id: param.id,
                user_id: user_id,
            };
            var select = mAdRechargeModel.refModel;
            var query = {
                select: select,
                match: match
            };
            mAdRechargeModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows||rows.length!=1) {
                        var msg = 'There is no such pay order!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }else {
                        return next(null, rows[0]);
                    }
                }
            });
        },
    ],function(err, order) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(order);
            fn(null, resData);
        }
    });
}

/*
* export the get interface
*/
mRouter.get(URLPATH, function(req, res, next){
    var param = req.query;
    
    param.ip = mUtils.getClientIp(req);
    mLogger.debug('The client ip is:'+param.ip);

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;

