/*
 * @file  ad_account_operator_del.js
 * @description delete ad operator list API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.01
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_operator_del.logic';
var URLPATH = '/v3/settings/system/operator/del';

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
var mAdOperatorsModel = require('../../../model/aduser_operators').create();

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
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    role: {
        data: 1,
        rangeCheck: function(data) {
            return !mUtils.isEmpty(ADCONSTANTS.ROLE.format(data));
        },
    },
    target_oper_id: {
        data: '0',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
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
        oper_id: data.target_oper_id,
    };

    return resData;
}

function preprocess(param) {

}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var oper_id = param.target_oper_id;

    var logmsg = ' to delete the operators "'+oper_id+'" from user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.series([
        //0. premission check
        function(next) {
            var role_check = (
                param.role == ADCONSTANTS.ROLE.CREATOR.code ||
                param.role == ADCONSTANTS.ROLE.ADMIN.code
            );

            if(role_check) {
                next(null);
            } else {
                var msg = 'Operator is beyond permission';
                mLogger.error(msg);
                next({code: ERRCODE.PERMISSIONS_LIMITED, msg: msg});
            }
        },
        //1.check whether the user in the system
        function(next) {
            var match = {
                user_id: user_id,
                oper_id: oper_id,
                status: ADCONSTANTS.DATASTATUS.VALID.code,
            };
            
            var query = {
                match: match,
            };

            mAdOperatorsModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total==0) {
                        var msg = 'There is no match data!';
                        mLogger.error(msg + logmsg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }

                    next(null);
                }
            });
        },
        //2. remove the operator from the system
        function(next) {
            var match = {
                user_id: user_id,
                oper_id: oper_id,
            };
            //2.1 we mark the status to no zero, which means deleted
            var update = {
                status : ADCONSTANTS.DATASTATUS.DELTED.code,
            };
            var query = {
                update: update,
                match: match,
            };

            //2.2 query the database
            mAdOperatorsModel.update(query, function(err, rows) {
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

