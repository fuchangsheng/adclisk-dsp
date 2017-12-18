/*
 * @file  ad_account_role_create.js
 * @description create the account role API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.04
 * @version 3.0.1
 */
'use strict';
var MODULENAME = 'ad_account_role_create.logic';
var URLPATH = '/v3/ad/account/role/create';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mAccountRoleModel = require('../../../model/role').create();
var mAccountRoleContentModel = require('../../../model/role_content').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

//to check the notify setting data
var mRoleRefModel = {
    category: {
        data:'',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.ROLECATEGORIES.find(data);
            return type? true:false; 
        }
    },
    subcategory: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.ROLESUBCATEGORIES.find(data);
            return type? true:false;
        },
    },
    channel : {
        data: '',
        rangeCheck: function(data) {
           if (mUtils.isEmpty(data)) {
                return true;
           }
           var channel = ADCONSTANTS.ROLECHANNEL.find(data);
           return channel ? true: false;
        },
    },
};

var mRoleChecker = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRoleRefModel
});

function roleCheck(data) {
    if(!data){
        return false;
    }

    return mRoleChecker.validate({
        inputModel: data,
    });
}

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    role_name: {
        data: 'name',
        rangeCheck: mUtils.notEmpty,
    },
    list: {
        data: [],
        rangeCheck: function(data) {
            if(data.length <= 0) {
                return false;
            }
            var isvalid = true;
            for (var i = 0; i < data.length; i++) {
                isvalid = roleCheck(data[i]);
                if (isvalid==false) {
                    break;
                }
            }
            return isvalid;
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
        role_id: data.role_id
    };

    return resData;
}

function preprocess(param) {

}

function createNewRole(param, fn) {
    mLogger.debug('calling createNewRole!');
    
    var value = {
        role_name: param.role_name,
        user_id: param.user_id,
    };

    var query = {
        fields: value,
        values: [value],
    };

    mAccountRoleModel.create(query, function(err, rows) {
        if (err) {
            fn(err);
        }else {
            param.role_id = rows.insertId || -1;
            fn(null, rows);
        }
    });
}

function createNewRoleContents(param, fn) {
    mLogger.debug('calling createNewRoleContents!');
    
    var values = [];
    var targets = param.list;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var value = {
            user_id: param.user_id,
            role_id: param.role_id,
            category: ADCONSTANTS.ROLECATEGORIES.parse(target.category),
            subcategory: ADCONSTANTS.ROLESUBCATEGORIES.parse(target.subcategory),
            channel: ADCONSTANTS.ROLECHANNEL.parse(target.channel),
        };
        values.push(value);
    }

    var query = {
        fields: values[0],
        values: values,
    };

    mAccountRoleContentModel.create(query, fn);
}

function transactionCallback(param, fn) {
    mLogger.debug('calling transactionCallback!');

    mAsync.series([
        function(next) {
            createNewRole(param, next);
        },
        function(next) {
            createNewRoleContents(param, next);
        }
    ], function(err) {
        if (err) {
            fn(err);
        }else {
            fn(null);
        }
    });
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to create ad account role for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.series([
        //1. check whether the name duplicated in the system
        function(next) {
            var match = {
                user_id: user_id,
                role_name: param.role_name,
            };
            
            var query = {
                match: match,
            };
            mAccountRoleModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total>0) {
                        var msg = 'The role name duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg:msg});
                    }
                    next(null);
                }
            });
        },
        function(next) {
            param.transactionFun = transactionCallback;
            mAccountRoleModel.doTransaction(param, next);
        },
    ], function(err, data) {
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
module.exports.createRole = processRequest;

