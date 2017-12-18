/*
 * @file  ads_report_limit_edit.js
 * @description edit ad limit report API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.09
 * @version 3.0.1 
 */

'use strict';
var MODULENAME = "ads_report_limit_edit.logic";
var URLPATH = '/v3/ads/utils/report/limit/edit';

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
    limit: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.REPORTLIMIT.find(data);
            return type? true:false; 
        },
    },
    op: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.REPORTOP.find(data);
            return type? true:false;
        },
    },
    value1 : {
        data: '',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    value2 : {
        data: '',
        rangeCheck: mUtils.notEmpty,
        optional: true,
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
    var logmsg = " to edit report limit for user:" + user_id;
    mLogger.debug("Try " + logmsg);

    preProcess(param);

    param.transactionFun = mUtils.doEditReportLimitTransactionCallback;
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