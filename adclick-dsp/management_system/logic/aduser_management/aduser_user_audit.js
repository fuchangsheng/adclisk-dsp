/*
 * @file  aduser_user_audit.js
 * @description ad user audit view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_user_audit.logic';
var URLPATH = '/v1/aduser/audit';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mDspAduserModel = require('../../model/dsp_aduser').create();
var mAdlibUserModel = require('../../model/adlib_user').create();
var mAdxAuditUserModel = require('../../model/adlib_audit_users').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    audit: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.AUDIT.find(data);
            return type? true: false;
        },
    },
    message: {
        data: '',
        rangeCheck: function(data){
            return true;
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
        user_id: data.user_id,
        audit_status: ADCONSTANTS.AUDIT.format(data.audit),
    };

    return resData;
}

function updateDSPUser(param, fn) {
    var update = {
        user_audit_status: param.audit,
        user_audit_message: param.message,
    };
    var match = {
        user_id: param.user_id,
    };
    var query = {
        update: update,
        match: match,
    };

    query.connection = param.connection;
    mDspAduserModel.update(query, fn);
}

function updateAdlibUser(param, fn) {
    var update = {
        user_status: param.audit,
    };
    var match = {
        user_id: param.user_id,
    };
    var query = {
        update: update,
        match: match,
    };
    query.connection = param.connection;
    mAdlibUserModel.update(query, fn);
}

//mgtv not need to audit user, update, 
//update adx user audit status as local audit status.
function updateMgtvAuditStatus(param, fn) {
    var update = {
        audit_status: param.audit,
        failure_message: param.message,
    };
    var match = {
        user_id: param.user_id,
        adx_id: ADCONSTANTS.ADXLIST.ADX_MGTV.code,
    };
    var query = {
        update: update,
        match: match,
    };
    query.connection = param.connection;
    mAdxAuditUserModel.update(query, fn);
}

function updateCheckBatchTransanction(param, fn) {
    mLogger.debug('calling updateCheckBatchTransanction!');

    var transactions = [];

    //1.do the dsp business database
    var data = {
        user_id: param.user_id,
        audit: param.audit,
        message: param.message,
        transactionFun: updateDSPUser,
    };
    transactions.push({data: data, model: mDspAduserModel});

    data = {
        user_id: param.user_id,
        audit: param.audit,
        message: param.message,
        transactionFun: updateAdlibUser,
    }

    transactions.push({data: data, model: mAdlibUserModel});

    data = {
        user_id: param.user_id,
        audit: param.audit,
        message: param.message,
        transactionFun: updateMgtvAuditStatus,
    }

    transactions.push({data: data, model: mAdxAuditUserModel});

    var options = {
        transactions: transactions,
    };

    mUtils.transactionBatch(options, fn);
}

function preprocess(param) {
    if (param.audit) {
        param.audit = ADCONSTANTS.AUDIT.parse(param.audit);
    }
    param.message = param.message ||'';
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to update audit status for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    updateCheckBatchTransanction(param, function(err) {
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

