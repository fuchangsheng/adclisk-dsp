/*
 * @file  ad_account_qualification_edit.js
 * @description ad account qualification information edit API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_qualification_edit.logic';
var URLPATH = '/v3/settings/account/qinfo/edit';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mDspAduserModel = require('../../../model/dsp_aduser').create();
var mAdxAuditUserModel = require('../../../model/adlib_audit_users').create();
var mAdLibUserModel = require('../../../model/adlib_user').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');
var mDataModelHelper = require('../../../local_utils/data_model_helper');
var mCategories = require('../../../../utils/catergory_mapper');

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
    categories: {
        data: 1,
        rangeCheck: function(data) {
            return mCategories.verifyCategories(data) ;
        },
        optional: true,
    },
    subcategories: {
        data: 1,
        rangeCheck: function(data) {
            return mCategories.verifySubCategories(data) ;
        },
        optional: true,
    },
    site_name: {
        data: 'site_name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    site_url: {
        data: 'site_url',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    qualification: {
        data: 'qualification',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    qualification_name: {
        data: 'qualification_name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    qualification_number: {
        data: 'qualification_number',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    valid_date_begin: {
        data: 'YYYY-MM-DD',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        },
        optional: true,
    },
    valid_date_end: {
        data: 'YYYY-MM-DD',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
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
    
    var resData = {
        user_id: data.user_id,
    };

    return resData;
}

function preprocess(param) {
    if (param.valid_date_begin) {
        param.valid_date_begin = new Date(param.valid_date_begin);
    }
    if (param.valid_date_end) {
        param.valid_date_end = new Date(param.valid_date_end);
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var toUpdate = false;
    var qualificationToUpdate = false;
    var qualificationUpdate = {};
    var infoUpdate = {};
    var aduserInfo = {};
    var logmsg = ' to edit qualification info for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.series([
        //1 to get user info
        function(next) {
            var match = {
                user_id: user_id,
            };
            var select = mDspAduserModel.refModel;
            var query = {
                match: match,
                select: select,
            }

            mDspAduserModel.lookup(query, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    if(rows.length == 0) {
                        var msg = 'Cannot find the user_id = ' + user_id;
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        aduserInfo = rows[0];
                        next(null);
                    }
                }
            });
        },
        //2. to update the data
        function(next) {
            var update = {};
            if (mUtils.isExist(param.categories)) {
                update.categories = mCategories.parseCategories(param.categories);
                toUpdate = true;

            }
            if (mUtils.isExist(param.subcategories)) {
                update.subcategories = mCategories.parseSubCategories(param.subcategories);
                toUpdate = true;
            }
            if (param.site_name) {
                update.site_name = param.site_name;
                infoUpdate.site_name = param.site_name;
                toUpdate = true;
            }
            if (param.site_url) {
                update.site_url = param.site_url;
                infoUpdate.site_url = param.site_url;
                toUpdate = true;
            }
            if (param.qualification) {
                update.qualification = param.qualification;
                toUpdate = true;
            }
            if (param.qualification_name) {
                update.qualification_name = param.qualification_name;
                infoUpdate.qualification_name = param.qualification_name;
                qualificationUpdate.qualification_name = param.qualification_name;
                toUpdate = true;
                qualificationToUpdate = true;
            }
            if (param.qualification_number) {
                update.qualification_number = param.qualification_number;
                qualificationUpdate.qualification_number = param.qualification_number;
                toUpdate = true;
                qualificationToUpdate = true;
            }
            if (param.valid_date_begin) {
                update.valid_date_begin = param.valid_date_begin;
                toUpdate = true;
            }
            if (param.valid_date_end) {
                update.valid_date_end = param.valid_date_end;
                qualificationUpdate.valid_date_end = param.valid_date_end;
                toUpdate = true;
                qualificationToUpdate = true;
            }

            toUpdate = mUtils.isNeedToUpdate(aduserInfo, update);
            qualificationToUpdate = mUtils.isNeedToUpdate(aduserInfo, qualificationUpdate);

            //2.nothing to update
            if (!toUpdate) {
                return next(null);
            }

            update.categories_audit_status = ADCONSTANTS.AUDIT.VERIFYING.code;
            var match = {
                user_id: param.user_id,
            };
            var query = {
                update: update,
                match: match,
            };
            mDspAduserModel.update(query, next);
        },
        function(next) {
            //nothing to update
            if (!qualificationToUpdate) {
                return next(null);
            }

            var sqlstr = 'update ' + mAdxAuditUserModel.tableName;
            sqlstr += ' set audit_status=' + ADCONSTANTS.AUDIT.UNCHECK.code,
            sqlstr += ' where user_id=' + param.user_id;

            var query = {
                sqlstr : sqlstr,
            }

            mAdxAuditUserModel.query(query, next);
        },
        //5. update adlib user
        function(next) {
            //nothing to udate
            if(Object.keys(infoUpdate).length == 0 || !toUpdate) {
                return next(null);
            }

            var match = {
                user_id: param.user_id,
            }

            var query = {
                match: match,
                update: infoUpdate,
            }
            mAdLibUserModel.update(query, next);
        }
    ], function(err) {
        if (err) {
            mLogger.error('Failed'+logmsg);
            fn(err);
        }else {
            mLogger.info('Success'+logmsg);
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

