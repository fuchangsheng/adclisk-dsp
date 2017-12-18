/*
 * @file  summary_download.js
 * @ obtain summary for ad user download API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.12.01
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'summary_download.logic';
var URLPATH = '/v3/ads/summary/download';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mADSummaryModel = require("../../../model/adlib_summary_daily").create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mAcceptUnits = [
    //ADCONSTANTS.DATAUNIT.UNIT_MINUTE.code,
    ADCONSTANTS.DATAUNIT.UNIT_HOUR.code,
    ADCONSTANTS.DATAUNIT.UNIT_DAY.code,
    ADCONSTANTS.DATAUNIT.UNIT_MONTH.code,
];

var mAcceptTypes = [
    ADCONSTANTS.SUMMARYDATA.ALL.code,
    ADCONSTANTS.SUMMARYDATA.REQUEST.code,
    ADCONSTANTS.SUMMARYDATA.BID.code,
    ADCONSTANTS.SUMMARYDATA.IMP.code,
    ADCONSTANTS.SUMMARYDATA.CLICK.code,
    ADCONSTANTS.SUMMARYDATA.CTR.code,
    ADCONSTANTS.SUMMARYDATA.CPC.code,
    ADCONSTANTS.SUMMARYDATA.CPM.code,
    ADCONSTANTS.SUMMARYDATA.COST.code,
    ADCONSTANTS.SUMMARYDATA.ACTIVE.code,
    ADCONSTANTS.SUMMARYDATA.CPA.code,
];

var mRefModel = {
    begin_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function (data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    end_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function (data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    unit: {
        data: '',
        rangeCheck: function (data) {
            return mUtils.verifyDataUnit(data, mAcceptUnits);
        },
    },
    data_type: {
        data: '',
        rangeCheck: function (data) {
            return mUtils.checkSummaryDataType(data, mAcceptTypes);
        },
    },
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function validate(data) {
    if (!data) {
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function packageResponseData(data, begin_time, end_time,time_type) {
    if (!data) {
        return {};
    }

    //var filename = ADCONSTANTS.MANAGE + mDataHelper.createId(MODULENAME) + '.csv';
    var filename = begin_time + "-" + end_time + '.csv';
    data.filename = filename;
    mLogger.debug('summary_download_all_filename:' + filename);
    mUtils.writeSummaryDataToFile(data,time_type);
    var url = ADCONSTANTS.SERVER.FILESERVER_2 + filename;
    var resData = {
        filename: url
    };
    return resData;
}

function preprocess(param) {
    if (param.begin_time) {
        param.begin_time = mMoment(param.begin_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.end_time) {
        param.end_time = mMoment(param.end_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.unit) {
        param.unit = ADCONSTANTS.DATAUNIT.parse(param.unit);
    }
}

function getCommmonSql(param) {
    var sqlstr = ' from ' + mADSummaryModel.tableName;
    sqlstr += ' where ( date between "' + param.begin_time + '" and "' + param.end_time + '") ';
    sqlstr += ' group by date ORDER BY date ASC;';
    return sqlstr;
}

function processRequest(param, fn) {
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({
            code: ERRCODE.PARAM_INVALID,
            msg: msg
        });
    }

    var logmsg = ' to get the summary data:';
    mLogger.debug('Try ' + logmsg);

    preprocess(param);
    var commonSql = getCommmonSql(param);
    var begin_time = '';
    var end_time = '';
    if(param.unit == ADCONSTANTS.DATAUNIT.UNIT_DAY.code){
        begin_time = mMoment(param.begin_time).format(ADCONSTANTS.DATAFORMAT);
        end_time = mMoment(param.end_time).format(ADCONSTANTS.DATAFORMAT);
    }else if(param.unit == ADCONSTANTS.DATAUNIT.UNIT_MONTH.code){
        begin_time = mMoment(param.begin_time).format(ADCONSTANTS.MONTHLYFORMAT);
        end_time = mMoment(param.end_time).format(ADCONSTANTS.MONTHLYFORMAT);
    }else if(param.unit == ADCONSTANTS.DATAUNIT.UNIT_HOUR.code){
        begin_time = mMoment(param.begin_time).format("YYYY-MM-DD-HH");
        end_time = mMoment(param.end_time).format("YYYY-MM-DD-HH");
    }
  
    mAsync.waterfall([
        //1. find the total data
        function (next) {
            var data = {};
            var sqlstr = 'select date, sum(request) as request, ';
            sqlstr += ' sum(bid) as bid, sum(imp) as imp, ';
            sqlstr += ' sum(click) as click, sum(cost) as cost, ';
            sqlstr += ' sum(download) as active ';
            sqlstr += commonSql;
            var query = {
                sqlstr: sqlstr,
            };
            mADSummaryModel.query(query, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (param.unit === ADCONSTANTS.DATAUNIT.UNIT_DAY.code) {
                        data.rows = mUtils.getSummaryUnitDaily(rows);
                    } else if (param.unit === ADCONSTANTS.DATAUNIT.UNIT_HOUR.code) {
                        data.rows = mUtils.getSummaryUnitHourly(rows);
                    } else if (param.unit == ADCONSTANTS.DATAUNIT.UNIT_MONTH.code) {
                        data.rows = mUtils.getSummaryUnitMonthly(rows);
                    } else {
                        data.rows = rows;
                    }
                    next(null, data, begin_time, end_time);
                }
            });
        },
    ], function (err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        } else {
            mLogger.debug('Success' + logmsg);
            data.data_type = param.data_type;
            var resData = packageResponseData(data,begin_time, end_time,param.unit);
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