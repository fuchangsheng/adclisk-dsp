/*
 * @file  faccount_cost_list.js
 * @description cost overview API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.29
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'faccount_cost_list.logic';
var URLPATH = '/v3/settings/finance/cost/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mCostModel = require('../../../model/adlib_palo_charge').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
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
    index: {
        data: 1,
        rangeCheck: function(data) {
            return data >=0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0 && data <=ADCONSTANTS.PAGEMAXCOUNT;
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
                ])
        },
        optional: true,
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

    var items = data.rows;
    var resData = {
        total: data.total,
        size: items.length,
        list: [],
    };

    for (var i in items) {
        var item = items[i];
        item.cost = item.cost? mUtils.fenToYuan(item.cost/1000) : 0;
        item.date = mMoment(item.date).format(ADCONSTANTS.DATATIMEFORMAT);
        resData.list.push(item);
    }

    return resData;
}

function preprocess(param) {
    if (param.start_time) {
        param.start_time = mMoment(param.start_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.end_time) {
        param.end_time = mMoment(param.end_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.format(param.sort);
    }
}

function getCommmonSql(param) {
    var sqlstr = "select DATE_FORMAT(date,'%Y-%m-%d') as date, sum(imp) as imp,";
    sqlstr += ' sum(click) as click, sum(cost) as cost';
    sqlstr += ' from '+ mCostModel.tableName;
    sqlstr +=' where user_id = '+ param.user_id;
    sqlstr +=' and ( date between "' + param.start_time + '" and "' + param.end_time + '") ';
    sqlstr += " group by date";
    sqlstr += " order by date";
    if (mUtils.isExist(param.sort)) {
        sqlstr += (param.sort == ADCONSTANTS.DATASORT.CREATETIME_ASC) ? ' asc' : ' desc';
    }

    return sqlstr;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to get the cost data for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);
    var commonSql = getCommmonSql(param);

    mAsync.waterfall([
        //1. find the total data
        function(next) {
            var sqlstr = 'select count(*) as total';
            sqlstr += ' from (' + getCommmonSql(param) + ')';
            sqlstr += '  as t;';
            var query = {
                sqlstr: sqlstr,
            };
            mCostModel.query(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    var data = {};
                    data.total = total;
                    next(null, data);
                }
            });
        },
        function(data, next) {
            var index = param.index || 0;
            var count = param.count || 20;
            var offset = index * count;
            console.error(data);
            if (offset >= data.total) {
                data.rows = [];
                console.error(offset);
                console.error(data.total);
                return next(null, data);
            }

            var sqlstr = getCommmonSql(param);
            sqlstr +=' limit '+count+' offset '+offset;
            sqlstr +=';';

            var query = {
                sqlstr: sqlstr,
            };
            mCostModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    data.rows = rows;
                    next(null, data);
                }
            });
        }
    ],function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
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

