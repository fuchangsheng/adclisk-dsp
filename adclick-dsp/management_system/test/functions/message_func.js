/*
 * @file message_func.js
 * @description functions for testing of message module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.18
 * @version 0.0.1 
 */
 
'use strict';
var MODULENAME = 'message_func';

//model
var mMsgListModel = require('../../model/msg_list').create();
var mMsgNotifyLogModel = require('../../model/msg_notify_log').create();
var mSmsModel = require('../../model/sms_log').create();

//util
var mDataHelper = require('../../../utils/data_helper');
var mLogger = require('../../../utils/logger')(MODULENAME);

function insertIntoMsgList(param, cb){
    var msg_id = mDataHelper.createId(MODULENAME);

    var value = {
        msg_id: msg_id,
        categories: param.categories || 0,
        subcategories: param.subcategories || 1,
        title: param.title || 'title1',
        content: param.content || 'content1',
    };
    var query = {
        fields: value,
        values: [value],
    };

    mMsgListModel.create(query, function(err, rows){
        if(err) cb(err);
        else {
            insertIntoNotifyMsgLog({
                mgr_id : param.mgr_id,
                msg_id : msg_id
            }, function(err, id){
                cb(err, { msg_id : msg_id, notify_id : id });
            });
        }
    });
}

function insertIntoNotifyMsgLog(param, cb){
    var id = mDataHelper.createId(MODULENAME);
    
    var value = {
        id: id,
        msg_id: param.msg_id,
        receiver: param.mgr_id+'',
        notify_status: 1
    };
    var query = {
        fields: value,
        values: [value],
    };

    mMsgNotifyLogModel.create(query, function(err, rows){
        cb(err, id);
    });
}

var msg_del = function(param, cb){
    if(param.msg_id) mMsgListModel.remove({ match : { msg_id : param.msg_id } }, function(err){
        if(param.notify_id) mMsgNotifyLogModel.remove({ match : { id : param.notify_id } }, function(err2){
            cb(err || err2);
        });
        else cb(err);
    });
    else cb();
}

var getSmsCode = function(mobile, cb){
    var select = {
        smscode: '',
    };
    var match = {
        mobile: mobile,
    };
    var query = {
        select: select,
        match: match,
    };

    mSmsModel.lookup(query, function(err, rows) {
        if(!rows || rows.length==0) cb('no record of the mobile number!');
        else cb(err, rows[0].smscode);
    });
};

module.exports.msg_add = insertIntoMsgList;
module.exports.msg_del = msg_del;
module.exports.get_smscode = getSmsCode;