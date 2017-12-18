/*
 * @file  ads_plan_list.js
 * @description get the ad user's ad plan list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_plan_list.logic';
var URLPATH = '/v1/aduser/ads/plan/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mADPlanModel = require('../../model/adlib_plans').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
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
    
    var plans = data.plans;

    var resData = {
        total: data.total,
        size: plans.length,
        list: [],
    };

    for (var i = 0; i < plans.length; i++) {
        var plan = {
            plan_id: plans[i].plan_id,
            plan_name: plans[i].plan_name,
            start_time: mMoment(plans[i].start_time).format(ADCONSTANTS.HOURLYTIME),
            end_time: mMoment(plans[i].end_time).format(ADCONSTANTS.HOURLYTIME),
            budget: mUtils.fenToYuan(plans[i].budget),
            plan_cycle: plans[i].plan_cycle,
            plan_status: ADCONSTANTS.ADSTATUS.format(plans[i].plan_status),
            update_time: mMoment(plans[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT),
        };
        resData.list.push(plan);
    }
    
    return resData;
}

function preprocess(param) {
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to get ad plan list from user:' + user_id;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        //1. check total number of ad plans in the system
        function(next) {
            var match = {
                user_id: user_id,
            };
            var query = {
                match: match,
            };
            mADPlanModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the invoice data list
        function(total, next) {
            if (total==0) {
                return next(null, {total: 0, plans: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more data in the system for user:'+user_id);
                return next(null, {total: total, plans: []});
            }

            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mADPlanModel.tableName;
            sqlstr +=' where user_id=' + user_id;

            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += ' ORDER BY create_time ASC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_DESC.code) {
                    sqlstr += ' ORDER BY create_time DESC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.UPDATETIME_DESC.code) {
                    sqlstr += ' ORDER BY update_time DESC ';
                }
            }

            sqlstr +=' limit ' + count + ' offset ' + offset;
            sqlstr +=';';

            //2.2 query the database            
            var query = {
                sqlstr: sqlstr,
            };

            mADPlanModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {     
                    next(null, {total: total, plans: rows});
                }
            });
        },
    ], function(err, datas) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(datas);
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

