/*
 * @file  ads_plan_chstatus.js
 * @description change  the ad user's ad plan status API and logic
 * notice:we will set the plan to not start after edit
 * user must start it again
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.11.27
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = "ads_plan_chstatus.logic";
var URLPATH = '/v3/ads/plan/chstatus';

var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require("async");
var mIs = require("is_js");
var mMoment = require("moment");

var LogicApi = require('../../logic_api');


var mADPlanModel = require("../../../model/adlib_plans").create();
var mADUserModel = require('../../../model/adlib_user').create();

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
    plan_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidPlanId(data);
        },
    },
    action: {
        data: '',
        rangeCheck: function (data) {
            var action = ADCONSTANTS.ADACTION.find(data);
            return action ? true : false;
        },
    },
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel,
});


function validate(data) {
    if (!data) {
        return {};
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function preProcessParam(param) {
    if (param.action) {
        param.action = ADCONSTANTS.ADACTION.parse(param.action);
    }
}

function getPlanInfoByID(plan_id, cb) {
    var refModelTmp = mADPlanModel.refModel;
    var match = {
        plan_id: plan_id,
    };
    mLogger.debug("match:plan_id:" + plan_id);
    var query = {
        match: match,
        select: refModelTmp,
    };
    mADPlanModel.lookup(query, function (err, rows) {
        if (err) {
            mLogger.error("getPlanInfoByID lookup failed");
            cb(err);
        } else {
            if (rows.length == 0) {
                var msg = 'Cannot find plan_id ' + plan_id;
                mLogger.error(msg);
                cb({
                    code: ERRCODE.DATA_INVALID,
                    msg: msg
                });
            } else {
                var plan_info = rows[0];
                mLogger.debug("getPlanInfoById rows[0]:" + JSON.stringify(rows[0]));
                cb(null, plan_info);
            }
        }
    });
}

function totalBudgetByPlanId(plan_info) {
    var end_time = plan_info.end_time;
    var begin_time = plan_info.begin_time;
    var cycle = plan_info.plan_cycle;
    var duration_days = 0;

    duration_days = mUtils.getDurationDays(begin_time, end_time, cycle);
    mLogger.debug("plan_info.total_budget:" + plan_info.budget);
    mLogger.debug("duration_days:" + duration_days);
    var total = plan_info.budget * duration_days;
    mLogger.debug("totalBudgetByPlanIf total:" + total);
    return total;
}

function getPlanInfosByUserId(user_id, cb) {
    var now = mMoment().format(ADCONSTANTS.DATATIMEFORMAT);

    var sqlstr = 'select * from ' + mADPlanModel.tableName;
    sqlstr += ' where plan_status=0';
    sqlstr += ' and plan_cycle!="000000000000000000000000000000000000000000"';
    sqlstr += ' and end_time > "' + now + '"';
    sqlstr += ' and user_id = ' + user_id;

    var query = {
        sqlstr: sqlstr,
    }
    mADPlanModel.query(query, function (err, rows) {
        if (err) {
            mLogger.debug("query err137");
            cb(err);
        } else {
            mLogger.debug("rows.length:" + rows.length);
            for (var i in rows) {
                mLogger.debug("rows[" + i + "]:" + JSON.stringify(rows[i]));
                mLogger.debug("rows[" + i + "].budget:" + rows[i].budget);
            }
            cb(null, rows);
        }
    });
}



function getBalanceByUserId(user_id, cb) {
    var select = {
        balance: 1,
        user_id: user_id,
    };
    var match = {
        user_id: user_id,
    };

    var query = {
        match: match,
        select: select,
    };
    mADUserModel.lookup(query, function (err, rows) {
        if (err) {
            cb(err);
        } else {
            if (rows.length == 0) {
                var msg = 'Cannot find user_id ' + user_id;
                mLogger.error(msg);
                cb({
                    code: ERRCODE.DATA_INVALID,
                    msg: msg
                });
            } else {
                var balance = rows[0].balance / 1000;
                mLogger.debug("rows[0].blanace:" + rows[0].balance);
                cb(null, balance);
            }
        }
    });
}

function adsPlanBalanceInfo(param, fn) {
    var user_id = param.user_id;
    var plan_id = param.plan_id;
    var resData = {
        balance: 0,
        total_budget: 0,
    };
    if (!user_id && !plan_id) {
        return fn(null, resData);
    }
    if (!user_id) {
        mAsync.waterfall([function (next) {
            mLogger.debug("@@@***********begin to call;");
            getPlanInfoByID(plan_id, next);
        }, function (plan_info, next) {
            var user_id = plan_info.user_id;
            mLogger.debug("plan_info:" + JSON.stringify(plan_info));
            resData.total_budget = totalBudgetByPlanId(plan_info);
            getBalanceByUserId(user_id, next);
        }, ], function (err, balance) {
            if (err) {
                return fn(err);
            } else {
                resData.balance = balance;
                return fn(null, resData);
            }
        });
    }
    if (!plan_id) {
        mAsync.waterfall([
            function (next) {
                getBalanceByUserId(user_id, next);
            },
            function (balance, next) {
                resData.balance = balance;
                getPlanInfosByUserId(user_id, next);
            },
            function (plan_infos, next) {
                mLogger.debug("heheheeheh");
                var totalBudget = 0;
                for (var i in plan_infos) {
                    mLogger.debug("plan_infos[i]:" + plan_infos[i]);
                    mLogger.debug("plan_infos[i].budget:" + plan_infos[i].budget);
                    totalBudget += totalBudgetByPlanId(plan_infos[i]);
                }
                resData.total_budget = totalBudget;
                next(null);
            },
        ], function (err) {
            if (err) {
                return fn(err);
            } else {
                mLogger.debug("resData:" + JSON.stringify(resData));
                return fn(null, resData);
            }
        });
    }
}

//dur_days:Period of current time from first time ready-plan(ready to run,request to be opened) be started date 
//runing_duration_days:current-plan's(is already running) running days utill first time ready-plan run
//getDurationDays will set begin_time to  later than current(now) time
function planBudgetWithDurDays(plan_info, dur_days) {
    var begin_time = plan_info.begin_time;
    mLogger.debug("")
    var end_time = mMoment(plan_info.begin_time).add(dur_days, 'days');
    mLogger.debug("new end_time:" + mMoment(end_time).format("YYYY-MM-DD"));
    var cycle = plan_info.plan_cycle;
    var runing_duration_days = 0;
    mLogger.debug("dur_days:" + dur_days);
    //getDurationDays will set begin_time to  later than current(now) time
    runing_duration_days = mUtils.getDurationDays(begin_time, end_time, cycle);
    mLogger.debug("plan_info.total_budget:" + plan_info.budget);
    mLogger.debug("runing_duration_days:" + runing_duration_days);
    var total = plan_info.budget * runing_duration_days;
    mLogger.debug("planBudgetWithDurDays total:" + total);
    return total;
}

function durDaysUntillBeginToRun(plan_info) {
    var end_time = plan_info.end_time;
    var start_time = plan_info.start_time;
    var cycle = plan_info.plan_cycle;
    var duration_days = 0;

    var cycleInfo = mUtils.getCycleDayInfo(cycle);
    var start = mMoment(start_time);
    var end = mMoment(end_time);
    var now = mMoment();
    if (start.isBefore(now)) {
        start = now;
    }
    var start_day = start.day();
    var end_day = end.day();
    var start_date = mMoment(start.format('YYYY-MM-DD'));
    var end_date = mMoment(end.format('YYYY-MM-DD'));
    var days = end_date.diff(start_date, 'days') + 1;
    if (days <= 0) {
        mLogger.error("Unexcepted err:" + "Plan has no running date");
        return 0;
    }
    for (var i = 0; i < 7; ++i) {
        var cur_date = mMoment(start_date).add(i, 'days');
        if (mUtils.isInCycle(cycleInfo, cur_date)) {
            var duration_days = i + 1;
            mLogger.debug("duration_days:" + duration_days);
            return duration_days;
        }
        days -= 1;
        if (days < 0) {
            mLogger.error("Unexcepted err:" + "Plan has no running date");
            return 0;
        }
    }
    mLogger.error("Unexcepted err:" + "Plan has no running date ");
    return 0;
}

function getAllPlansBudget(plan_infos, current_plan_info, duration_days) {
    var user_total_budget = current_plan_info.budget;
    for (var i in plan_infos) {
        user_total_budget += planBudgetWithDurDays(plan_infos[i], duration_days);
    }
    mLogger.debug("getAllPlansBudget user_total_budget:" + user_total_budget);
    return user_total_budget;
}


function packageResponseData(data) {
    if (!data) {
        return {};
    }

    var resData = {
        plan_id: data.plan_id
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
    var logmsg = 'to control ad plan status for users:' + user_id;
    mLogger.debug("Try " + logmsg);

    preProcessParam(param);

    mAsync.waterfall([
        function (next) {
            var match = {
                user_id: user_id,
                plan_id: param.plan_id,
            };
            var query = {
                match: match,
            }
            mADPlanModel.count(query, function (err, total) {
                if (err) {
                    next(err);
                } else {
                    if (total == 0) {
                        var msg = 'There is no matched plan';
                        mLogger.error(msg);
                        return next({
                            code: ERRCODE.DB_NO_MATCH_DATA,
                            msg: msg
                        });
                    }
                    next(null, total);
                }
            });
        },

        //get plan_info
        function (data, next) {
            if (param.action != ADCONSTANTS.ADACTION.START.code) {
                return next(null);
            }
            // obtained plan_info
            getPlanInfoByID(param.plan_id, function (err, plan_info) {
                if (err) {
                    next(err);
                } else {
                    // get user balance
                    adsPlanBalanceInfo({
                        user_id: param.user_id
                    }, function (err, info) {
                        var plan_info_package = {
                            user_id: param.user_id,
                            plan_info: plan_info,
                            user_balance: info.balance
                        };
                        mLogger.debug("adsPlanBalanceInfo plan_info:" + plan_info);
                        if (err) {
                            next(err);
                        } else {
                            next(null, plan_info_package);
                        }
                    });
                }
            });
        },

        //check budget whether to start plan
        function (plan_info_data, next) {
            mLogger.debug("plan_info:" + JSON.stringify(plan_info_data.plan_info));
            var duration_days = durDaysUntillBeginToRun(plan_info_data.plan_info);
            getPlanInfosByUserId(user_id, function (err, user_plan_infos) {
                if (user_plan_infos.length <= 0) {
                    next(null);
                } else {
                    var total_budget = getAllPlansBudget(user_plan_infos, plan_info_data.plan_info, duration_days);
                    if (total_budget > plan_info_data.user_balance) {
                        var msg = 'Total budget is more than balance';
                        mLogger.error(msg);
                        next({
                            code: ERRCODE.BUDGET_OVERFLOW,
                            msg: msg
                        });
                    } else {
                        next(null);
                    }
                }
            });

        },

        // //check total budget
        // function (next) {
        //     if (param.action != ADCONSTANTS.ADACTION.START.code) {
        //         return next(null);
        //     }
        //     mLogger.debug("242:getPlanInfoByID");
        //     //由plan_id查找plan信息：plan_info
        //     getPlanInfoByID(param.plan_id, function (err, plan_info) {
        //         if (err) {
        //             next(err);
        //         } else {
        //             mLogger.debug("***aaadsPlanBalanceInfo");
        //             //传入user_id
        //             adsPlanBalanceInfo({
        //                 user_id: param.user_id
        //             }, function (err, info) {
        //                 if (err) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        //                     next(err);
        //                     mLogger.debug("306 err");
        //                 } else {
        //                     mLogger.debug("totalBudgetByPlanId");
        //                     var total_budget = totalBudgetByPlanId(plan_info);
        //                     mLogger.debug("info:" + JSON.stringify(info));
        //                     mLogger.debug('Plan id = ' + param.plan_id + ' budget = ' + total_budget);
        //                     mLogger.debug('Wanted budget = ' + info.total_budget + "+" + total_budget);
        //                     if (info.total_budget + total_budget > info.balance) {
        //                         var msg = "Total budget is more than balance";
        //                         mLogger.error(msg);
        //                         next({
        //                             code: ERRCODE.BUDGET_OVERFLOW,
        //                             msg: msg
        //                         });
        //                     } else {
        //                         next(null);
        //                     }

        //                 }
        //             });
        //         }
        //     });
        // },

        
        // change the plan status
        function (next) {
            var status = ADCONSTANTS.ADSTATUS.PAUSE.code;
            if ((param.action == ADCONSTANTS.ADSTATUS.START.code) || (param.action == ADCONSTANTS.ADSTATUS.REMOVE.code)) {
                status = param.action;
                mLogger.debug("status:" + status);
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
    ], function (err) {
        if (err) {
            mLogger.error("Failed " + logmsg);
            fn(err);
        } else {
            mLogger.debug("Success " + logmsg);
            var resData = packageResponseData(param);
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