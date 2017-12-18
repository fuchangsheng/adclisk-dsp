/*
 * @file  account_recharge_log_clear.task.js
 * @description account recharge log clear API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.18
 * @version 0.8
 */
'use strict';
var MODULENAME = 'account_recharge_log_clear.task';

//system modules
var mMoment = require('moment');
var mAsync = require('async');

var TaskManager = require('./task_manager');

//models
var mAdRechargeModel = require('../model/account_recharge_log').create();

//common constants
var ERRCODE = require('../../common/errCode');
var ADCONSTANTS = require('../../common/adConstants');

//utils
var mLogger = require('../../utils/logger')(MODULENAME);

function taskCallback() {
	var deadline = mMoment().subtract(1, 'days');
	deadline = deadline.format(ADCONSTANTS.DATATIMEFORMAT);

	var sqlstr = 'update ' + mAdRechargeModel.tableName;
	sqlstr += ' set charge_status = ' + ADCONSTANTS.REACHAGESTATUS.FAIL.code;
	sqlstr += ' where (charge_status = ' + ADCONSTANTS.REACHAGESTATUS.VERIFY.code;
	sqlstr += ' or charge_status = ' + ADCONSTANTS.REACHAGESTATUS.CREATE.code + ')';
	sqlstr += ' and create_time < "' + deadline+'"';

	var query = {
		sqlstr : sqlstr,
	};

	mAdRechargeModel.query(query, function(err) {
		if(err) {
			mLogger.error(err);
		} else {
			mLogger.debug(MODULENAME + ' finished');
		}
	});
}

module.exports.taskCallback = taskCallback;