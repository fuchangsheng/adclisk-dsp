/*
 * @file  msg_receiver_del.js
 * @description del the receiver API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.06
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'msg_receiver_del.logic';
var URLPATH = '/v1/message/receivers/del';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mMsgReceivers = require('../../model/msg_notify_receivers').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
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

    var id = param.id || '';

    var logmsg = 'to remove receiver:'+id;
    mLogger.debug('Try '+logmsg);
    
    mAsync.waterfall([
        //1. check whether this is also in the system
        function(next) {
            var match = {
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
