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

//util
var mDataHelper = require('../../../utils/data_helper');
var mLogger = require('../../../utils/logger')(MODULENAME);

var add_msg = function(param, cb){
    var msg_id = mDataHelper.createId(MODULENAME);

    var value = {
        msg_id: msg_id,
        user_id: param.user_id,
        categories: param.categories || 0,
        subcategories: param.subcategories || 1,
        title: param.title || 'title',
        content: param.content || 'content',
    };
    var query = {
        fields: value,
        values: [value],
    };

    mMsgListModel.create(query, function(err, rows){
        if(err){
            cb(err);
        }else{
            var id = mDataHelper.createId(MODULENAME);
            var value = {
                id: id,
                msg_id: msg_id,
                user_id: param.user_id,
                receiver: param.oper_id+'',
                notify_status: 1
            };
            var query = {
                fields: value,
                values: [value],
            };
            mMsgNotifyLogModel.create(query, function(err, rows){
                cb(err, { msg_id : msg_id, notify_id : id });
            });
        }
    });
}

var del_msg = function(param, cb){
    mMsgListModel.remove({ match:{ msg_id : param.msg_id } }, function(err){
        if(err) cb(err);
        else {
            mMsgNotifyLogModel.remove({ match : { id : param.notify_id } }, function(err){
                cb(err);
            });
        }
    });
}

module.exports.add_msg = add_msg;
module.exports.del_msg = del_msg;