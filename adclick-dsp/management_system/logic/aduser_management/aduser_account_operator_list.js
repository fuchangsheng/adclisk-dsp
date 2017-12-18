/*
 * @file  ad_account_operator_list.js
 * @description get ad operator list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_operator_list.logic';
var URLPATH = '/v1/aduser/operator/list';

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
        data: 0,
        rangeCheck: function(data) {
            return data >=0;
        },
        optional: true,
    },
    count: {
        data: 10,
        rangeCheck: function(data) {
            return data>=0 && data<=ADCONSTANTS.PAGEMAXCOUNT;
        },
        optional: true,
    },
    audit_status: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.AUDIT.find(data);
            return type ==ADCONSTANTS.AUDIT.PASS ||
                        type==ADCONSTANTS.AUDIT.VERIFYING;
        },
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
    
    var operators = data.operators;
    var resData = {
        total: data.total,
        size: operators.length,
        list: [],
    };
    for (var i = 0; i < operators.length; i++) {
        var operator = {
            oper_id: operators[i].oper_id,
            user_id: operators[i].user_id,
            portrait: operators[i].portrait,
            role: operators[i].role,
            name: operators[i].name,
            email: operators[i].email,
            audit_status: ADCONSTANTS.AUDIT.format(operators[i].audit_status),
            mobile: operators[i].mobile,
        };
        resData.list.push(operator);
    }

    return resData;
}

function preprocess(param) {
    if (param.audit_status) {
        param.audit_status = ADCONSTANTS.AUDIT.parse(param.audit_status);
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to get the operators for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        //1.get the total number in the system
        function(next) {
            var match = {
                user_id: user_id,
                status: ADCONSTANTS.DATASTATUS.VALID.code,
            };

            if(mUtils.isExist(param.audit_status)) {
                match.audit_status=param.audit_status;
            }

            var query = {
                match: match,
            };
            mAdOperatorsModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2 check whether the name is duplicated!
        function(total, next) {
            var index = param.index || 0;
            var count = param.count || 10;
            var offset = index * count;

            if(offset > total) {
                return next(null, {total: total, operators: []});
            }
            //2.1 create the sql statement
            var select = mAdOperatorsModel.refModel;
            var sqlstr = 'select ';
            sqlstr += Object.keys(select).join(',');
            sqlstr +=' from '+mAdOperatorsModel.tableName;
            sqlstr +=' where user_id='+param.user_id;
            sqlstr +=' and status=' + ADCONSTANTS.DATASTATUS.VALID.code;
            if(mUtils.isExist(param.audit_status)){
                sqlstr += ' and audit_status=' + param.audit_status;
            }
            sqlstr +=' limit '+count+' offset '+offset;
            sqlstr +=';';
            var query = {
                sqlstr: sqlstr,
            };
            //2.2 query the database
            mAdOperatorsModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    var operators = [];
                    if (rows && rows.length>0) {
                        operators = rows;
                    }
                    var datas = {
                        total: total,
                        operators: operators,
                    };
                    next(null, datas);
                }
            });
        },
        
    ], function(err, datas) {
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

