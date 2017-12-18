/*
 * @file  ad_account_operator_view.js
 * @description get ad operator list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.24
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_operator_view.logic';
var URLPATH = '/v1/aduser/operator/view';

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
    oper_id:{
        data: '',
        rangeCheck: function(data){
            return !mUtils.isEmpty(data);
        },
    },
    target_oper_id: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
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
    
    var resData = {
        name: data.name,
        oper_id: data.oper_id,
        user_id: data.user_id,
        role : ADCONSTANTS.ROLE.format(data.role),
        portrait: data.portrait,
        email: data.email,
        audit_status: ADCONSTANTS.AUDIT.format(data.audit_status),
        mobile: data.mobile,
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
    //view others or myself
    var oper_id = param.target_oper_id || param.oper_id;
    var logmsg = ' to get the operator details for op:' + oper_id +' of user:'+ user_id ;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1 read the details!
        function(next) {
            //2.1 create the sql statement
            var select = mAdOperatorsModel.refModel;
            var match = {
                user_id: user_id,
                oper_id: oper_id,
                status: ADCONSTANTS.DATASTATUS.VALID.code,
            };
            var query = {
                select: select,
                match: match,
            };
            //2.2 query the database
            mAdOperatorsModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'There is no this operator';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }

                    next(null, rows[0]);
                }
            });
        },
    ], function(err, operator) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(operator);
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

