/*
 * @file  ads_target_template_create.js
 * @description create the ad target template API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.21
 * @version 1.1.0 
 */
'use strict';
var MODULENAME = 'ads_target_template_create.logic';
var URLPATH = '/v3/utils/tt/create';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");
var AdsUtils = require('../ads_utils');

//models
var mADTargetTemplateModel = require('../../../model/adlib_target_template').create();
var mADTargetTemplateContentsModel = require('../../../model/adlib_target_template_contents').create();

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
    template_name: {
        data: 'name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    targets: {
        data: [],
        rangeCheck: function(data) {
	    console.log(1111);
            if(data.length <= 0) {
                return false;
            }
            for (var i = 0; i < data.length; i++) {
                var target = data[i];
                var type = ADCONSTANTS.ADTARGETTYPE.find(target.type);
                if (!type) {
                    return false;
                }
            }
            return true;
        },
    },
    tag: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    }
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function validate(data){
    console.log(data);
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
        template_id: data.template_id
    };

    return resData;
}

function preprocess(param) {
   
}

function createNewTargetTempate(param, fn) {
    mLogger.debug('calling createNewTargetTempate!');
    
    var value = {
        template_name: param.template_name,
        user_id: param.user_id,
    };

    if(param.tag) {
        value.tag = param.tag;
    }

    var query = {
        fields: value,
        values: [value],
    };

    mADTargetTemplateModel.create(query, function(err, rows) {
        if (err) {
            fn(err);
        }else {
            param.template_id = rows.insertId || -1;
            fn(null, rows);
        }
    });
}

function createNewTargetTemplateContents(param, fn) {
    mLogger.debug('calling createNewTargetTemplateContents!');
    
    var values = [];
    var targets = param.targets;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var value = {
            template_id: param.template_id,
            user_id: param.user_id,
            type: ADCONSTANTS.ADTARGETTYPE.parse(target.type),
            content: target.content,
            status: ADCONSTANTS.ADTARGETSTATUS.parse(target.status),
        };
        AdsUtils.parserUnitTarget(value);
        values.push(value);
    }

    var query = {
        fields: values[0],
        values: values,
    };

    mADTargetTemplateContentsModel.create(query, fn);
}

function transactionCallback(param, fn) {
    mLogger.debug('calling transactionCallback!');

    mAsync.series([
        function(next) {
            createNewTargetTempate(param, next);
        }, 
        function(next) {
            createNewTargetTemplateContents(param, next);
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
    var logmsg = ' to create ad target template for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.series([
        //1. check whether the name duplicated in the system
        function(next) {
            var match = {
                user_id: user_id,
                template_name: param.template_name,
            };
            
            var query = {
                match: match,
            };
            mADTargetTemplateModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total>0) {
                        var msg = 'The template name duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg:msg});
                    }
                    next(null);
                }
            });
        },
        function(next) {
            param.transactionFun = transactionCallback;
            mADTargetTemplateContentsModel.doTransaction(param, next);
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

