/*
 * @file  wechat_notify.js
 * @description wechat notify logic API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'wechat_notify.logic';
var URLPATH = '/v1/pay/wechat/notify_url';

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

//utils
var mLogger = require('../../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../../utils/data_helper');
var mUtils = require('../../../../../utils/utils');
var mPayUtils = require('./pay_utils');

var mWechatPayConfig = require('./pay_config').WechatPayConfig;
var mMiddleware = require('wechat-pay').middleware;

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

function updateChargeStatus(param, fn) {
    var charge_status = param.charge_status

    var update = {
       charge_status: charge_status,
       ticket_no: param.transaction_id,
    };
    var match = {
        id: param.out_trade_no,
    };
    var query = {
        update: update,
        match: match,
    };
    query.connection = param.connection;
    mAdRechargeModel.update(query, fn);
}

function addBalance(param, fn) {
    var sqlstr = 'update '+mDspAduserModel.tableName;
    sqlstr +=' set rbalance=rbalance+'+param.total_fee;
    // sqlstr +=' , balance=balance+'+param.total_fee;
    sqlstr +=' where user_id='+param.user_id;
    sqlstr += ';';

    var query = {
        sqlstr: sqlstr,
    };
    query.connection = param.connection;
    mDspAduserModel.query(query, next);
}

function updateBalanceTransanction(param, fn) {
    var charge_status = param.charge_status;

    mAsync.series([
        //1.update the charge status
        function(next) {
            updateChargeStatus(param, next);
        },
        //2. add the balance
        function(next) {
            if (charge_status!=ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
                return next(null);
            }
            addBalance(param, next);
        }
    ], function(err){
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
    
    var user_id = param.user_id || param.out_trade_no;
    var logmsg = ' to process notify from wechat for user:' + user_id ;
    mLogger.debug('Try '+logmsg);


    var sys_charge_status = 0;
    mAsync.series([
        //0.read the charge status
        function(next){
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
                    sys_charge_status = rows[0].charge_status; 
                    param.user_id = rows[0].user_id;
                    next(null);
                }
            });
        },
        //update the status
        function(next) {
            if (sys_charge_status==ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
                 mLogger.debug('The recharge status has been Success, donot update it again!');
                return next(null);
            }

            mLogger.debug('Try to update the database from wechat!');
            var data = {
                id: param.out_trade_no,
                user_id: param.user_id,
                ticket_no: param.transaction_id,
                total_fee: param.total_fee,
                charge_status: param.charge_status,
            };

            mPayUtils.payTransanctionBatch(data, next);
        },
    ],function(err) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            
            fn(null);
        }
    });
}

/*
* export the post interface
*/
mRouter.post(URLPATH, mMiddleware(mWechatPayConfig).getNotify().done(
    function(err, param, req, res, next) {
    
    mDebug( ' post req.headers:%j', req.headers);
    mDebug( ' post req.cookies:%j', req.cookies);
    mDebug( ' post req.session:%j', req.session);
    mDebug( ' post req.param:%j', param);

    mLogger.info(JSON.stringify(param));

    if (err) {
        mLogger.error(JSON.stringify(err));
        param.charge_status =  ADCONSTANTS.REACHAGESTATUS.FAIL.code;
    }else {
        param.charge_status =  ADCONSTANTS.REACHAGESTATUS.SUCCESS.code;
    }
    processRequest(param, function(err) {
        if (err) {
            var error = new Error();
            error.name = err.msg;
            res.reply(error);
        }else {
            res.reply(null);
        }
    });
}));


module.exports.router = mRouter;

