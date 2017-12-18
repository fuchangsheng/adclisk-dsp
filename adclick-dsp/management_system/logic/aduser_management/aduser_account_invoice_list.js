/*
 * @file  ad_account_invoice_list.js
 * @description ad invoice information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_invoice_list.logic';
var URLPATH = '/v1/aduser/invoice/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mDspAduserModel = require('../../model/dsp_aduser').create();
var mAdInvoiceModel = require('../../model/aduser_invoice_account').create();

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
    
    var invoices = data.invoices;

    var resData = {
        total: data.total,
        size: invoices.length,
        list: [],
    };

    for (var i = 0; i < invoices.length; i++) {
        var invoice = {
            id: invoices[i].id,
            title: invoices[i].title,
            tax_no: invoices[i].tax_no,
            address: invoices[i].address,
            phone: invoices[i].phone,
            bank: invoices[i].bank,
            bank_account_no: invoices[i].bank_account_no,
            receiver_name: invoices[i].receiver_name,
            receiver_address: invoices[i].receiver_address,
            receiver_email: invoices[i].receiver_email,
            receiver_mobile: invoices[i].receiver_mobile,
            qualification: invoices[i].qualification,
            audit_status: invoices[i].audit_status,
            audit_message: invoices[i].audit_message,
            type: ADCONSTANTS.INVOICETYPE.format(invoices[i].type),
            create_time: mMoment(invoices[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
            update_time: mMoment(invoices[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT),
        };
        resData.list.push(invoice);
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
    var logmsg = ' to get the invoice list from user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }

    mAsync.waterfall([
        //1. check total number of invoice for the user
        function(next) {
            var match = {
                user_id: user_id,
                status: ADCONSTANTS.DATASTATUS.VALID.code,
            };
            var query = {
                match: match,
            };
            mAdInvoiceModel.count(query, function(err, total) {
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
                return next(null, {total: 0, invoices: []});
            }
            var index = param.index || 0;
            var count = param.count || 10;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more data in the system for user:'+user_id);
                return next(null, {total: total, invoices: []});
            }
            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mAdInvoiceModel.tableName;
            sqlstr +=' where user_id='+user_id;
            sqlstr +=' and status=' +ADCONSTANTS.DATASTATUS.VALID.code;
            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += ' ORDER BY create_time ASC ';
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

            mAdInvoiceModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {     
                    next(null, {total: total, invoices: rows});
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

