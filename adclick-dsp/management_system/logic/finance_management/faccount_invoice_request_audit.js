/*
 * @file  faccount_invoice_request_audit.js
 * @description virture invoice request check logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_request_audit.logic';
var URLPATH = '/v1/aduser/faccount/invoice/audit';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");
var InvoiceAuditUtils = require('./faccount_invoice_audit_utils');

//models
var mInvoiceOpLogModel = require('../../model/invoice_op_log').create();
var mDspAduserModel = require('../../model/dsp_aduser').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');
var mDataHelp = require('../../../utils/data_helper');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    ticket_id: {
        data: [],
        rangeCheck: function(list) {
            for(var i in list){
                if (mUtils.isEmpty(list[i])) {
                    return false;
                }
            }
            return true;
        },
    },
    audit: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.AUDIT.find(data);
            return type? true: false;
        },
    },
    message: {
        data: '',
        rangeCheck: function(data){
            return true;
        },
        optional: true,
    }
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
        updateIds: data.updateIds,
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

function preprocess(param) {
    if (param.audit) {
        param.audit = ADCONSTANTS.AUDIT.parse(param.audit);
    }
    param.message = param.message ||'';
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var logmsg = ' to check invoice request';
    mLogger.debug('Try' + logmsg);
    
    preprocess(param);
    var invoice_status;
    var updateIds = [];

    if (param.audit==ADCONSTANTS.AUDIT.PASS.code) {
        invoice_status = ADCONSTANTS.INVOICESTATUS.PROCCESSING.code;
    }else {
        invoice_status = ADCONSTANTS.INVOICESTATUS.CHECKFAIL.code;
    }

    mAsync.waterfall([
        //0.check current status
        function(next){
            var sqlstr = 'select id, invoice_status, user_id, amount from ';
            sqlstr += mInvoiceOpLogModel.tableName;
            sqlstr +=' where id in("'+ param.ticket_id.join('","')+'")';
            sqlstr +=';';
            var query = {
                sqlstr: sqlstr,
            };
            mInvoiceOpLogModel.query(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    for (var i = 0; i < rows.length; i++) {
                        if(rows[i].invoice_status==ADCONSTANTS.INVOICESTATUS.SUBMIT.code
                            || rows[i].invoice_status==ADCONSTANTS.INVOICESTATUS.CHECKFAIL.code){
                            updateIds.push(rows[i].id);
                        }
                    }
                    next(null, rows)
                }
            });
        },
        //1.update the check status
        function(updateInfo, next) {
            var createFnt = function(options) {
                return function(cb) {
                    InvoiceAuditUtils.auditTransanctionBatch(options, cb);
                }
            }
            var fnts = [];
            for(var i in updateInfo) {
                var options = {
                    user_id: updateInfo[i].user_id,
                    amount: updateInfo[i].amount,
                    audit: param.audit,
                    id: updateInfo[i].id,
                    invoice_status: invoice_status,
                    message: param.message,
                };
                fnts.push(createFnt(options));
            }

            mAsync.series(fnts, function(err) {
                if(err) {
                    next(err);
                } else {
                    next(null, updateInfo);
                }
            });
        },
    ],function(err, updateIds){
        if (err) {
            mLogger.error('Failed'+logmsg);
            fn(err);
        }else {
            mLogger.debug('Success'+logmsg);
            param.invoice_status = invoice_status;
            param.updateIds = updateIds;
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

