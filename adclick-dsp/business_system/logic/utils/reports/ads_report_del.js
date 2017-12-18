/*
 * @file  ads_report_del.js
 * @description del ad report API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.11
 * @version 3.0.1 
 */

'use strict';
var MODULENAME = "ads_report_del.logic";
var URLPATH = '/v3/ads/utils/report/del';

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
    var logmsg = " to del report for user:" + user_id;
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
            param.transactionFun = mUtils.doRemoveReportTransactionCallbak;
            mReportModel.doTransaction(param, function(err) {
                if (err) {
                    mLogger.error("Failed" + logmsg);
                    fn(err);
                } else {
                    mLogger.debug("Succeed" + logmsg);
                    var resData = packageResponseData(param);
                    fn(null, resData);
                }
            });
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