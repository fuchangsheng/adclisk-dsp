/*
 * @file  ad_account_info_edit.js
 * @description ad account basic information dit API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_info_edit.logic';
var URLPATH = '/v3/settings/account/info/edit';

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
    // fix bug [71], user_name duplicate
    edit_user_name: {
        data: 'name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    company_name: {
        data: 'company_name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    company_license:{
        data: 'company_license',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    license_number: {
        data: 'license_number',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    license_valid_date_begin: {
        data: 'YYYY-MM-DD',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        },
        optional: true,
    },
    license_valid_date_end: {
        data: 'YYYY-MM-DD',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }, 
        optional: true,
    },
    qualification_type: {
        data: 0,
        rangeCheck: function(data) {
            return true;
        },
        optional: true,
    },
    address: {
        data: 'address',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    telephone: {
        data: '12',
        rangeCheck: function(data) {
            return mUtils.isPhone(data);
        },
        optional: true,
    },
    contacts_name: {
        data: 'name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    contacts_mobile: {
        data: 'mobile',
        rangeCheck: function(data) {
            return mUtils.isMobile(data);
        },
        optional: true,
    },
    contacts_email: {
        data: 'email',
        rangeCheck: function(data) {
            return mUtils.isEmail(data);
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
    if(data.username_update) {
        resData.user_name = data.edit_user_name;
    }

    return resData;
}

function preprocess(param) {
    if (param.license_valid_date_begin) {
        param.license_valid_date_begin = new Date(param.license_valid_date_begin);
    }
    if (param.license_valid_date_end) {
        param.license_valid_date_end = new Date(param.license_valid_date_end);
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var reset_audit = false;
    var info_update = false;
    var aduserInfo = {};
    var adxUpdate = {};
    var logmsg = ' to edit basic info for user:' + user_id ;
    mLogger.debug('Try '+logmsg);
    mLogger.debug(param);

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
        //2 check whether the name is duplicated!
        function(next) {
            if (!param.edit_user_name) {
                return next(null);
            }

            var match = {
                user_name: param.edit_user_name
            };
            var select = mDspAduserModel.refModel;
            var query = {
                select: select,
                match: match,
            };
            mDspAduserModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows && rows.length>0 && (rows[0].user_id!=user_id)) {
                        var msg = 'The name is duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg: msg});
                    }

                    next(null);
                }
            });
        },
        //3. edit the ad user information
        function(next) {
            var match = {
                user_id: user_id,
            };
            var update = {};
            var toUpdate = false;
            if (param.edit_user_name) {
                update.user_name = param.edit_user_name;
                info_update = true;
                toUpdate = true;
            }
            
            if (param.company_name) {
                update.company_name = param.company_name;
                adxUpdate.company_name = param.company_name;
                toUpdate = true;
            }
            if (param.company_license) {
                update.company_license = param.company_license;
                toUpdate = true;
            }
            if (param.license_number) {
                update.license_number = param.license_number;
                adxUpdate.license_number = param.license_number;
                toUpdate = true;
            }
            if (param.license_valid_date_begin) {
                update.license_valid_date_begin = param.license_valid_date_begin;
                toUpdate = true;
            }
            if (param.license_valid_date_end) {
                update.license_valid_date_end = param.license_valid_date_end;
                adxUpdate.license_valid_date_end = param.license_valid_date_end;
                toUpdate = true;
            }
            if (mUtils.isExist(param.qualification_type)) {
                update.qualification_type = param.qualification_type;
                adxUpdate.qualification_type = param.qualification_type;
                toUpdate = true;
            }
            if (param.address) {
                update.address = param.address;
                toUpdate = true;
            }
            if (param.telephone) {
                update.telephone = param.telephone;
                toUpdate = true;
            }
            if (param.contacts_name) {
                update.contacts_name = param.contacts_name;
                toUpdate = true;
            }
            if (param.contacts_email) {
                update.contacts_email = param.contacts_email;
                toUpdate = true;
            }
            if (param.contacts_mobile) {
                update.contacts_mobile = param.contacts_mobile;
                toUpdate = true;
            }

            toUpdate = mUtils.isNeedToUpdate(aduserInfo, update);
            if(mUtils.isNeedToUpdate(aduserInfo, adxUpdate)) {
                update.user_audit_status = ADCONSTANTS.AUDIT.VERIFYING.code;
                reset_audit = true;
            }
            //3.1 nothing to update,just return
            if (!toUpdate) {
                return next(null);
            }

            var query = {
                update: update,
                match: match,
            };
            mDspAduserModel.update(query, next);
        },
        //4. update adx audit
        function(next) {
            //nothing to update
            if (!reset_audit) {
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
            if(!info_update) {
                return next(null);
            }

            var match = {
                user_id: param.user_id,
            }
            var update = {
                user_name: param.edit_user_name,
            }

            var query = {
                match: match,
                update: update,
            }
            mAdLibUserModel.update(query, next);
        }
    ], function(err) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            param.username_update = info_update;
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

