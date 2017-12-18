/*
 * @file  license_upload.js
 * @description ad invoice upload logic API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'license_upload.logic';
var URLPATH = '/v3/settings/account/license';

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
var mDataModelHelper = require('../../local_utils/data_model_helper');

var mUploader = require('./uploader');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
        optional: true,
    },
    file: {
        data: 'file',
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
        file: data.filepath,
        url: ADCONSTANTS.SERVER.FILESERVER + data.filepath
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id || '';
    var logmsg = ' to upload license for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    var resData = packageResponseData(param);
    fn(null, resData);
}

function postCallback (req, res, next) {
    var param = req.body || {};
    
    mDebug('req.file:%j', req.file);
    if (req.file) {
        param.file = req.file.path;
    }

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
}

/*
* export the post interface
*/
mRouter.post(URLPATH, 
    mUploader.single(ADCONSTANTS.UPLOADFILEDNAME), postCallback);


module.exports.router = mRouter;

