/*
 * @file  ad_account_qualification_view.js
 * @description ad account qualification information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_qualification_view.logic';
var URLPATH = '/v1/aduser/qualification/view';

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
var mCategories = require('../../../utils/catergory_mapper');

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

    if(data.valid_date_begin && mUtils.verifyDatatime(data.valid_date_begin, 'YYYY-MM-DD')) {
        data.valid_date_begin = mMoment(data.valid_date_begin).format('YYYY-MM-DD');
    }
    if(data.valid_date_end && mUtils.verifyDatatime(data.valid_date_end, 'YYYY-MM-DD')) {
        data.valid_date_end = mMoment(data.valid_date_end).format('YYYY-MM-DD');
    }
    
    var resData = {
        user_id: data.user_id,
        categories : mCategories.formatCategories(data.categories) ,
        subcategories : mCategories.formatSubCategories(data.subcategories),
        qualification: data.qualification,
        qualification_name: data.qualification_name,
        qualification_number: data.qualification_number,
        qualification_type: data.qualification_type,
        valid_date_begin: data.valid_date_begin,
        valid_date_end: data.valid_date_end,
        audit_status: ADCONSTANTS.AUDIT.format(data.categories_audit_status),
        site_name: data.site_name,
        site_url: data.site_url,
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
    var logmsg = ' to view qualification info for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    var select = mDspAduserModel.refModel;
    var match = {
        user_id: user_id,
    };
    var query = {
        select: select,
        match: match,
    };

    mDspAduserModel.lookup(query, function(err, rows) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            if (!rows || rows.length==0) {
                var msg = 'There is no match data!';
                mLogger.error(msg);
                return fn({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
            }

            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(rows[0]);
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

