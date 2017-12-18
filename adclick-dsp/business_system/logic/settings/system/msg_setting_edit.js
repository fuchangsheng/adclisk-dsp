/*
 * @file  msg_setting_edit.js
 * @description message notification setting edit API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'msg_setting_edit.logic';
var URLPATH = '/v3/settings/system/msg-settings/edit';

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

//to check the notify setting data
var mNotifySetRefModel = {
    categories: {
        data:'',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.MESSAGECATEGORIES.find(data);
            return type? true:false; 
        }
    },
    subcategories: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.MESSAGESUBCATEGORIES.find(data);
            return type? true:false;
        },
    },
    channel : {
        data: '',
        rangeCheck: function(data) {
           if (mUtils.isEmpty(data)) {
                return true;
           }
           var channel = ADCONSTANTS.MESSAGECHANNEL.find(data);
           return channel ? true: false;
        },
    },
};

var mNotifySetChecker = new  LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mNotifySetRefModel
});

function notifySetCheck(data) {
    if(!data){
        return false;
    }

    return mNotifySetChecker.validate({
        inputModel: data,
    });
}

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidUserId(data);
        }
    },
    list: {
        data: [],
        rangeCheck: function(datas) {
            var isvalid = true;
            for (var i = 0; i < datas.length; i++) {
                isvalid = notifySetCheck (datas[i]);
                if (isvalid==false) {
                    break;
                }
            }
            return isvalid;
        }
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
        
    };

    return resData;
}

function removeOldSetting(param, fn) {
    mLogger.debug('calling removeOldSetting');

    var match = {
        user_id: param.user_id,
    }
    var query = {
        match: match,
    };

    query.connection = param.connection;
    mMsgNotifySetModel.remove(query, fn);
}

function setNewSetting(param, fn) {
    if (param.list.length ==0) {
        return fn(null);
    }

    var values = [];
    var datas = param.list;
    var user_id = param.user_id ;

    for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        var seed = user_id + data.categories + data.subcategories;
        var id = mDataHelper.createId(seed);
        var categories = ADCONSTANTS.MESSAGECATEGORIES.parse(data.categories);
        var subcategories = ADCONSTANTS.MESSAGESUBCATEGORIES.parse(data.subcategories);
        if (mUtils.isEmpty(data.channel)) {
            data.channel = ADCONSTANTS.MESSAGECHANNEL.EMPTY.name;
        }
        var channel = ADCONSTANTS.MESSAGECHANNEL.parse(data.channel);

        var value = {
            id: id,
            user_id: user_id,
            categories: categories,
            subcategories: subcategories,
            channel: channel,
        };
        values.push(value);
    }

    var query = {
        fields: values[0],
        values: values,
    };
    query.connection = param.connection;

    mMsgNotifySetModel.create(query, fn);
}

function transanctionCallback(param, fn) {
    mLogger.debug('calling createAdUserTranCallbackrea');

    var user_id = param.user_id;

    mAsync.series([
        function(next){
            removeOldSetting(param, next);
        },
        function(next){
            setNewSetting(param, next);
        }
    ],function(err){
        if (err) {
            fn(err);
        }else{
            fn(null, {});
        }
    })
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    
    var logmsg = ' to edit the notify setting for user:' + user_id;
    mLogger.debug('Try'+logmsg);
    
    param.transactionFun = transanctionCallback;
    mMsgNotifySetModel.doTransaction(param, function(err, data) {
        if (err) {
            mLogger.error('Failed'+logmsg);
            fn(err);
        }else {
            mLogger.debug('Success'+logmsg);
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
