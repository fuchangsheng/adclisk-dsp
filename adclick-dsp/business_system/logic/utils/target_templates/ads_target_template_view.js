/*
 * @file  ads_target_template_view.js
 * @description get the ad target template view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.21
 * @version 1.1.0 
 */
'use strict';
var MODULENAME = 'ads_target_template_view.logic';
var URLPATH = '/v3/utils/tt/view';

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
    template_id: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0;
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

    var contents = data;
    var resData = {
        size: contents.length,
        list: []
    };

    for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        AdsUtils.formatUnitTarget(content);
        var value = {
            type: ADCONSTANTS.ADTARGETTYPE.format(content.type),
            content: content.content,
            status: ADCONSTANTS.ADTARGETSTATUS.format(content.status),
        };
        resData.list.push(value);
    }
    return resData;
}

function preprocess(param) {
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
    var logmsg = ' to get ad target template view from user:' + user_id;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        //1. check total number of ad plans in the system
        function(next) {
            var match = {
                user_id: user_id,
                template_id: param.template_id,
            };
            var select = {
                template_name: '',
            }
            var query = {
                match: match,
                select: select,
            };
            mADTargetTemplateModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows.length===0) {
                        var msg = 'There is no such template info!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        next(null, rows[0]);
                    }
                }
            });
        },
        //2. get template info
        function(template, next) {
            var match = {
                user_id: user_id,
                template_id: param.template_id,
            };
            var query = {
                match: match,
                select: mADTargetTemplateContentsModel.refModel,
            };
            mADTargetTemplateContentsModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, rows);
                }
            });
        },
    ], function(err, contents) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(contents);
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

