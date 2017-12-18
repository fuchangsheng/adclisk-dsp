/*
 * @file  alipay.js
 * @description alipay view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'alipay.logic';
var URLPATH = '/v3/settings/finance/pay/ali-pay';

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

var AlipaySubmit = require('../../../../../utils/alipay/alipay_submit.class').AlipaySubmit;

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
        content: data,
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
    
    var user_id = param.user_id;
    var logmsg = ' to do alipay for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        function(next) {
            var seed = 'alipay'+param.amount+param.user_id;
            var id = mDataHelper.createId(seed);
            var value = {
                id: id,
                user_id: user_id,
                account_type: ADCONSTANTS.FINANCIALACCOUNT.REAL.code,
                oper_id: param.oper_id || '',
                amount: param.amount,
                charge_type: ADCONSTANTS.FINANCIALRECHARGE.ALIPAY.code,
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
                    if (rows.length==0) {
                        var msg = 'Failed to create the data';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_CREATEDATAFAILED, msg: msg});
                    } else {
                        next(null, id);
                    }                    
                }
            });
        },
        function(out_trade_no, next) {
            mLogger.debug('Try to call the alipay!');
            var alipaySubmit = new AlipaySubmit(mAlipayConfig);

            var parameter = {
                service:'create_direct_pay_by_user'
                ,partner: mAlipayConfig.partner
                ,payment_type:'1' //支付类型
                ,subject: 'AdClick fee'
                ,total_fee: param.amount /100.0 //ali use yuan as unit
                ,out_trade_no: out_trade_no
                , body:'welcome to rechare the ad fee'
                ,notify_url: mUrl.resolve( mAlipayConfig.host, mAlipayConfig.create_direct_pay_by_user_notify_url)//服务器异步通知页面路径,必填，不能修改, 需http://格式的完整路径，不能加?id=123这类自定义参数
                ,return_url: mUrl.resolve(mAlipayConfig.host , mAlipayConfig.create_direct_pay_by_user_return_url)//页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
                ,seller_email: mAlipayConfig.seller_email //卖家支付宝帐户 必填      
                ,_input_charset: mAlipayConfig['input_charset'].toLowerCase().trim()
            };

            var payUrl = alipaySubmit.buildRequestParaToString(parameter);
            next(null, {pay_url: payUrl, out_trade_no: out_trade_no});
        },
    ],function(err, html_text) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(html_text);
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

