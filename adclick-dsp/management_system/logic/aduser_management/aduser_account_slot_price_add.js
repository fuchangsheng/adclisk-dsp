/*
 * @file  ad_account_slot_price_list.js
 * @description ad slot price information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Jiang.tu
 * @date 2017.08.26
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_slot_price_add.logic';
var URLPATH = '/v1/aduser/slot/price/add';

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
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    adx_name: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        }
    },
    slot_id: {
        data: 1,
        rangeCheck: function(data) {
            return mIs.positive(data);
        }
    },
    bottom_price: {
        data: 1,
        rangeCheck: function(data) {
            return mIs.positive(data);
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
    
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to add the slot price for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1. check if there is same slot price in db
        function(next) {
            var match = {
                user_id: user_id,
                adx_id: ADCONSTANTS.ADXLIST.parse(param.adx_name),
                slot_id: param.slot_id
            };
            var query = {
                match: match,
            };
            mAdSlotPriceModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if(total > 0){
                        next({code: ERRCODE.PARAM_INVALID,msg: 'duplicated slot id',});
                    }else{
                        next(null);
                    } 
                }
            });
        },
        //2. get the invoice data list
        function(next){
            var value = {
                user_id: user_id,
                adx_id: ADCONSTANTS.ADXLIST.parse(param.adx_name),
                slot_id: param.slot_id,
                bottom_price: mUtils.yuanToFen(param.bottom_price),
                status: 1,
                create_time: new Date(),
                update_time: new Date()
            };

            var query = {
                fields: value,
                values: [value]
            };
            mAdSlotPriceModel.create(query, function(err) {
                if(err) {
                    mLogger.error('Failed' + logmsg);
                    next(err);
                } else {
                    mLogger.debug('Success' + logmsg);
                    next(null);
                }
            });
        }
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

