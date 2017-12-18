/*
 * @file  dashboard_overview.js
 * @description dashboard for ad user overview API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.11
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard_overview_all.logic';
var URLPATH = '/v1/dashboard/overview/all';

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
var mDashboardAduserModel = require('../../model/adlib_palo_dashboard').create();

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
    index:{
        data: 1,
        rangeCheck: function(data) {
            return data >= 0;
        },
        optional: true,
    },
    count: {
        data:1,
        rangeCheck: function(data) {
            return data>0 && data < ADCONSTANTS.PAGEMAXCOUNT * 5;
        },
        optional: true,
    },
    sort: {
        data: '',
        rangeCheck: function(data) {
            return ADCONSTANTS.ORDER.find(data);
        },
        optional: true,
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
    
    var datas = data.rows;
    var resData = {
        total: data.total,
        size: datas.length,
        list: [],
    };

    resData.list = mUtils.formatDashBoardData(data);

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
    switch(param.order) {
    case ADCONSTANTS.ORDER.ASC.name:
        param.order = 'asc';
        break;
    case ADCONSTANTS.ORDER.DESC.name:
        param.order = 'desc';
        break;
    default:
        break;
    }
}

function getCommmonSql(param) {
    var sqlstr =' from '+ mDashboardAduserModel.tableName; 
    sqlstr +=' where ( date between "'+param.start_time+'" and "'+param.end_time+'") ';
    sqlstr +=' group by date ORDER BY date ';
    if(param.order) {
        sqlstr += param.order;
    } else {
        sqlstr += ' asc';
    }
    mLogger.debug("commonsqlstr:"+sqlstr);
    return sqlstr;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    var logmsg = ' to get the dashboard data';
    mLogger.debug('Try '+logmsg);

    preprocess(param);
    var commonSql = getCommmonSql(param);

    mAsync.waterfall([        
        function(next) {
            var data = {};
            var index = param.index || 0;
            var count = param.count || 20;
            var offset = index * count;
            var sqlstr = 'select date, sum(request) as request, ';
            sqlstr += ' sum(bid) as bid, sum(imp) as imp, ';
            sqlstr += ' sum(click) as click, sum(cost) as cost ';
            sqlstr += commonSql;
            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += ' ORDER BY create_time ASC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_DESC.code) {
                    sqlstr += ' ORDER BY create_time DESC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.UPDATETIME_DESC.code) {
                    sqlstr += ' ORDER BY update_time DESC ';
                }
            }
            var query = {
                sqlstr: sqlstr,
            };
            mLogger.debug("sqlstr:"+sqlstr);
            mDashboardAduserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if(param.unit === ADCONSTANTS.DATAUNIT.UNIT_DAY.code) {
                        data.rows = mUtils.getDashboardUnitDayDate(rows);
                    }else {
                        data.rows = rows;
                    }                    
                    data.total = data.rows.length;

                    if (offset >= data.total) {
                        data.rows = [];
                    }else {
                        data.rows = data.rows.slice(offset, count+offset);
                    }

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

