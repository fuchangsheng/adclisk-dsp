/*
 * @file  ads_plan_op.js
 * @description op the ad user's ad plan API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_plan_op.logic';
var URLPATH = '/v1/aduser/ads/plan/control';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mADPlanModel = require('../../model/adlib_plans').create();

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
    plan_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidPlanId(data);
        },
    },
    action: {
        data : '',
        rangeCheck: function(data) {
            var action = ADCONSTANTS.ADACTION.find(data);
            return action ? true: false;
        },
        optional: true,
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
        plan_id: data.plan_id
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
    var logmsg = ' to edit ad plan for user:' + user_id ;
    mLogger.debug('Try '+logmsg);
    
    if(param.action) {
        param.action = ADCONSTANTS.ADACTION.parse(param.action);
    }

    mAsync.series([
        //1. check whether this ad plans in the system
        function(next) {
            var match = {
                user_id: user_id,
                plan_id: param.plan_id,
            };
            var query = {
                match: match,
            };
            mADPlanModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total<=0) {
                        var msg = 'There is no this plan!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }

                    next(null, total);
                }
            });
        },
        //2. change the plan status
        function(next) {
            var status = ADCONSTANTS.ADSTATUS.PAUSE.code;
            if(param.action == ADCONSTANTS.ADACTION.START.code) {
                status = ADCONSTANTS.ADSTATUS.START.code;
            }
            var update = {
                plan_status: status,
            };
            var match = {
                user_id: user_id,
                plan_id: param.plan_id,
            };
            var query = {
                match: match,
                update: update,
            };
            mADPlanModel.update(query, next);
        },
    ], function(err) {
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

