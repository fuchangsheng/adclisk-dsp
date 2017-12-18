/*
 * @file  ads_report_utils.js
 * @description ad report utils API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.09
 * @version 3.0.1 
 */

'use strict';
var MODULENAME = "ads_report_utils.logic";

var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require("async");
var mIs = require("is_js");
var mMoment = require("moment");

var LogicApi = require('../../logic_api');

var mReportModel = require("../../../model/report").create();
var mReportLimitModel = require("../../../model/report_limit").create();
var mADPlanModel = require("../../../model/adlib_plans").create();
var mADUnitModel = require("../../../model/adlib_units").create();
var mADIdeaModel = require("../../../model/adlib_ideas").create();

var mLogger = require("../../../../utils/logger")(MODULENAME);
var mDataHelper = require("../../../../utils/data_helper");
var mUtils = require("../../../../utils/utils");

var ERRCODE = require("../../../../common/errCode");
var ADCONSTANTS = require("../../../../common/adConstants");

function compileReportTargets(data) {
    var targets = data.targets;
    var ids = [];
    for (var i in targets) {
        var target = targets[i];
        ids.push(targets.id);
    }
    return ids.join(',');
}

function removeReportLimitData(param, fn) {
    mLogger.debug("calling removeReportLimitData!");

    var match = {
        report_id: param.report_id,
        user_id: param.user_id,
    };
    var query = {
        match: match,
    };

    mReportLimitModel.remove(query, fn);
}

function removeReportData(param, fn) {
    mLogger.debug("calling removeReportData!");

    var match = {
        id: param.report_id,
        user_id: param.user_id,
    };
    var query = {
        match: match,
    }

    mReportModel.remove(query, fn);
}

function createReportLimitData(param, fn) {
    mLogger.debug("calling createReportLimitData!");

    var values = [];
    for (var i in param.targets) {
        var target = pararm.target[i];
        var value = {
            report_id: param.report_id,
            user_id: param.user_id,
            limit: ADCONSTANTS.REPORTELEMENT.parse(target.limit),
            op: ADCONSTANTS.REPORTOP.parse(target.op),
        };
        if (mUtils.isExist(param.value1)) {
            value.value1 = param.value1;
        }
        if (mUtils.isExist(param.value2)) {
            value.value2 = param.value2;
        }
    }

    var query = {
        fields: values[0],
        values: values,
    }

    mReportLimitModel.query(query, function(err, res) {
        if (err) {
            fn(err);
        } else {
            param.report_id = res.insertId;
            fn(null);
        }
    });
}

function doRemoveReportTransactionCallbak(param, fn) {
    mLogger.debug("calling doReportRemoveTransactionCallbak!");

    mAsync.series([
        function(next) {
            removeReportData(param, next);
        },
        function(next) {
            removeReportLimitData(param, next);
        },
    ], fn);
}

function doEditReportLimitTransactionCallback(param, fn) {
    mLogger.debug("calling doEditReportLimitTransactionCallback!");

    mAsync.series([
        function(next) {
            removeReportLimitData(param, next);
        },
        function(next) {
            createReportLimitData(param, next);
        },
    ], fn);
}

module.exports.compileReportTargets = compileReportTargets;
module.exports.doRemoveReportTransactionCallbak = doRemoveReportTransactionCallbak;
module.exports.doEditReportLimitTransactionCallback = doEditReportLimitTransactionCallback;