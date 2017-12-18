/*
 * @file  adx_idea_audit_edit.js
 * @description adx ideas audit to edit API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.24
 * @version 1.1.0 
 */
'use strict';
var MODULENAME = 'adx_idea_audit_edit.logic';
var URLPATH = '/v1/adx/idea/audit/edit';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdxAuditIdeaModel = require('../../model/adlib_audit_ideas').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');


var mRefModel = {
    id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
        }
    },
    adx_idea_id: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    audit_status: {
    	data: '',
    	rangeCheck: function(data) {
            return ADCONSTANTS.AUDIT.find(data);
        },
        optional: true,
    }
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
        id: data.id,
    };

    return resData;
}

function preProcess(param) {
	if(param.audit_status) {
		param.audit_status = ADCONSTANTS.AUDIT.parse(param.audit_status);
	}
}

function processRequest(param, fn) {
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }
    
    var logmsg = ' to edit idea audit status';
    mLogger.debug('Try '+logmsg);

    preProcess(param);

    mAsync.series([
    	function(next) {
    		var update = {};
    		if(mUtils.isExist(param.audit_status)) {
    			update.audit_status = param.audit_status;
    		}
    		if(mUtils.isExist(param.adx_idea_id)) {
    			update.adx_idea_id = param.adx_idea_id;
    		}
    		if(Object.keys(update).length == 0) {
    			var msg = 'Invalid data';
		        mLogger.error(msg);
		        return next({code: ERRCODE.PARAM_INVALID, msg: msg});
    		}

		    var match = {
		        id: param.id
		    };
		    var query = {
		        update: update,
		        match: match
		    };
		    mAdxAuditIdeaModel.update(query, function(err, rows) {
		        if (err) {
		            next(err);
		        } else {
		            next(null, rows);
		        }
		    });
    	}
    ], function(err, data) {
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

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,
    });
});

module.exports.router = mRouter;