/*
 * @file  ads_report_edit.js
 * @description edit ad report API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.09
 * @version 3.0.1 
 */

'use strict';
var MODULENAME = "ads_report_edit.logic";
var URLPATH = '/v3/ads/utils/report/edit';

var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require("async");
var mIs = require("is_js");
var mMoment = require("moment");

var LogicApi = require('../../logic_api');

var mReportModel = require("../../../model/report").create();
var mReportLimitModel = require("../../../model/report_limit").create();

var mLogger = require("../../../../utils/logger")(MODULENAME);
var mDataHelper = require("../../../../utils/data_helper");
var mUtils = require("../../../../utils/utils");
var mReportUtils = require("./ads_report_utils");

var ERRCODE = require("../../../../common/errCode");
var ADCONSTANTS = require("../../../../common/adConstants");

var mTargetModel = {
    id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
        }
    },
};

var mTargetChecker = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mTargetModel
});

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidUserId(data);
        },
    },
    report_id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
        }
    },
    report_name: {
        data: "name",
        rangeCheck: function (data) {
            return !mUtils.isEmpty(data);
        },
    },
    type: {
        data: "",
        rangeCheck: ADCONSTANTS.REPORTTARGETTYPE.find,
    },
    targets: {
        data: [],
        rangeCheck: function(data) {
            if (data.length == 0) {
                return false;
            }
            for (var i in data) {
                if (!mTargetChecker(data[i])) {
                    return false;
                }
            }
            return true;
        },
    },
    elems: {
        data: "",
        rangeCheck: mUtils.isReportElementData,
    },
    detail_type: {
        data: "",
        rangeCheck: ADCONSTANTS.REPORTDETAILTYPE.find,
    },
    delivery_status: {
        data: "",
        rangeCheck: mUtils.isDeliveryStatusData,
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
    },
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    mRefModel: mRefModel
});

function validate(data) {
    if (!data) {
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function preProcess(param) {
    param.type = ADCONSTANTS.REPORTTARGETTYPE.parse(param.type);
    param.detail_type = ADCONSTANTS.REPORTDETAILTYPE.parse(param.detail_type);
    param.delivery_status = ADCONSTANTS.DELIVERYSTATUS.parse(param.delivery_status);
}

function packageResponseData(data) {
    if (!data) {
        return {};
    }

    var resData = {
        report_id: data.report_id,
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
    var logmsg = " to edit report for user:" + user_id;
    mLogger.debug("Try " + logmsg);

    preProcess(param);

    mAsync.waterfall([
        //1.check
        function (next) {
            var match = {
                user_id: user_id,
                id: param.report_id,
            };
            var query = {
                match: match,
                select: mReportModel.refModel,
            };
            mReportModel.lookup(query, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows.length == 0) {
                        var msg = "There is no match data!";
                        mLogger.error(msg);
                        return next({
                            code: ERRCODE.DB_NO_MATCH_DATA,
                            msg: msg
                        });
                    }
                    next(null, rows[0]);
                }
            });
        },
        //2.check name
        function (report, next) {
            if (report.name == param.name) {
                return next(null, report);
            }

            var match = {
                user_id: user_id,
                name: param.name,
            };
            var query = {
                match: match,
            };
            mReportModel.count(query, function (err, total) {
                if (err) {
                    next(err);
                } else {
                    if (total > 0) {
                        var msg = "The report name is duplicated!";
                        mLogger.error(msg);
                        return next({
                            code: ERRCODE.DB_DATADUPLICATED,
                            msg: msg
                        });
                    }
                    next(null, report);
                }
            });
        },
        //2. update report
        function (report, next) {
            var targets = mReportUtils.compileReportTargets(param.targets);
            var update = {
                user_id: user_id,
                name: param.report_name,
                type: param.type,
                targets: targets,
                elems: param.elems,
                detail_type: param.detail_type,
                delivery_status: param.delivery_status,
                start_time: mMoment(param.start_time),
                end_time: mMoment(param.end_time),
            };
            var match = {
                user_id: param.user_id,
                id: param.report_id,
            }

            var isUpdate = mUtils.isNeedToUpdate(report, update);
            if (!isUpdate) {
                return next(null);
            }
            var query = {
                match: match,
                update: update,
            }
            mReportModel.update(query, next);
        },
    ], function (err, data) {
        if (err) {
            mLogger.error("Failed" + logmsg);
            fn(err);
        } else {
            mLogger.debug("Succeed" + logmsg);
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