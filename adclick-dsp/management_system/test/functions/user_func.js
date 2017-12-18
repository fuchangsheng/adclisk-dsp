/*
 * @file user_func.js
 * @description functions for testing of user module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.16
 * @version 0.0.1 
 */
'use strict';

var MODULENAME = 'user_func.js';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');
var mMoment = require('moment');
var mIs = require('is_js');

// constants
var ADCONSTANTS = require('../../../common/adConstants');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');
var testUtils = require('../common/utils');

// dataModels
var mCodeModel = require('../../model/verify_code').create();
var mAdminModel = require('../../model/management_admin').create();


var get_capcode = function(token, cb){
    var match = {
        code_name: token,
    };
    var select = {
        code_value : 0,
    };
    var query = {
        select: select,
        match: match,
    };
    mCodeModel.lookup(query, function(err, rows){
        if (!rows || rows.length ===  0) cb('no such token!');
        else cb(err, rows[0].code_value);
    });   
};

var admin_add = function(data, cb){
    var param = {
        name : data.name,
        password : data.password,
        phone : testUtils.createRandomPhoneNum(),
        email : testUtils.createRandomEmail(),
        role : 1,
    };

    var name = param.name;
    var logmsg = ' to add mgr: ' + name;
    mLogger.debug('Try' + logmsg);
    
    mAsync.series({
        checkName: function(next) {
            var match = {
                name: param.name
            };
            var select = {
                id: 1
            };
            var query = {
                select: select,
                match: match
            };
            mAdminModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows && rows.length !== 0) {
                        var msg = 'Duplicated name';
                        mLogger.error(msg);
                        
                        next({
                            code: ERRCODE.PARAM_INVALID,
                            msg: msg,
                        });
                    } else {
                        next(null);
                    }
                }
            });
        },
        addUser: function(next) {
            var value = {
                id: mDataHelper.createNumberId(new Date()),
                name: param.name,
                password: mDataHelper.createPasswordSha1Data(param.name + param.password),
                phone: param.phone,
                email: param.email,
                role: param.role,
                status: 0,
                create_time: new Date()
            };
            var query = {
                fields: value,
                values: [value]
            };
            mAdminModel.create(query, function(err) {
                if(err) {
                    mLogger.error('Failed' + logmsg);
                    next(err);
                } else {
                    mLogger.debug('Success' + logmsg);
                    next(null, value.id);
                }
            });
        }
    }, function(err, data) {
        cb(err, data.addUser);
    });
}

var admin_del = function(id, cb){
    mAdminModel.remove({ match : { id : id } }, function(err){
        cb(err);
    });
}

module.exports.get_capcode = get_capcode;
module.exports.admin_add = admin_add;
module.exports.admin_del = admin_del;