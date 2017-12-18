/*
 * @file  verify_code_log_clear.task.js
 * @description verify code log clear API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.18
 * @version 0.8
 */
'use strict';
var MODULENAME = 'verify_code_log_clear.task';

//system modules
var mMoment = require('moment');
var mAsync = require('async');
var mFs = require('fs');
var mPath = require("path");

var TaskManager = require('./task_manager');

//models
var mCodeModel = require('../model/verify_code').create();

//common constants
var ERRCODE = require('../../common/errCode');
var ADCONSTANTS = require('../../common/adConstants');

//utils
var mLogger = require('../../utils/logger')(MODULENAME);

function taskCallback() {
	var deadline = mMoment().subtract(1, 'days');
	var deadline_format = deadline.format(ADCONSTANTS.DATATIMEFORMAT);

	var sqlstr = 'delete from ' + mCodeModel.tableName;
	sqlstr += ' where create_time < "' + deadline_format+'"';

	var query = {
		sqlstr : sqlstr,
	};

	mCodeModel.query(query, function(err) {
		if(err) {
			mLogger.error(err);
		} else {
			mLogger.debug(MODULENAME + ' finished');
		}
	});

	//------------------------
	var filePath = './download/captha';
	mFs.readdir(filePath ,function(err,files){
	    if(err){
	        return mLogger.error(err);
	    }
	    var count = files.length;
	    var results = {};
	    files.forEach(function(filename) {
	    	var filepath = mPath.join(filePath,filename);
			var stat = mFs.statSync(filepath);
			if(stat.isFile()){
            	if(deadline.isAfter(stat.ctime)) {
            		mFs.unlinkSync(filepath);
            	}
            }
		});
	});
}

module.exports.taskCallback = taskCallback;