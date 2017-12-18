/*
 * @file  dashboard_realtime_download.js
 * @description dashboard for ad user download API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.11
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard_realtime_adx_download.logic';
var URLPATH = '/v1/dashboard/realtime/adx/download';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mDspAduserModel = require('../../model/dsp_aduser').create();
var mDashboardAduserModel = require('../../model/adclick_dsp_realtime').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mAcceptUnits = [
    ADCONSTANTS.DATAUNIT.UNIT_MINUTE.code,
    ADCONSTANTS.DATAUNIT.UNIT_HOUR.code,
    ADCONSTANTS.DATAUNIT.UNIT_DAY.code,
];

var mAcceptTypes = [
    ADCONSTANTS.DASHBOARDDATA.REQUEST.code,
    ADCONSTANTS.DASHBOARDDATA.BID.code,
    ADCONSTANTS.DASHBOARDDATA.IMP.code,
    ADCONSTANTS.DASHBOARDDATA.CLICK.code,
    ADCONSTANTS.DASHBOARDDATA.CTR.code,
    ADCONSTANTS.DASHBOARDDATA.CPC.code,
    ADCONSTANTS.DASHBOARDDATA.CPM.code,
    ADCONSTANTS.DASHBOARDDATA.COST.code,
];

var mRefModel = {
    adx_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidAdxId(data);
        },
    },
    start_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    end_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    unit: {
        data: '',
        rangeCheck: function(data) {
            return mUtils.verifyDataUnit(data, mAcceptUnits);
        },
    },
    data_type: {
        data: '',
        rangeCheck: function(data) {
            return mUtils.checkDashBoardDataType(data, mAcceptTypes);
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
    
    var filename = ADCONSTANTS.MANAGE+data.adx_id+'-'+mDataHelper.createId(MODULENAME)+'.csv';
    data.filename = filename;
    mUtils.writeDashBoardDataToFile(data);
    var url = ADCONSTANTS.SERVER.FILESERVER_2+filename;
    var resData = {
        filename: url
    };

    return resData;
}

function preprocess(param) {
    if (param.start_time) {
        param.start_time = mMoment(param.start_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.end_time) {
        param.end_time = mMoment(param.end_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.unit) {
        param.unit = ADCONSTANTS.DATAUNIT.parse(param.unit);
    }
}

function getCommmonSql(param) {
    var sqlstr =' from '+ mDashboardAduserModel.tableName;
    sqlstr += ' where ( date between "'+param.start_time+'" and "'+param.end_time+'")';
    sqlstr += ' and adx=' + param.adx_id;
    return sqlstr;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var adx_id = param.adx_id;
    var user_name = param.user_name || '';
    var logmsg = ' to get the dashboard data for user:' + user_name ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);
    var commonSql = getCommmonSql(param);

    mAsync.waterfall([
        //1. find the total data
        function(next) {
            var data = {};
            var dateFormatStr = "DATE_FORMAT(date,'%Y-%m-%d') as date";
            var matchdDateFormatStr = "DATE_FORMAT(date,'%Y-%m-%d')";
            if(param.unit == ADCONSTANTS.DATAUNIT.UNIT_HOUR.code) {
                dateFormatStr = "DATE_FORMAT(date,'%Y-%m-%d %H:00:00') as date";
                matchdDateFormatStr = "DATE_FORMAT(date,'%Y-%m-%d %H')";
            }
            var sqlstr = 'select '+dateFormatStr+', sum(request) as request, ';
            sqlstr += ' sum(bid) as bid, sum(imp) as imp, ';
            sqlstr += ' sum(click) as click, sum(cost) as cost ';
            sqlstr += commonSql;
            sqlstr += ' GROUP BY ' + matchdDateFormatStr;
            sqlstr += ' ORDER BY '+matchdDateFormatStr+' ASC;';
            var query = {
                sqlstr: sqlstr,
            };
            mDashboardAduserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    data.rows = rows;
                    next(null, data);
                }
            });
        },
    ],function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            data.data_type = param.data_type;
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

