/*
 * @file  ads_unit_list.js
 * @description get the ad user's ad unit list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.09
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_unit_list.logic';
var URLPATH = '/v1/aduser/ads/unit/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mADPlanModel = require('../../model/adlib_plans').create()
var mADUnitModel = require('../../model/adlib_units').create();

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
    plan_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidPlanId(data);
        },
        optional: true,
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
    
    var units = data.units;
    var resData = {
        total: data.total,
        size: units.length,
        list: [],
    };

    for (var i = 0; i < units.length; i++) {
        var unit = {
            plan_name: units[i].plan_name,
            plan_id: units[i].plan_id,
            unit_id: units[i].unit_id,
            unit_name: units[i].unit_name,
            bid: mUtils.fenToYuan(units[i].bid),
            bid_type: ADCONSTANTS.ADBIDTYPE.format(units[i].bid_type),
            unit_status: ADCONSTANTS.ADSTATUS.format(units[i].unit_status),
            update_time: mMoment(units[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT),
        };
        resData.list.push(unit);
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
    var logmsg = ' to get ad plan unit list for user:' + user_id ;
    mLogger.debug('Try '+logmsg);
    
    var match = {
        user_id: user_id,
    };
    if (param.plan_id) {
        match.plan_id = param.plan_id;
    }

    preprocess(param);

    mAsync.waterfall([
        //1. check total number of ad plans in the system
        function(next) {

            var query = {
                match: match,
            };
            mADUnitModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the plan units
        function(total, next) {
            if (total==0) {
                return next(null, {total: 0, units: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more data in the system for user:'+user_id);
                return next(null, {total: total, units: []});
            }

            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mADUnitModel.tableName;
            sqlstr +=' where ';
            sqlstr += mUtils.compileMatchStr(match);

            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += '  ORDER BY create_time ASC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_DESC.code) {
                    sqlstr += ' ORDER BY create_time DESC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.UPDATETIME_DESC.code) {
                    sqlstr += ' ORDER BY update_time DESC ';
                }
            }

            sqlstr +=' limit '+count+' offset '+offset;
            sqlstr +=';';

            //2.2 query the database            
            var query = {
                sqlstr: sqlstr,
            };

            mADUnitModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {     
                    next(null, {total: total, units: rows});
                }
            });
        },
        //3. get the plan info
        function(total, next){
            if(total.total == 0){
                return next(null, total);
            }

            var plan_id_array = [];
            var units = total.units;

            for(var x in units){
                plan_id_array.push(units[x].plan_id);
                units[x].plan_name = '';
            }

            //3.1 create the sql statment
            var sqlstr = 'select plan_name, plan_id '
            sqlstr += ' from ' + mADPlanModel.tableName;
            sqlstr +=' where plan_id';
            sqlstr += ' in ( ' + plan_id_array.join(',') + ' );';

            //3.2 query the database
            var query = {
                sqlstr: sqlstr,
            };

            mADPlanModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    for(var x in rows){
                        for(var y in units){
                            if(rows[x].plan_id === units[y].plan_id){
                                units[y].plan_name = rows[x].plan_name;
                            }
                        }
                    }

                    next(null, {total: total.total, units: units});
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

