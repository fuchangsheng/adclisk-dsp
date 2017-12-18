/*
 * @file  ad_account_slot_price_list.js
 * @description ad slot price information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Jiang.tu
 * @date 2017.08.26
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_slot_price_list.logic';
var URLPATH = '/v1/aduser/slot/price/list';

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
    
    var slot_prices = data.slot_price;

    var resData = {
        total: data.total,
        size: slot_prices.length,
        list: [],
    };

    for (var i = 0; i < slot_prices.length; i++) {
        var slot_price = {
            id: slot_prices[i].id,
            adx_name: ADCONSTANTS.ADXLIST.format(slot_prices[i].adx_id),
            slot_id: slot_prices[i].slot_id,
            bottom_price: mUtils.fenToYuan(slot_prices[i].bottom_price),
            status: ADCONSTANTS.ADSTATUS.format(slot_prices[i].status),
            create_time: mMoment(slot_prices[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
            update_time: mMoment(slot_prices[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT),
        };
        resData.list.push(slot_price);
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
    var logmsg = ' to get the slot price list from user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1. check total number of invoice for the user
        function(next) {
            var match = {
                user_id: user_id,
            };
            var query = {
                match: match,
            };
            mAdSlotPriceModel.count(query, function(err, total) {
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
                return next(null, {total: 0, slot_price: []});
            }
            var index = param.index || 0;
            var count = param.count || 10;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more data in the system for user:'+user_id);
                return next(null, {total: total, slot_price: []});
            }
            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mAdSlotPriceModel.tableName;
            sqlstr +=' where user_id = '+user_id;
            sqlstr +=' limit '+count+' offset '+offset;
            sqlstr +=';';

            //2.2 query the database            
            var query = {
                sqlstr: sqlstr,
            };

            mAdSlotPriceModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {     
                    next(null, {total: total, slot_price: rows});
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

