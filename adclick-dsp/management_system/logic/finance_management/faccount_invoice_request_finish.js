/*
 * @file  faccount_invoice_request_check.js
 * @description virture invoice request check logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_request_finish.logic';
var URLPATH = '/v1/aduser/faccount/invoice/finish';

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
        data: [],
        rangeCheck: function(list) {
            for(var id in list){
                if (mUtils.isEmpty(id)) {
                    return false;
                }
            }
            return true;
        },
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

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    var logmsg = ' to finish invoice request for user: ' + user_id;
    mLogger.debug('Try' + logmsg);
    
    var invoice_status = ADCONSTANTS.INVOICESTATUS.DONE.code;

    mAsync.waterfall([
        //0.check current status
        function(next){
            var sqlstr = 'select id, invoice_status from ';
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
                    var updateIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        if(rows[i].invoice_status==ADCONSTANTS.INVOICESTATUS.RECEIVED.code){
                            updateIds.push(rows[i].id);
                        }
                    }
                    next(null, updateIds)
                }
            });
        },
        //1.update the check status
        function(updateIds, next) {
            var sqlstr = 'update '+mInvoiceOpLogModel.tableName;
            sqlstr +=' set invoice_status='+invoice_status;
            sqlstr +=' where id in("'+ updateIds.join('","')+'")';
            sqlstr +=';';
            
            var query = {
                sqlstr: sqlstr,
            };
            mInvoiceOpLogModel.query(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    next(null, updateIds);
                }
            });
        }
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

