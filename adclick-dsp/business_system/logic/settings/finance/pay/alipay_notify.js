/*
 * @file  alipay.js
 * @description alipay view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'alipay_notify.logic';
var URLPATH = '/v1/pay/alipay/notify_url';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../../logic_api");

//models
var mDspAduserModel = require('../../../../model/dsp_aduser').create();
var mAdRechargeModel = require('../../../../model/account_recharge_log').create();
var mAdlibUserModel = require('../../../../model/adlib_user').create();

//utils
var mLogger = require('../../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../../utils/data_helper');
var mUtils = require('../../../../../utils/utils');
var mPayUtils = require('./pay_utils');

var AlipayNotify = require('../../../../../utils/alipay/alipay_notify.class').AlipayNotify;

//common constants
var ERRCODE = require('../../../../../common/errCode');
var ADCONSTANTS = require('../../../../../common/adConstants');

var mAlipayConfig = require('./pay_config').AlipayConfig;

var mRefModel = {

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

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id || param.out_trade_no;
    var logmsg = ' to do notify call back from alipay for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    
    mAsync.series([
        //0. verify the notify
        function(next) {
            mLogger.debug('Try to verify the notify!');
            var verifier = new AlipayNotify(mAlipayConfig);
            verifier.verifyNotify(param, function(state){
                if (!state) {
                    var msg = 'Failed to verify the notify!';
                    mLogger.error(msg);
                    next({code: ERRCODE.ALIPAY_VERIFY_FAILED, msg:msg});
                }else {
                    next(null);
                }
            });
        },
        //1. Read the status
        function(next) {
            var select = {
                charge_status: 1,
                user_id: 1,
            };
            var match = {
                id: param.out_trade_no,
            };
            var query = {
                select: select,
                match: match,
            };
            mAdRechargeModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'There is no this trade!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }
                    param.charge_status = rows[0].charge_status; 
                    param.user_id = rows[0].user_id;
                    next(null);
                }
            });
        },
        //2. record in the database
        function(next) {
            if (param.charge_status==ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
                mLogger.debug('The recharge status has been Success, donot update it again!');
                return next(null);
            }
            
            mLogger.debug('Try to update the database from alipay notify!');
            
            var data = {
                id: param.out_trade_no,
                user_id: param.user_id,
                ticket_no: param.trade_no,
                total_fee: param.total_fee * 100,
                charge_status: 0,
            };
            if (param.trade_status ==='TRADE_FINISHED' 
                || param.trade_status ==='TRADE_SUCCESS') {
                data.charge_status =  ADCONSTANTS.REACHAGESTATUS.SUCCESS.code;
            }else {
                data.charge_status = ADCONSTANTS.REACHAGESTATUS.FAIL.code;
            }

            mPayUtils.payTransanctionBatch(data, next);
        },
    ],function(err) {
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
    mDebug( ' post  req.headers:%j', req.headers);
    mDebug( ' post req.cookies:%j', req.cookies);
    mDebug( ' post req.session:%j', req.session);
    mDebug( ' post req.param:%j', param);

    mLogger.info(JSON.stringify(param));

    mLogicHelper.responseAlipay({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
   
});


module.exports.router = mRouter;

