/*
 * @file  ads_plan_delete.js
 * @description delete the ad user's ad plan API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.12.06
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = "ads_plan_delete.logic";
var URLPATH = '/v3/ads/plan/delete';

var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require("async");
var mIs = require("is_js");
var mMoment = require("moment");

var LogicApi = require('../../logic_api');

var mADPlanModel = require("../../../model/adlib_plans").create();

var mLogger = require("../../../../utils/logger")(MODULENAME);
var mDataHelper = require("../../../../utils/data_helper");
var mUtils = require("../../../../utils/utils");
var AdsDelUtils = require("../ads_del_utils.js");

var ERRCODE = require("../../../../common/errCode");
var ADCONSTANTS = require("../../../../common/adConstants");

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidUserId(data);
        },
    },
    plan_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidPlanId(data);
        },
    },
};


var mLogicHelper = new LogicApi({
    debug: mDebug,
    refModel: mRefModel,
    moduleName: MODULENAME
});

function validate(data) {
    if (!data) {
        return false;
    }
    return mLogicHelper.validate({
        inputModel: data,
    });
}

function packageResponseData(data,plan_name) {
    if (!data) {
        return {};
    }

    var resData = {
        plan_id: data.plan_id,
        plan_name: plan_name
    };
    return resData;
}

function processRequest(param, fn) {
    if (!validate(param)) {
        var msg = "Invalid data";
        mLogger.error(msg);
        return fn({
            code: ERRCODE.PARAM_INVALID,
            msg: msg
        });
    }

    var user_id = param.user_id;
    var logmsg = " to delete ad plan for user:" + user_id;

    mLogger.debug("Try " + logmsg);

    mAsync.waterfall([
        function (next) {
            var select = {
                plan_name: "",
            };
            var match = {
                plan_id: param.plan_id,
            };
            var query = {
                select: select,
                match: match,
            };
            mADPlanModel.lookup(query, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows && rows.length > 0 && rows[0].plan_name != "") {
                        mLogger.debug("have plan_name:" + rows[0].plan_name);
                        return next(null, rows[0].plan_name);
                    }
                    mLogger.debug("have no plan_name:");
                    next({
                        code: ERRCODE.DB_NO_MATCH_DATA,
                        msg: msg
                    });
                }
            });
        },

        function (plan_name,next) {
            AdsDelUtils.adsDelTransanctionBatch(param, function (err) {
                if (err) {
                    mLogger.error("Failed " + logmsg);
                    next(err);
                } else {
                    mLogger.debug("Success " + logmsg);
                    next(null, plan_name);
                }
            });
        },
    ],function(err,plan_name){
        if(err){
            fn(err);
        }else{
            mLogger.debug("Succeed" + logmsg);
            var resData = packageResponseData(param,plan_name);
            fn(null,resData);
        }
    });
}

mRouter.post(URLPATH, function (req, res, next) {
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