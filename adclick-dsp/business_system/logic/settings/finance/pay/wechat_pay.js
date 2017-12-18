/*
 * @file  wechat_pay.js
 * @description wechat pay view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'wechat_pay.logic';
var URLPATH = '/v3/settings/finance/pay/wechat-pay';

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
    amount: {
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
        content: data.code_url,
        id: data.out_trade_no,
    };

    return resData;
}

function preprocess(param) {
    if (param.amount) {
        //to fen unit
        param.amount = mUtils.yuanToFen(param.amount);
    }
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

    preprocess(param);

    mAsync.waterfall([
        function(next) {
            var seed = 'wechat'+param.amount+param.user_id;
            var id = mDataHelper.createId(seed);
            var value = {
                id: id,
                user_id: user_id,
                account_type: ADCONSTANTS.FINANCIALACCOUNT.REAL.code,
                oper_id: param.oper_id || '',
                amount: param.amount,
                charge_type: ADCONSTANTS.FINANCIALRECHARGE.WECHAT.code,
                charge_status: ADCONSTANTS.REACHAGESTATUS.CREATE.code,
            };
            var query = {
                fields: value,
                values: [value],
            };
            mLogger.debug('Try to record in the database!');
            mAdRechargeModel.create(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'Failed to create the data';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_CREATEDATAFAILED, msg: msg});
                    }
                    next(null, id);
                }
            });
        },
        function(out_trade_no, next) {
            mLogger.debug('Try to call the wechat pay!');
            
            var order = {
              body: 'AdClick DSP AD fee',
              attach: 'wechat pay',
              out_trade_no: out_trade_no,
              total_fee: param.amount,
              spbill_create_ip: param.ip,
              // openid: req.user.openid,
              product_id: '1234344',
              trade_type: 'NATIVE'
            };

            mWechatPayment.getBrandWCPayRequestParams(order, function(err, payargs){
                if (err) {
                    mLogger.error(err);
                    next({code: ERRCODE.WECHATPAY_CREATEORDER_FAILED, msg: err});
                }else {
                    payargs.out_trade_no = out_trade_no;
                    next(null, payargs);
                }
            });
        },
    ],function(err, payargs) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(payargs);
            fn(null, resData);
        }
    });
}

/*
* export the get interface
*/
mRouter.post(URLPATH, function(req, res, next){
    var param = req.body;

    param.ip = mUtils.getClientIp(req);

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

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

