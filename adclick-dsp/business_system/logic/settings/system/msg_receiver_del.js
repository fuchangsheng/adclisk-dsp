/*
 * @file  msg_receiver_del.js
 * @description del the receiver API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'msg_receiver_del.logic';
var URLPATH = '/v3/settings/system/msg-receiver/del';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mMsgReceivers = require('../../../model/msg_notify_receivers').create();

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
    id: {
        data: '',
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

    var user_id = param.user_id;
    var id = param.id || '';


    var logmsg = 'to remove receiver from user:' + user_id+', receiver:'+id;
    mLogger.debug('Try '+logmsg);
    
    mAsync.waterfall([
        //1. check whether this is also in the system
        function(next) {
            var match = {
                user_id: user_id,
                id: id,
            };

            var select = {
                id: '',
                receiver: '1',
            };

            var query = {
                select: select,
                match: match,
            };

            mMsgReceivers.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    var find = false;
                    if (!rows || rows.length == 0) {
                        var msg = 'The receiver is not in the system!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }else {
                        next(null, {});
                    }
                }
            });
        },
        //2. remove reciver from the system
        function(data, next) {
            var match = {
                user_id: user_id,
                id: id,
            };

            var query = {
                match: match,
            };

            mMsgReceivers.remove(query, function(err) {
                if (err) {
                    next(err);
                }else {
                    next(null, {});
                }
            });
        }
    ], 
    function(err, data){
        if (err) {
            mLogger.error('Failed '+logmsg);
            fn(err);    
        }else{
            mLogger.info('Success '+logmsg);

            var resData = packageResponseData(data);
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
