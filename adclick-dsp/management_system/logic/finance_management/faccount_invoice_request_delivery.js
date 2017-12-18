/*
 * @file  faccount_invoice_request_delivery.js
 * @description virture invoice request process logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_request_delivery.logic';
var URLPATH = '/v1/aduser/faccount/invoice/delivery';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mInvoiceOpLogModel = require('../../model/invoice_op_log').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');
var mDataHelp = require('../../../utils/data_helper');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    ticket_id: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    post_name: {
        data: '',
        rangeCheck: function(data){
            return !mUtils.isEmpty(data);
        },
    },
    post_id: {
        data: '',
        rangeCheck: function(data){
            return !mUtils.isEmpty(data); 
        },
    },
    tax_info_ticket: {
        data: '',
        rangeCheck: function(data){
            return !mUtils.isEmpty(data); 
        },
        optional : true,
    },
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function packageResponseData(data){
    if (!data) {
        return {};
    }

    var resData = {
        status: ADCONSTANTS.INVOICESTATUS.format(data.invoice_status),
    }
    return resData;
}

function validate(data){
    if(!data){
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    var logmsg = ' to delivery invoice request for user: ' + user_id;
    mLogger.debug('Try' + logmsg);
    
    mAsync.series([
        //0.check the request status
        function(next) {
            var select = {
                invoice_status: 1,
            };
            var match = {
                id: param.ticket_id,
            };
            var query = {
                select: select,
                match: match,
            };
            mInvoiceOpLogModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg ='There is no such invoice request!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }
                    var invoice_status = rows[0].invoice_status;
                    if (invoice_status!=ADCONSTANTS.INVOICESTATUS.PROCCESSED.code) {
                        var msg = 'Invalid request to deliver the invoice in state:';
                        msg += ADCONSTANTS.INVOICESTATUS.format(invoice_status);
                        mLogger.error(msg);
                        return next({code:ERRCODE.PARAM_INVALID, msg:msg});
                    }

                    next(null);
                }
            });
        },
        //1.update the check status
        function(next) {
            var update = {
                invoice_status: ADCONSTANTS.INVOICESTATUS.SENT.code,                
                post_name: param.post_name,
                post_id: param.post_id,
            };
            if(param.tax_info_ticket) {
                update.tax_info_ticket = param.tax_info_ticket;
            }

            var match = {
                //user_id: param.user_id,
                id: param.ticket_id,
            };
            var query = {
                update: update,
                match: match,
            };
            mInvoiceOpLogModel.update(query, next);
        }
    ],function(err, data){
        if (err) {
            mLogger.error('Failed'+logmsg);
            fn(err);
        }else {
            mLogger.debug('Success'+logmsg);
            param.invoice_status = ADCONSTANTS.INVOICESTATUS.SENT.code;
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

