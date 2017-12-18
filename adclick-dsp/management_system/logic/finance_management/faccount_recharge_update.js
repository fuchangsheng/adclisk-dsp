/*
 * @file  faccount_recharge_update.js
 * @description recharge update logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_recharge_update.logic';
var URLPATH = '/v1/aduser/faccount/recharge/update';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAccountRechargeLogModel = require('../../model/account_recharge_log').create();
var mDspAduserModel = require('../../model/dsp_aduser').create();
var mAdlibUserModel = require('../../model/adlib_user').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');
var mDataHelp = require('../../../utils/data_helper');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    mgr_id: {
        data: 1,
        rangeCheck: function(data){
            return true;
        },
    },
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    charge_id: {
        data: '',
        rangeCheck: function(data) {
           return !mUtils.isEmpty(data);
        },
    },
    ticket_no: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    status: {
        data: '',
        rangeCheck: function(data){
            var type = ADCONSTANTS.REACHAGESTATUS.find(data);
            return type?true:false;
        }
    }
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function updateRechargeLog(param, fn) {
    var logmsg = ' to create recharge log: ' + param.user_id;
    var id = mDataHelp.createId(new Date() + 1);
    var ticketNo = mDataHelp.createId(new Date() + 1);
    
    var oper_id = param.mgr_id.toString();
    var update = {
        charge_status: param.status,
        oper_id: oper_id,
    };
    var match = {
        id: param.charge_id,
    };

    var query = {
        update: update,
        match:match,
    };

    query.connection = param.connection;
    mAccountRechargeLogModel.update(query, fn);    
}

function updateDSPAccount(param, fn) {
    mLogger.debug('calling updateDSPAccount!');

    var sqlstr = 'update '+mDspAduserModel.tableName;
    sqlstr +=' set rbalance=rbalance+'+param.amount;
    // sqlstr +=' , balance=balance+'+param.amount;
    sqlstr +=', uninvoice_amount=uninvoice_amount+'+param.amount;
    sqlstr +=' where user_id='+param.user_id;
    sqlstr += ';';

    var query = {
        sqlstr: sqlstr,
    };
    query.connection = param.connection;
    mDspAduserModel.query(query, fn);
}

function updateBalanceTransanction(param, fn) {
    mLogger.debug('calling updateBalanceTransanction!');

    mAsync.series([
        //1.update the charge status
        function(next) {
            updateRechargeLog(param, next);
        },
        //2. add the balance
        function(next) {
            updateDSPAccount(param, next);
        }
    ], function(err){
        if (err) {
            fn(err);
        }else {
            fn(null);
        }
    });
}

function updateAdlibBalanceTransanction(param, fn) {
    mLogger.debug('calling updateAdlibBalanceTransanction');

    var sqlstr = 'update '+mAdlibUserModel.tableName;
    sqlstr +=' set balance=balance+'+param.amount*1000;
    sqlstr +=' where user_id='+param.user_id;
    sqlstr += ';';

    var query = {
        sqlstr: sqlstr,
    };
    query.connection = param.connection;
    mDspAduserModel.query(query, fn);
}

function updateRechargeTransanctionBatch(param, fn) {
    mLogger.debug('calling updateRechargeTransanctionBatch!');

    var transactions = [];

    //1.do the dsp business database
    var data = {
        user_id: param.user_id,
        mgr_id: param.mgr_id,
        charge_id: param.charge_id,
        amount: param.amount,
        status: param.status,
        transactionFun: updateBalanceTransanction,
    };
    transactions.push({data: data, model: mDspAduserModel});

    //2. do the adlib balance update
    data = {
        user_id: param.user_id,
        mgr_id: param.mgr_id,
        amount: param.amount,
        transactionFun: updateAdlibBalanceTransanction,
    };
    transactions.push({data: data, model: mAdlibUserModel});
    
    var options = {
        transactions: transactions,
    };

    mUtils.transactionBatch(options, fn);
}

function packageResponseData(data){
    if (!data) {
        return {};
    }

    var resData = {
        charge_status: ADCONSTANTS.REACHAGESTATUS.SUCCESS.name,
    }

    return resData;
}

function validate(data){
    if(!data){
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function preprocess(param) {
    if (param.status) {
        //to fen unit
        param.status = ADCONSTANTS.REACHAGESTATUS.parse(param.status);
    }
}

function isAcceptChargeType(type){
    if (type==ADCONSTANTS.FINANCIALRECHARGE.INTERNETBANK.code) {
        return true;
    }else if (type==ADCONSTANTS.FINANCIALRECHARGE.ALIPAY.code) {
        return true;
    }else if (type==ADCONSTANTS.FINANCIALRECHARGE.WECHAT.code) {
        return true;
    }
    return false;
}
function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    var logmsg = ' to update recharge for user: ' + user_id;
    mLogger.debug('Try' + logmsg);
    
    preprocess(param);
    
    var chargeRecord = {};

    mAsync.waterfall([
        //0. find the charge status
        function(next){
            var select = {
                id: '',
                charge_type: 1,
                charge_status: 1,
                amount: 1,
            };
            var match = {
                id: param.charge_id,
                ticket_no: param.ticket_no,
                user_id: param.user_id,
            };
            var query = {
                select:select,
                match: match,
            };
            mAccountRechargeLogModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else{
                    if (!rows||rows.length==0) {
                        var msg = 'There is no this recharge record!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }
                    chargeRecord = rows[0];
                    if (chargeRecord.charge_status==param.status) {
                        var msg = 'Try to update status to same status!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.PARAM_INVALID, msg:msg});
                    }
                    if (!isAcceptChargeType(chargeRecord.charge_type)) {
                        var msg ='Not allow to change recharge type:';
                        msg += ADCONSTANTS.FINANCIALRECHARGE.format(chargeRecord.charge_type);
                        mLogger.error(msg);
                        return next({code: ERRCODE.PARAM_INVALID, msg:msg});
                    }
                    next(null, chargeRecord);
                }
            });
        },
        //1. update the charge status
        function(chargeRecord, next) {
            var amount = 0;
            if (param.status==ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
                amount = chargeRecord.amount;
            }else {
                amount = -1 * chargeRecord.amount;
            }
            var data = {
                user_id: param.user_id,
                amount: amount,
                mgr_id: param.mgr_id,
                charge_id: param.charge_id,
                status: param.status,
            };
            updateRechargeTransanctionBatch(data, next);
        },
    ],function(err){
        if(err) {
            var msg = 'Failed ' + logmsg;
            mLogger.error(msg);
            fn(err);
        } else {
            var msg = 'Success ' + logmsg;
            mLogger.debug(msg);
            var resData = packageResponseData(param);
            fn(null, resData);
        }
    });
}

/*
* export the post interface
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

