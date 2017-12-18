/*
 * @file  ads_plan_op.js
 * @description op the ad user's ad plan API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Jiang.tu
 * @date 2017.08.26
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_slot_price_op.logic';
var URLPATH = '/v1/aduser/slot/price/op';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdSlotPriceModel = require('../../model/slot_price').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    id: {
        data: 1,
        rangeCheck: function(data) {
            return mIs.positive(data);
        },
    },
    action: {
        data : '',
        rangeCheck: function(data) {
            var action = ADCONSTANTS.ADACTION.find(data);
            return action ? true: false;
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
    
    var resData = {
        id: data.id
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var id = param.id;
    var logmsg = ' to switch slot price status for id:' + id;
    mLogger.debug('Try '+logmsg);
    
    if(param.action) {
        param.action = ADCONSTANTS.ADACTION.parse(param.action);
    }

    mAsync.series([
        //1. check whether this ad plans in the system
        function(next) {
            var match = {
                id: id,
            };
            var query = {
                match: match,
            };
            mAdSlotPriceModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total<=0) {
                        var msg = 'There is no this slot price!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }
                    next(null, total);
                }
            });
        },
        //3. change the slot price status
        function(next) {
            var status = ADCONSTANTS.ADSTATUS.PAUSE.code;
            if(param.action == ADCONSTANTS.ADACTION.START.code) {
                status = ADCONSTANTS.ADSTATUS.START.code;
            }
            var update = {
                status: status,
            };
            var match = {
                id: id,
            };
            var query = {
                match: match,
                update: update,
            };
            mAdSlotPriceModel.update(query, next);
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

