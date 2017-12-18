/*
 * @file  ads_plan_view.js
 * @description view the ad user's ad plan API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_plan_view.logic';
var URLPATH = '/v1/aduser/ads/plan/view';

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
        plan_id: data.plan_id,
        plan_name: data.plan_name,
        start_time: mMoment(data.start_time).format(ADCONSTANTS.HOURLYTIME),
        end_time: mMoment(data.end_time).format(ADCONSTANTS.HOURLYTIME),
        budget: mUtils.fenToYuan(data.budget),
        plan_status: ADCONSTANTS.ADSTATUS.format(data.plan_status),
        plan_cycle: data.plan_cycle,
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
    var logmsg = ' to create ad plan for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1. read the information from db
        function(next) {
            var match = {
                user_id: user_id,
                plan_id: param.plan_id,
            };
            var select = mADPlanModel.refModel;

            var query = {
                select: select,
                match: match,
            };
            mADPlanModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'The plan name is empty!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }
                    next(null, rows[0]);
                }
            });
        },
    ], function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
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

