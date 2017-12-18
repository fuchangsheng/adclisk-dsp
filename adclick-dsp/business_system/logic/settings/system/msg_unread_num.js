/*
 * @file  msg_unread_num.js
 * @description internal message unread numbers API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'msg_unread_num.logic';
var URLPATH = '/v3/settings/system/msg/unread-num';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mAdOperModel = require('../../../model/aduser_operators').create();
var mMsgNotifySetModel = require('../../../model/msg_notify_set').create();
var mMessagesModel = require('../../../model/msg_list').create();
var mMsgNotifyLogModel = require('../../../model/msg_notify_log').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    oper_id: { 
        data: 'password',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
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
    if (!mUtils.isExist(data)) {
        return {};
    }

    var resData = {
        num: data || 0
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    var oper_id = param.oper_id;
    var logmsg = ' to get the unread message numbers for oper_id:'+oper_id;

    mLogger.debug('Try'+logmsg);
    
    mAsync.waterfall([
        //1. find the message read status
        function(next) {
            var match = {
                user_id: user_id,
                receiver: param.oper_id,
                type: ADCONSTANTS.RECEIVERTYPE.OPERATOR.code,
                notify_status: ADCONSTANTS.MESSAGEREADSTATUS.UNREAD.code,
            };
            
            var query = {
                match: match,
            };
            mMsgNotifyLogModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
    ], 
    function(err, total){
        if (err) {
            mLogger.error('Failed'+logmsg);
            fn(err);    
        }else{
            mLogger.info('Success'+logmsg);

            var resData = packageResponseData(total);
            fn(null, resData);
        }
    });
}

/*
* export the get interface
*/
mRouter.get(URLPATH, function(req, res, next){
    var param = req.query;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;
