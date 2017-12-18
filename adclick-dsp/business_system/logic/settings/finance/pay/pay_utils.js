/*
 * @file  pay_utils.js
 * @description alipay utils API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'pay_utils.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
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

//common constants
var ERRCODE = require('../../../../../common/errCode');
var ADCONSTANTS = require('../../../../../common/adConstants');

function updateRechargeStatus(param, fn) {
    mLogger.debug('calling updateRechargeStatus!');

    var update = {
       charge_status: param.charge_status,
       ticket_no: param.ticket_no,
    };
    var match = {
        id: param.id,
    };
    var query = {
        update: update,
        match: match,
    };
    query.connection = param.connection;
    mAdRechargeModel.update(query, fn);
}

function updateDSPAccount(param, fn) {
    mLogger.debug('calling updateDSPAccount!');

    var sqlstr = 'update '+mDspAduserModel.tableName;
    sqlstr +=' set rbalance=rbalance+'+param.total_fee;
    // sqlstr +=' , balance=balance+'+param.total_fee;
    sqlstr +=', uninvoice_amount=uninvoice_amount+'+param.total_fee;
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

    var charge_status = param.charge_status;
    mAsync.series([
        //1.update the charge status
        function(next) {
            updateRechargeStatus(param, next);
        },
        //2. add the balance
        function(next) {
            if (charge_status!=ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
                return next(null);
            }
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

    if (param.charge_status!=ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
    	return fn(null);
    }

    var sqlstr = 'update '+mAdlibUserModel.tableName;
    sqlstr +=' set balance=balance+'+param.total_fee * 1000;
    sqlstr +=' where user_id='+param.user_id;
    sqlstr += ';';

    var query = {
        sqlstr: sqlstr,
    };
    query.connection = param.connection;
    mAdlibUserModel.query(query, fn);
}

function payTransanctionBatch(param, fn) {
    mLogger.debug('calling transanctionBatch!');

    var transactions = [];

    //1.do the dsp business database
    var data = {
    	id: param.id,
        user_id: param.user_id,
        ticket_no: param.ticket_no,
        total_fee: param.total_fee,
        charge_status: param.charge_status,
        transactionFun: updateBalanceTransanction,
    };
    transactions.push({data: data, model: mDspAduserModel});

    if (param.charge_status==ADCONSTANTS.REACHAGESTATUS.SUCCESS.code) {
    	//2.do the adlib database
	    data = {
	        user_id: param.user_id,
	        total_fee: param.total_fee,
	        charge_status: param.charge_status,
	        transactionFun: updateAdlibBalanceTransanction,
	    };
	    transactions.push({data: data, model: mAdlibUserModel});
    }

    var options = {
        transactions: transactions,
    };

    mUtils.transactionBatch(options, fn);
}

module.exports.payTransanctionBatch = payTransanctionBatch;
