/*
 * @file  ad_account_info_view.js
 * @description ad account basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_usertype_update.logic';
var URLPATH = '/v1/aduser/usertype/update';

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

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');
var mCategoriesMapper = require('../../../utils/catergory_mapper');

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
    user_type: {
        data: 0,
        rangeCheck: function(data) {
            return mIs.inArray(data, [0, 1]);
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

    return data;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to update usertype for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    var match = {
        user_id: user_id,
    };
    var update = {
        user_type: param.user_type
    };
    var query = {
        update: update,
        match: match,
    };

    mDspAduserModel.update(query, function(err) {
        if(err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        } else {
            mLogger.debug('Success' + logmsg);
            fn(null, {});
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

