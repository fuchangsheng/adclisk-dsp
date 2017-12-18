/*
 * @file  ads_report_list.js
 * @description del ad report API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.11
 * @version 3.0.1 
 */

'use strict';
var MODULENAME = "ads_report_list.logic";
var URLPATH = '/v3/ads/utils/report/list';

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
    index: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0 && data<=ADCONSTANTS.PAGEMAXCOUNT;
        },
        optional: true,
    },
    sort: {
        data: '',
        rangeCheck: function(data) {
            var sort = ADCONSTANTS.DATASORT.find(data);
            if (!sort) {
                return false;
            }

            return mIs.inArray(sort.code, [
                ADCONSTANTS.DATASORT.CREATETIME_ASC.code,
                ADCONSTANTS.DATASORT.CREATETIME_DESC.code,
                ADCONSTANTS.DATASORT.UPDATETIME_DESC.code,
                ])
        },
        optional: true,
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
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
}

function packageResponseData(data) {
    if (!data) {
        return {};
    }

    var list = data.list;
    var resData = {
        total: data.total,
        size: list.length,
        list: [],
    };

    for (var i = 0; i < list.length; i++) {
        var report = {
            report_id: list[i].id,
            name: list[i].name,
            type: ADCONSTANTS.REPORTTARGETTYPE.format(list[i].type),
            targets: list[i].targets,
            elems: list[i].elems,
            detail_type: ADCONSTANTS.REPORTDETAILTYPE.format(list[i].detail_type),
            delivery_status: ADCONSTANTS.DELIVERYSTATUS.format(list[i].delivery_status),
            start_time: mMoment(list[i].start_time).format(ADCONSTANTS.DATATIMEFORMAT),
            end_time: mMoment(list[i].end_time).format(ADCONSTANTS.DATATIMEFORMAT),
            create_time: mMoment(list[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
            update_time: mMoment(list[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT),
            limits: [],
        };
        for (var j in list[i].limits) {
            var limit = list[i].limits[j];
            var limit_data = {
                limit: ADCONSTANTS.REPORTLIMIT.parse(limit.limit),
                op: ADCONSTANTS.REPORTOP.parse(limit.op),
                value1: limit.value1,
                value2: limit.value2,
            };
            report.limits.push(limit_data);
        }
        resData.list.push(report);
    }

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
    var logmsg = " to get report list for user:" + user_id;
    mLogger.debug("Try " + logmsg);

    preProcess(param);

    mAsync.waterfall([
        //1.check
        function(next) {
            var match = {
                user_id: user_id,
            };
            var query = {
                match: match,
            }
            mReportModel.count(query, next);
        },
        //2.lookup report
        function(total, next) {
            if (total==0) {
                return next(null, {total: 0, list: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more data in the system for user:'+user_id);
                return next(null, {total: total, templates: []});
            }

            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mReportModel.tableName;
            sqlstr +=' where user_id=' + user_id;
            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += ' ORDER BY create_time ASC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_DESC.code) {
                    sqlstr += ' ORDER BY create_time DESC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.UPDATETIME_DESC.code) {
                    sqlstr += ' ORDER BY update_time DESC ';
                }
            } else {
                sqlstr += ' ORDER BY update_time DESC';
            }
            sqlstr +=' limit ' + count + ' offset ' + offset;
            sqlstr +=';';

            var query = {
                sqlstr: sqlstr,
            };

            mReportModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {total: total, list: rows});
                }
            });
        },
        //3.lookup limit
        function(info, next) {
            if (info.total == 0) {
                return next(null, info);
            }
            var report_ids = [];
            for (var i in info.list) {
                var report = info.list[i];
                report_ids.push(report.report_id);
            }

            var sqlstr = 'select * ';
            sqlstr += ' from ' + mReportLimitModel.tableName;
            sqlstr += ' where report_id in (';
            sqlstr += report_ids.join(',') + ')';
            sqlstr += ';';
            mReportLimitModel.query({sqlstr: sqlstr}, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    for (var i in info.list) {
                        var report = info.list[i];
                        report.limits = [];
                        for (var j in rows) {
                            var report_limit = rows[j];
                            if (report.id == report_limit.report_id) {
                                report.limits.push(report_limit);
                            }
                        }
                    }
                    next(null, info);
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