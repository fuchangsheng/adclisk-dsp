/*
 * @file  ads_account_role_edit.js
 * @description ad account role to edit API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.05
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ads_account_role_edit.logic';
var URLPATH = '/v3/ad/account/role/edit';

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
    role_id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
        },
    },
    role_name: {
        data: 'name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    targets: {
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

function removeOldRoleContents(param, fn) {
    mLogger.debug('calling removeOldRoleContents!');

    var match = {
        user_id: param.user_id,
        role_id: param.role_id,
    };

    var query = {
        match: match,
    };

    mAccountRoleContentModel.remove(query, fn);
}

function createNewRoleContents(param, fn) {
    mLogger.debug('calling createNewRoleContents!');

    var values = [];
    var targets = param.targets;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var value = {
            role_id: param.role_id,
            user_id: param.user_id,
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
            removeOldRoleContents(param, next);
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
    var logmsg = ' to edit ad account role for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.series([
        //1. check whether the name duplicated in the system
        function(next) {
            var match = {
                user_id: user_id,
                role_name: param.role_name,
            };
            var select = {
                id: param.id,
            }
            var query = {
                match: match,
                select: select,
            };
            mAccountRoleModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows.length > 0 && rows[0].id!=param.role_id) {
                        var msg = 'The name duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg:msg});
                    }
                    next(null);
                }
            });
        },
        //2. update target template
        function(next) {
            var match = {
                user_id: user_id,
                id: param.role_id,
            };
            var update = {
                role_name: param.role_name,
            };
            var query = {
                match: match,
                update: update
            }
            mAccountRoleModel.update(query, next);
        },
        function(next) {
            param.transactionFun = transactionCallback;
            mAccountRoleContentModel.doTransaction(param, next);
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

