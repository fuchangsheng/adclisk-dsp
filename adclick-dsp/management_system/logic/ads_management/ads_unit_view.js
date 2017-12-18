/*
 * @file  ads_unit_view.js
 * @description view the ad user's ad unit API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.09
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_unit_view.logic';
var URLPATH = '/v1/aduser/ads/unit/view';

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
var mADUnitTargetModel = require('../../model/adlib_unit_target').create();

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
    unit_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUnitId(data);
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
    
    var resData = {
        plan_id: data.plan_id,
        unit_id: data.unit_id,
        plan_name: data.plan_name,
        unit_name: data.unit_name,
        bid: mUtils.fenToYuan(data.bid),
        bid_type: ADCONSTANTS.ADBIDTYPE.format(data.bid_type),
        unit_status: ADCONSTANTS.ADSTATUS.format(data.unit_status),
    };

    if(data.imp){
        resData.imp = data.imp;
    }
    if(data.click){
        resData.click = data.click;
    }

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to get ad unit for user:' + user_id;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1. read the informationf from db
        function(next) {
            var match = {
                user_id: user_id,
                unit_id: param.unit_id,
            };
            var select = mADUnitModel.refModel;

            var query = {
                select: select,
                match: match,
            };
            mADUnitModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'The unit is empty!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }
                    var unit = rows[0];
                    unit.plan_nane = '';
                    next(null, unit);
                }
            });
        },
        //2. get the plan info
        function(data, next){
            var match = {
                plan_id: data.plan_id,
            };
            var select = {
                plan_name: '',
            };

            var query = {
                select: select,
                match: match,
            };

            mADPlanModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows && rows.length>0) {
                        data.plan_name = rows[0].plan_name;
                    }
                    next(null, data);
                }
            });
        },
        //3. get unit target value
        function(data, next){
            var select = {
                content : '',
            };
            var match = {
                user_id: user_id,
                unit_id: param.unit_id,
                type: ADCONSTANTS.ADTARGETTYPE.FREQIMPDAILY.code,
                status: ADCONSTANTS.ADTARGETSTATUS.START.code,
            };
            var query = {
                select: select,
                match: match,
            };
            mADUnitTargetModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if(rows.length > 0){
                        data.imp = rows[0].content;
                    }
                    next(null, data);
                }
            });
        },
        //4. get unit target value
        function(data, next){
            var select = {
                content : '',
            };
            var match = {
                user_id: user_id,
                unit_id: param.unit_id,
                type: ADCONSTANTS.ADTARGETTYPE.FREQCLICKDAILY.code,
                status: ADCONSTANTS.ADTARGETSTATUS.START.code,
            };
            var query = {
                select: select,
                match: match,
            };
            mADUnitTargetModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if(rows.length > 0){
                        data.click = rows[0].content;
                    }
                    next(null, data);
                }
            });
        },
    ], function(err, data) {
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

