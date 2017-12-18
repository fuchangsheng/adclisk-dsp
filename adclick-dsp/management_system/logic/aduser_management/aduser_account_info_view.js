/*
 * @file  ad_account_info_view.js
 * @description ad account basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_info_view.logic';
var URLPATH = '/v1/aduser/view';

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

    if(data.license_valid_date_begin && mUtils.verifyDatatime(data.license_valid_date_begin, 'YYYY-MM-DD')) {
        data.license_valid_date_begin = mMoment(data.license_valid_date_begin).format('YYYY-MM-DD');
    }
    if(data.license_valid_date_end && mUtils.verifyDatatime(data.license_valid_date_end, 'YYYY-MM-DD')) {
        data.license_valid_date_end = mMoment(data.license_valid_date_end).format('YYYY-MM-DD');
    }
    
    var resData = {
        user_id: data.user_id,
        user_name: data.user_name,
        company_name: data.company_name,
        company_license: data.company_license,
        license_number: data.license_number,
        license_valid_date_begin: data.license_valid_date_begin,
        license_valid_date_end: data.license_valid_date_end,
        telephone: data.telephone,
        address: data.address,
        contacts_name: data.contacts_name,
        contacts_mobile: data.contacts_mobile,
        contacts_email: data.contacts_email,
        rbalance: data.rbalance,
        vbalance: data.vbalance,
        user_audit_status: ADCONSTANTS.AUDIT.format(data.user_audit_status),
        categories : mCategoriesMapper.formatCategories(data.categories ),
        subcategories : mCategoriesMapper.formatSubCategories(data.categories, data.subcategories),
        qualification: data.qualification,
        qualification_type: data.qualification_type,
        categories_audit_status: ADCONSTANTS.AUDIT.format(data.categories_audit_status),
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
    var logmsg = ' to view basic info for user:' + user_id ;
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

