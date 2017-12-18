/*
 * @file  faccount_invoice_del.js
 * @description ad invoice information remove API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 20167.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_invoice_del.logic';
var URLPATH = '/v3/settings/finance/invoice-info/del';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mDspAduserModel = require('../../../model/dsp_aduser').create();
var mAdInvoiceModel = require('../../../model/aduser_invoice_account').create();

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
        rangeCheck: function (data) {
            return mUtils.isValidUserId(data);
        }
    },
    id: {
        data: 'name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
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
        user_id: data.user_id,
        id: data.id,
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
    var id = param.id;
    var logmsg = ' to remove the invoice '+id+' for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    mAsync.series([
        //1. check whether the invoice exist in the system
        function(next) {
            var match = {
                user_id: user_id,
                id: id,
            };
            var query = {
                match: match,
            };
            mAdInvoiceModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total==0) {
                        var msg = 'There is no such invoice info!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }

                    next(null);
                }
            });
        },
        //2. remove one invoice data
        function(next) {
            var match = {
                user_id: user_id,
                id: id,
            };
            //2.1 set the status to delete
            var update = {
                status: ADCONSTANTS.DATASTATUS.DELTED.code,
            };

            var query = {
                update: update,
                match: match, 
            };

            mAdInvoiceModel.update(query, function(err, rows) {
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

