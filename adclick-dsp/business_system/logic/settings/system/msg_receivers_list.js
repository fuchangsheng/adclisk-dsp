/*
 * @file  msg_receivers_list.js
 * @description get the message receivers API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'msg_receivers_list.logic';
var URLPATH = '/v3/settings/system/msg-receiver/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mMsgReceiversModel = require('../../../model/msg_notify_receivers').create();

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
    type: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.RECEIVERTYPE.find(data);
            return type ? true: false;
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
        size: data.length,
        list: [],
    };
    for (var i = 0; i < data.length; i++) {
        var receiver = {
            id: data[i].id,
            receiver: data[i].receiver,
            type: ADCONSTANTS.RECEIVERTYPE.format(data[i].type),
            audit_status: ADCONSTANTS.AUDIT.format(data[i].audit_status)
        };
        resData.list.push(receiver);
    }
    return resData;
}

function preProcess(param) {
    if (param.type) {
        var type = ADCONSTANTS.RECEIVERTYPE.parse(param.type);
        param.type = type > 0 ? type : 0;
    }
}
function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;

    var logmsg = 'to get the receivers for user:' + user_id;
    mLogger.debug('Try '+logmsg);
    
    mAsync.waterfall([
        //1. read the receiver list
        function(next) {
            var match = {
                user_id: user_id,
            };

            if (param.type==ADCONSTANTS.RECEIVERTYPE.SMS ||
                param.type==ADCONSTANTS.RECEIVERTYPE.EMAIL) {
                match.type = param.type;
            }

            var select = {
                id: '',
                receiver: '1',
                type: 1,
                audit_status: 1,
            };

            var query = {
                select: select,
                match: match,
            };

            mMsgReceiversModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    var data = rows || [];
                    next(null, data);
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
