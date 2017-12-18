/*
 * @file  coast_overview_adx.js
 * @description adx coast overview API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.22
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'coast_overview_adx.logic';
var URLPATH = '/v1/cost/overview';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mCoastModel = require('../../model/adlib_palo_charge').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');



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
    }
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
    var resData = {
        imp: data.imp || 0,
        click: data.click || 0,
        cost: mUtils.fenToYuan(data.cost/1000) || 0,
        revenue: mUtils.fenToYuan(data.revenue/1000) || 0
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
}

function getCommmonSql(param) {
    var sqlstr =' from '+ mCoastModel.tableName;
    sqlstr +=' where adx = '+ param.adx_id;
    sqlstr +=' and ( date between "' + param.start_time + '" and "' + param.end_time + '") ';
    sqlstr +=';';
    return sqlstr;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var adx_id = param.adx_id;
    var logmsg = ' to get the cost data for adx:' + adx_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);
    var commonSql = getCommmonSql(param);

    mAsync.waterfall([
        //1. find the total data
        function(next) {
            var sqlstr = 'select sum(imp) as imp, ';
            sqlstr += 'sum(click) as click, sum(cost) as cost, ';
            sqlstr += 'sum(revenue) as revenue';
            sqlstr += commonSql;
            var query = {
                sqlstr: sqlstr,
            };
            mCoastModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, rows[0]);
                }
            });
        },
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

