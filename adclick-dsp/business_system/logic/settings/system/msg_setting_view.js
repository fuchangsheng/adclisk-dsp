/*
 * @file  msg_setting_view.js
 * @description message notification settting API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'msg_setting_view.logic';
var URLPATH = '/v3/settings/system/msg-settings/view';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mMsgNotifySetModel = require('../../../model/msg_notify_set').create();

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
        list: []
    };

    for (var i = 0; i < data.length; i++) {
        var setting = {
            id: data[i].id,
            categories: ADCONSTANTS.MESSAGECATEGORIES.format(data[i].categories),
            subcategories: ADCONSTANTS.MESSAGESUBCATEGORIES.format(data[i].subcategories),
            channel: ADCONSTANTS.MESSAGECHANNEL.format(data[i].channel),
        } ;
        resData.list.push(setting);
    }

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    
    var logmsg = 'to get the notify setting for user:' + user_id;
    mLogger.debug('Try '+logmsg);
    
    mAsync.waterfall([
        //1. read the notify setting for the ad user
        function(next) {
            var match = {
                user_id: user_id,
            };
            
            var select = {
                id: 'id',
                categories: 1,
                subcategories: 1,
                channel: 1,
            };
            var query = {
                select: select,
                match: match,
            };
            mMsgNotifySetModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    var datas = rows || [];
                    next(null, datas);
                }
            });
        },
    ], 
    function(err, result){
        if (err) {
            mLogger.error('Failed '+logmsg);
            fn(err);    
        }else{
            mLogger.info('Success '+logmsg);
            var resData = packageResponseData(result);
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
