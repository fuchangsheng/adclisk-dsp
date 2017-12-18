/*
 * @file  ads_plan_create.js
 * @description create the ad user's ad plan API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.11.27
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = "ads_plan_create.logic";
var URLPATH = '/v3/ads/plan/create';

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

var ERRCODE = require("../../../../common/errCode");
var ADCONSTANTS = require("../../../../common/adConstants");

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidUserId(data);
        },
    },
    plan_name: {
        data: "name",
        rangeCheck: function (data) {
            return !mUtils.isEmpty(data);
        },
    },
    start_time: {
        data: "YYYY-MM-DD HH:mm:ss",
        rangeCheck: function (data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        },
    },
    end_time: {
        data: "YYYY-MM-DD HH:mm:ss",
        rangeCheck: function (data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        },
        optional: true,
    },
    budget: {
        data: 1,
        rangeCheck: function (data) {
            return data > ADCONSTANTS.ADPLANBUDGETMIN;
        },
    },
    plan_cycle: {
        data: "",
        rangeCheck: function (data) {
            return !mUtils.isEmpty(data);
        },
    },
    delivery_type: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidDeliveryType(data);
        },
    },
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    mRefModel: mRefModel
});

function validate(data) {
    console.log(JSON.stringify(data));
    if (!data) {
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function preProcess(param) {
    if (param.budget) {
        param.budget = mUtils.yuanToFen(param.budget);
    }
}

function packageResponseData(data) {
    if (!data) {
        return {};
    }

    var resData = {
        plan_id: data.plan_id,
    };
    return resData;
}


function processRequest(param, fn) {
    console.log("create param:" + JSON.stringify(param));
    if (!validate(param)) {
        var msg = "Invalid data";
        mLogger.error(msg);
        return fn({
            code: ERRCODE.PARAM_INVALID,
            msg: msg
        });
    }

    var user_id = param.user_id;
    var plan_name = param.plan_name;
    var logmsg = " to create ad plan for user:" + user_id;
    mLogger.debug("Try " + logmsg);

    preProcess(param);

    mAsync.waterfall([
        //1.check whether the name duplicated in the system
        function (next) {
            var match = {
                user_id: user_id,
                plan_name: plan_name,
            };
            var query = {
                match: match,
            };
            mADPlanModel.count(query, function (err, total) {
                if (err) {
                    next(err);
                } else {
                    if (total > 0) {
                        var msg = "The plan name duplicated!";
                        mLogger.error(msg);
                        return next({
                            code: ERRCODE.DB_DATADUPLICATED,
                            msg: msg
                        });
                    }
                    next(null, {});
                }
            });
        },
        //2. create the plan
        function (data, next) {
            var value = {
                user_id: user_id,
                plan_name: plan_name,
                start_time: mMoment(param.start_time),
                budget: param.budget,
                plan_cycle: param.plan_cycle,
                plan_status: ADCONSTANTS.ADSTATUS.NOTSTART.code,
                delivery_type: param.delivery_type,
            };
            //// One-day budget must be more than 100
            // if(param.budget < 10000){
            //     var msg = "Budget is less than 100";
            //     mLogger.error(msg);
            //     return fn({
            //         code: ERRCODE.BUDGET_NOTENOUGH,
            //         msg: msg
            //     });
            // }
            if (typeof (param.end_time) == "undefined") {
                value.end_time = mMoment(ADCONSTANTS.DEFAULTPLANENDTIME);
            } else {
                value.end_time = mMoment(param.end_time);
            }
            mLogger.debug("value.end_time:" + value.end_time);
            var query = {
                fields: value,
                values: [value],
            };
            mLogger.debug("plan_create start_time:" + query.fields.start_time);
            mLogger.debug("Plan_create end_time:" + query.fields.end_time);
            mADPlanModel.create(query, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    next(null, {
                        plan_id: rows.insertId || -1
                    });
                }
            });
        },
        //3.get plan_id
        function (data, next) {
            if (data.plan_id >= 0) {
                return next(null, data);
            }
            var select = {
                plan_id: 1,
            };
            var match = {
                user_id: user_id,
                plan_name: plan_name,
            };
            mADPlanModel.lookup(query, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    return next(null, rows[0]);
                }
            });
        },
    ], function (err, data) {
        if (err) {
            mLogger.error("Failed" + logmsg);
            fn(err);
        } else {
            mLogger.debug("Succeed" + logmsg);
            var resData = packageResponseData(data);
            fn(null, resData);
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