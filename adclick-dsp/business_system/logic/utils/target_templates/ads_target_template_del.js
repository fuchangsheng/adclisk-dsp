/*
 * @file  ads_target_template_del.js
 * @description get the ad target template list API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.21
 * @version 1.1.0 
 */
'use strict';
var MODULENAME = 'ads_target_template_del.logic';
var URLPATH = '/v3/utils/tt/del';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

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
    template_id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
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
        user_id: data.user_id,
        template_id: data.template_id,
        template_name:data.rows0.template_name
    };

    return resData;
}

function preprocess(param) {
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
}

function removeTargetTemplateContents(param, fn) {
    mLogger.debug('calling removeTargetTemplateContents!');

    var match = {
        user_id: param.user_id,
        template_id: param.template_id,
    };

    var query = {
        match: match,
    };

    mADTargetTemplateContentsModel.remove(query, fn);
}

function removeTargetTemplate(param, fn) {
    mLogger.debug('calling removeTargetTemplate!');

    var match = {
        user_id: param.user_id,
        template_id: param.template_id,
    };

    var query = {
        match: match,
    };

    mADTargetTemplateModel.remove(query, fn);
}

function transactionCallback(param, fn) {
    mLogger.debug('calling transactionCallback!');

    mAsync.series([
        function(next) {
            removeTargetTemplateContents(param, next);
        }, 
        function(next) {
            removeTargetTemplate(param, next);
        }
    ], function(err) {
        if (err) {
            fn(err);
        }else {
            fn(null, param.rows0);
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
    var logmsg = ' to del ad target template from user:' + user_id;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        //1. check total number of ad plans in the system
        function(next) {
            var match = {
                user_id: user_id,
                template_id: param.template_id,
            };
            var select = {};
            select['*'] = 1;
            var query = {
                match: match,
                select:select
            };
            mADTargetTemplateModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if ((!rows) || (rows.length === 0)) {
                        var msg = 'There is no such template info!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        next(null,rows[0]);
                    }
                }
            });
        },
        //2. remove
        function(data, next) {
            param.transactionFun = transactionCallback;
            param.rows0 = data;
            mADTargetTemplateModel.doTransaction(param, next);
        },
    ], function(err,data) {
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
* export the get interface
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