/*
 * @file  faccount_invoice_records.js
 * @description ad financial invoice records API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_records.logic';
var URLPATH = '/v1/aduser/faccount/invoice/records';

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
var mInvoiceOpLogModel = require('../../model/invoice_op_log').create();
var mAdOperatorsModel = require('../../model/aduser_operators').create();

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
            return data >=0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0 && data <=ADCONSTANTS.PAGEMAXCOUNT;
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
    var records = data.records;

    var resData = {
        total: data.total,
        size: records.length,
        list: [],
    };

    for (var i = 0; i < records.length; i++) {
        var record = {
            ticket_id: records[i].id,
            date: mMoment(records[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
            title: records[i].title,
            type: ADCONSTANTS.INVOICETYPE.format(records[i].type),
            amount: mUtils.fenToYuan(records[i].amount),
            item: records[i].item_name,
            status: ADCONSTANTS.INVOICESTATUS.format(records[i].invoice_status),
            operator: records[i].name,
            notes: '',
        }; 

        resData.list.push(record);
    }

    return resData;
}

function preProcess(param) {
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to view financial account invoice records of user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preProcess(param);

    mAsync.waterfall([
        //1. get the total records as required
        function(next) {
            var match = {
                user_id: user_id,
            };

            var query = {
                match: match,
            };
            mInvoiceOpLogModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the financial invoice records
        function(total, next) {
            var index = param.index || 0;
            var count = param.count || 10;
            var offset = index * count;
            if (offset >= total) {
                mLogger.info('No more financial invoice records for the user:'+user_id);
                return next(null, {total: total, records:[]});
            }

            var sa = [];
            Object.keys(mInvoiceOpLogModel.refModel).forEach(function(k){
                sa.push(mInvoiceOpLogModel.tableName + '.' + k);
            });
            sa.push(mAdOperatorsModel.tableName + '.name');

            var sqlstr = 'select '+sa.join(',')+ ' from ';
            sqlstr += mInvoiceOpLogModel.tableName + ' join '+ mAdOperatorsModel.tableName;
            sqlstr += ' where '+mAdOperatorsModel.tableName+'.user_id='+user_id;
            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += ' ORDER BY create_time ASC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_DESC.code) {
                    sqlstr += ' ORDER BY create_time DESC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.UPDATETIME_DESC.code) {
                    sqlstr += ' ORDER BY update_time DESC ';
                }
            }
            sqlstr +=' limit ' + count +' offset '+offset;
            sqlstr +=';';

            var query = {
                sqlstr: sqlstr,
            };

            mInvoiceOpLogModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {total: total, records: rows});
                }
            });
        },
    ], function(err, datas){
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(datas);
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

