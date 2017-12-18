/*
 * @file  faccount_invoice_edit.js
 * @description ad invoice information remove API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.208
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_invoice_edit.logic';
var URLPATH = '/v3/settings/finance/invoice-info/edit';

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
var mAdInvoiceModel = require('../../../model/aduser_invoice_account').create();

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
    id: {
        data: 'name',
        rangeCheck: mUtils.notEmpty,
    },
    title: {
        data: 'title',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    tax_no: {
        data: 'tax_no',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    address: {
        data: 'address',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    phone: {
        data:' phone',
        rangeCheck: mUtils.isPhone,
        optional: true,
    },
    bank: {
        data: 'bank',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    bank_account_no: {
        data: 'no',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    receiver_name: {
        data: 'name',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    receiver_address: {
        data: 'address',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    receiver_email: {
        data: 'email',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    receiver_mobile: {
        data: 'mobile',
        rangeCheck: mUtils.isMobile,
        optional: true,
    },
    qualification:{
        data: 'qualification',
        rangeCheck: mUtils.notEmpty,
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
        id: data.id,
    };

    //updated, then set the check status
    if (data.updated) {
        resData.audit_status = data.audit_status;
    }

    return resData;
}

function initUpdate(param) {
    var update = {};
    var toUpdate = false;
    if (param.title) {
        toUpdate = true;
        update.title = param.title;
    }
    if (param.tax_no) {
        toUpdate = true;
        update.tax_no = param.tax_no;
    }
    if (param.address) {
        toUpdate = true;
        update.address = param.address;
    }
    if (param.phone) {
        toUpdate = true;
        update.phone = param.phone;
    }
    if (param.bank) {
        toUpdate = true;
        update.bank = param.bank;
    }
    if (param.bank_account_no) {
        toUpdate = true;
        update.bank_account_no = param.bank_account_no;
    }
    if (param.receiver_name) {
        toUpdate = true;
        update.receiver_name = param.receiver_name;
    }
    if (param.receiver_mobile) {
        toUpdate = true;
        update.receiver_mobile = param.receiver_mobile;
    }
    if (param.receiver_email) {
        toUpdate = true;
        update.receiver_email = param.receiver_email;
    }
    if (param.receiver_address) {
        toUpdate = true;
        update.receiver_address = param.receiver_address;
    }
    if (param.qualification) {
        toUpdate = true;
        update.qualification = param.qualification;
    }
    
    if (toUpdate) {
        return update;
    }else {
        return null;
    }
}
function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var id = param.id;
    var logmsg = ' to edit the invoice '+id+' for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1. check whether the invoice exist in the system
        function(next) {
            var select = {
                audit_status: 1,
            };
            var match = {
                user_id: user_id,
                id: id,
                status: ADCONSTANTS.DATASTATUS.VALID.code,
            };
            var query = {
                match: match,
                select: select,
            };

            mAdInvoiceModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows.length==0) {
                        var msg = 'There is no such invoice info!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }else {
                        var invoice = rows[0];
                        if (invoice.status==ADCONSTANTS.AUDIT.PASS.code) {
                            var msg = 'This invoice is not allow to change!';
                            mLogger.error(msg);
                            next({code: ERRCODE.INVOICE_UNEDITABLE, msg: msg});
                        } else {
                            next(null, {});
                        }
                    }                    
                }
            });
        },
        //2. edit the invoice data
        function(data, next) {
            var match = {
                user_id: user_id,
                id: id,
            };

            //2.1 set the update 
            var update = initUpdate(param);
            if (!update) {
                var msg = 'Nothing to update!';
                mLogger.info(msg);
                //not a good way,improve me
                param.updated = false;
                return next(null, param);
            }

            //2.2 need check again if the data changed
            update.audit_status = ADCONSTANTS.AUDIT.VERIFYING.code;
            var query = {
                update: update,
                match: match, 
            };

            mAdInvoiceModel.update(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    //not a good way, improve me
                    param.updated = true;
                    param.audit_status = update.audit_status;
                    next(null);
                }
            });
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

