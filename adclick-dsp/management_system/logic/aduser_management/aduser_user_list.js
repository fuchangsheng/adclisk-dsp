/*
 * @file  aduser_user_list.js
 * @description ad user list view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_user_list.logic';
var URLPATH = '/v1/aduser/list';

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
    index: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0 && data<=ADCONSTANTS.PAGEMAXCOUNT;
        },
        optional: true,
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
    
    var users = data.users;
    var resData = {
        total: data.total,
        size: users.length,
        list: [],
    };

    for (var i = 0; i < users.length; i++) {
        var user =  users[i];
        var value = {
            user_id: user.user_id,
            user_name: user.user_name,
            company_name: user.company_name,
            company_license: user.company_license,
            telephone: user.telephone,
            address: user.address,
            contacts_name: user.contacts_name,
            contacts_mobile: user.contacts_mobile,
            contacts_email: user.contacts_email,
            rbalance: user.rbalance,
            vbalance: user.vbalance,
            user_audit_status: ADCONSTANTS.AUDIT.format(user.user_audit_status),
            user_audit_message: user.user_audit_message,
            categories : mCategoriesMapper.formatCategories(user.categories ),
            subcategories : mCategoriesMapper.formatSubCategories(user.categories, user.subcategories),
            qualification: user.qualification,
            categories_audit_status: ADCONSTANTS.AUDIT.format(user.categories_audit_status),
            categories_audit_message: user.categories_audit_message,
            site_name: user.site_name,
            site_url: user.site_url,
        };
        resData.list.push(value);
    }
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
   
    var logmsg = ' to get the ad user list in the system' ;
    mLogger.debug('Try '+logmsg);

     mAsync.waterfall([
        //1. check total number of user in the system
        function(next) {
            var match = {
                
            };
            var query = {
                match: match,
            };
            mDspAduserModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the invoice data list
        function(total, next) {
            if (total==0) {
                return next(null, {total: 0, users: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more user in the system');
                return next(null, {total: total, users: []});
            }

            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mDspAduserModel.tableName;
            sqlstr += ' ORDER BY create_time DESC ';
            sqlstr +=' limit '+count+' offset '+offset;
            sqlstr +=';';

            //2.2 query the database            
            var query = {
                sqlstr: sqlstr,
            };

            mDspAduserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {     
                    next(null, {total: total, users: rows});
                }
            });
        },
    ], function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(data);
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

