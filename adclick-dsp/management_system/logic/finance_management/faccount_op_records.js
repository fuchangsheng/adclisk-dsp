/*
 * @file  faccount_op_records.js
 * @description ad financial account op records information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_op_records.logic';
var URLPATH = '/v1/aduser/faccount/oprecords';

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
var mAdAccountRechargeModel = require('../../model/account_recharge_log').create();

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
    type: {
        data: '1',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.FINANCIALACCOUNT.find(data);
            return type? true: false;
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
            date: mMoment(records[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
            account_type: records[i].account_type,
            type: 0,
            charge_id: records[i].id,
            amount: mUtils.fenToYuan(records[i].amount),
            charge_type: records[i].charge_type,
            charge_status: records[i].charge_status,
            notes: '',
        }; 
        if (records[i].ticket_no) {
            record.notes = '流水号：'+records[i].ticket_no;
        }

        resData.list.push(record);
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
    var logmsg = ' to view financial account operation records of user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    param.type = ADCONSTANTS.FINANCIALACCOUNT.parse(param.type);
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
    
    mAsync.waterfall([
        //1. get the total records as required
        function(next) {
            var match = {
                user_id: user_id,
            };
            //
            if (param.type) {
                match.account_type = param.type;
            }

            var query = {
                match: match,
            };
            mAdAccountRechargeModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the financial records
        function(total, next) {
            var index = param.index || 0;
            var count = param.count || 10;
            var offset = index * count;
            if (offset >= total) {
                mLogger.info('No more financial records for the user:'+user_id);
                return next(null, {total: total, records:[]});
            }

            var sqlstr = 'select * ';
            sqlstr += ' from '+ mAdAccountRechargeModel.tableName;
            sqlstr += ' where user_id="'+user_id+'"';
            if (param.type) {
                sqlstr += ' and account_type='+param.type;
            }
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

            var query = {
                sqlstr: sqlstr,
            };

            mAdAccountRechargeModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {total: total, records: rows});
                }
            });
        }
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

