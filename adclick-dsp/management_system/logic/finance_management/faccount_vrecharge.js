/*
 * @file  faccount_vrecharge.js
 * @description virture recharge logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_vrecharge.logic';
var URLPATH = '/v1/aduser/faccount/vrecharge';

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
    amount: {
        data: 1,
        rangeCheck: function(data) {
            return mIs.positive(data);
        } 
    }
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function recordRechargeLog(param, fn) {
    var logmsg = ' to create recharge log: ' + param.userId;
    var id = mDataHelp.createId(new Date() + 1);
    var ticketNo = mDataHelp.createId(new Date() + 1);
    
    var oper_id = param.mgr_id + '';

    var value = {
        id: id,
        user_id: param.user_id,
        account_type: 2,
        oper_id: oper_id,
        amount: param.amount,
        ticket_no: ticketNo,
        charge_type: ADCONSTANTS.FINANCIALRECHARGE.VMANUAL.code,
        charge_status: ADCONSTANTS.REACHAGESTATUS.SUCCESS.code,
    };

    var query = {
        fields: value,
        values: [value]
    };

    query.connection = param.connection;
    mAccountRechargeLogModel.create(query, fn);    
}

function updateDSPAccount(param, fn) {
    mLogger.debug('calling updateDSPAccount!');

    var sqlstr = 'update '+mDspAduserModel.tableName;
    sqlstr +=' set vbalance=vbalance+'+param.amount;
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
            recordRechargeLog(param, next);
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

function rechargeTransanctionBatch(param, fn) {
    mLogger.debug('calling rechargeTransanctionBatch!');

    var transactions = [];

    //1.do the dsp business database
    var data = {
        user_id: param.user_id,
        mgr_id: param.mgr_id,
        amount: param.amount,
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
    var logmsg = ' to recharge for user: ' + user_id;
    mLogger.debug('Try' + logmsg);
    
    preprocess(param);

    rechargeTransanctionBatch(param, function(err) {
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

