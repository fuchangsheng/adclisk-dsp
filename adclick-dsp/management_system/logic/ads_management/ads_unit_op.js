/*
 * @file  ads_unit_op.js
 * @description edit the ad user's ad unit API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.09
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_unit_op.logic';
var URLPATH = '/v1/aduser/ads/unit/op';

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
    unit_id : {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidUnitId(data);
        },
    },
    action: {
        data: '',
        rangeCheck: function (data) {
            var action = ADCONSTANTS.ADACTION.find(data);
            return action ? true: false;
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
        unit_id: data.unit_id,
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to edit ad plan unit for user:' + user_id;
    mLogger.debug('Try '+logmsg);

    param.action = ADCONSTANTS.ADACTION.parse(param.action);

    mAsync.series([
        //1. chech whether this unit in the system
        function(next) {
            var match = {
                user_id: user_id,
                unit_id: param.unit_id,
            };
            var query = {
                match: match,
            };
            mADUnitModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total<=0) {
                        var msg = 'There is no this unit!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }

                    next(null);
                }
            });
        },
        //2. change the plan unit status
        function(next) {
            var status = ADCONSTANTS.ADSTATUS.PAUSE.code;
            if(param.action == ADCONSTANTS.ADACTION.START.code) {
                status = ADCONSTANTS.ADSTATUS.START.code;
            }
            var update = {
                unit_status: status,
            };
            var match = {
                user_id: user_id,
                unit_id: param.unit_id,
            };
            var query = {
                update: update,
                match: match,
            };
            mADUnitModel.update(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null);
                }
            });
        },
    ], function(err) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(param);
            fn(null, resData);
        }
    });
}

/*
* export the post interface
*/
mRouter.post(URLPATH, function(req, res, next){
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

