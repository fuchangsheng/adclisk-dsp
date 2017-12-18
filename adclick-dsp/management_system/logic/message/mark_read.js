/*
 * @file  mark_read.js
 * @description mark the internal message status API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.06
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'mark_read.logic';
var URLPATH = '/v1/message/read';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mMessagesModel = require('../../model/msg_list').create();
var mMsgNotifyLogModel = require('../../model/msg_notify_log').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    mgr_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidMgrId(data);
        },
    },
    msg_id: {
        data: '1',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true
    },
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
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var mgr_id = param.mgr_id;

    mLogger.debug('Try to mark internal message read status for user manager:' + mgr_id);
    
    mAsync.series([
        //1. mark the msg readed
        function(next) {
            var match = {
                receiver: mgr_id + '',
                type: ADCONSTANTS.RECEIVERTYPE.OPERATOR.code
            };

            if (param.msg_id) {
                match.msg_id = param.msg_id;
            }

            var update = {
                notify_status: ADCONSTANTS.MESSAGEREADSTATUS.READ.code,
            };
            
            var query = {
                update: update,
                match: match,
            };

            mMsgNotifyLogModel.update(query, next);
        },
    ], 
    function(err){
        if (err) {
            mLogger.error('Failed to mark the msg read for user operators ' + param.mgr_id);
            fn(err);    
        }else{
            mLogger.info('Success to mark the msg read for user operators' +  param.mgr_id);

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
