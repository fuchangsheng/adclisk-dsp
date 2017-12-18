/*
 * @file  sms_log_clear.task.js
 * @description sms log clear API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.18
 * @version 0.8
 */
'use strict';
var MODULENAME = 'sms_log_clear.task';

//system modules
var mMoment = require('moment');
var mAsync = require('async');

var TaskManager = require('./task_manager');

//models
var mSmsModel = require('../model/sms_log').create();

//common constants
var ERRCODE = require('../../common/errCode');
var ADCONSTANTS = require('../../common/adConstants');

//utils
var mLogger = require('../../utils/logger')(MODULENAME);

function taskCallback() {
	var deadline = mMoment().subtract(ADCONSTANTS.SMSCODEPERIODTIME, 'minutes');
	deadline = deadline.format(ADCONSTANTS.DATATIMEFORMAT);

	var sqlstr = 'delete from ' + mSmsModel.tableName;
	sqlstr += ' where create_time < "' + deadline+'"';

	var query = {
		sqlstr : sqlstr,
	};

	mSmsModel.query(query, function(err) {
		if(err) {
			mLogger.error(err);
		} else {
			mLogger.debug(MODULENAME + ' finished');
		}
	});
}

module.exports.taskCallback = taskCallback;