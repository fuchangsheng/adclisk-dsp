/*
 * @file verify_func.js
 * @description functions for testing of verify module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.18
 * @version 0.0.1 
 */
 
'use strict';
var MODULENAME = 'verify_func';

// utils
var mDataHelper = require('../../../utils/data_helper');

// constants
var ADCONSTANTS = require('../../../common/adConstants');

//model
var mEmailVerifyLogModel = require('../../model/email_verify_log').create();
var mMsgReceiversModel = require('../../model/msg_notify_receivers').create();

var email_add = function(email, cb){
    var id = mDataHelper.createId(email);
    var token = mDataHelper.createEmailToken(email);

    var value = {
        id: id,
        email: email,
        token: token,
        type: ADCONSTANTS.EMAILVERIFYTYPE.ADDRECEIVER.code,
        status: ADCONSTANTS.TOKENSTATUS.SEND.code,
    };
    var query = {
        fields: value,
        values: [value],
    };
    mEmailVerifyLogModel.create(query, function(err){
        if(err) cb(err);
        else {
            var receiver_id = mDataHelper.createId(email);
            var value = {
                id: receiver_id,
                type: 1,
                receiver: email,
                audit_status: ADCONSTANTS.AUDIT.VERIFYING.code,
            };
            var query = {
                fields: value,
                values: value,
            };
            mMsgReceiversModel.create(query, function(err) {
                cb(err, token);
            });
        }
    });
};

var email_del = function(email, cb){
    mEmailVerifyLogModel.remove({ match : { email : email } }, function(err){
        mMsgReceiversModel.remove({ match : { email : email } }, function(err2){
            cb(err || err2);
        });
    });
};

module.exports.email_add = email_add;
module.exports.email_del = email_del;