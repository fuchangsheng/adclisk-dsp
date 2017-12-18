
'use strict';
var MODULENAME = 'ads_unit_target_detail.js';
var URLPATH = '/v3/ads/unit/target_setting_view';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");
var AdsUtils = require('../../utils/ads_utils');

//models
var mADPlanModel = require('../../../model/adlib_plans').create()
var mADUnitModel = require('../../../model/adlib_units').create();
var mADUnitTargetModel = require('../../../model/adlib_unit_target').create();

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
    unit_id: {
        data: 'name',
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
    if (!data) {
        return {};
    }
    
    var targets = data;
    var resData = {
        size: targets.length,
        list: []
    };

    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        AdsUtils.formatUnitTarget(target);
        var value = {
           // id: target.id,
            unit_id: target.unit_id,
           // user_id: target.user_id,
            type: ADCONSTANTS.ADTARGETTYPE.format(target.type),
            content: target.content,
            status: ADCONSTANTS.ADTARGETSTATUS.format(target.status),
        };
        resData.list.push(value);
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
  
    var logmsg = ' to edit ad plan unit targets for user:' + user_id;
    mLogger.debug('Try '+logmsg);

    var match = {
        user_id: param.user_id,
        unit_id: param.unit_id,
    };
    var select = mADUnitTargetModel.refModel;
    var query = {
        select: select,
        match: match,
    };

    mADUnitTargetModel.lookup(query, function(err, rows) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(rows);
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

