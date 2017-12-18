/*
 * @file  insert_internal_msg_test_data.js
 * @description insert test data to the database
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.11.25
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'insert_internal_msg_test_data.utils';

//system
var readline = require('readline');

//model
var mMsgListModel = require('../model/msg_list').create();
var mMsgNotifyLogModel = require('../model/msg_notify_log').create();
var mAdUserOperatorsModel = require('../model/aduser_operators').create();

//util
var mDataHelper = require('../../utils/data_helper');
var mLogger = require('../../utils/logger')(MODULENAME);

function insertIntoMsgList(user_id, categories, subcategories, title, content){
    var msg_id = mDataHelper.createId(MODULENAME);

    var value = {
        msg_id: msg_id,
        user_id: user_id,
        categories: categories,
        subcategories: subcategories,
        title: title,
        content: content,
    };
    var query = {
        fields: value,
        values: [value],
    };

    mMsgListModel.create(query, function(err, rows){
        if(err){
            mLogger.error(err.msg);
        }else{
            mLogger.info('Success insert into msglist table');
            insertIntoNotifyMsgLog(user_id, msg_id);
        }
    });
}

function insertIntoNotifyMsgLog(user_id, msg_id){
    var match = {
        user_id: user_id,
    };

    var select = {
        oper_id: '1',
    };

    var query = {
        select: select,
        match: match,
    };

    mAdUserOperatorsModel.lookup(query, function(err, rows){
        if(err){
            mLogger.error(err.msg);
        }else{
            for(var x in rows){
                actualInsertIntoNotifyMsgLog(user_id, msg_id, rows[x].oper_id)
            }
            mLogger.info('insert ' + x + ' data.');
        }
    });
}

function actualInsertIntoNotifyMsgLog(user_id, msg_id, oper_id){
    var id = mDataHelper.createId(MODULENAME);

    var value = {
        id: id,
        user_id: user_id,
        msg_id: msg_id,
        receiver: oper_id,
        notify_status: 1
    };
    var query = {
        fields: value,
        values: [value],
    };

    mMsgNotifyLogModel.create(query, function(err, rows){
        if(err){
            mLogger.error(err.msg);
        }else{
            mLogger.debug('Success insert into msg log list table');
        }
    });
}

console.info('hello, press to insert data');

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('line', function(line) {
 //   insertIntoMsgList(6, 1, 0x00, "test1", "test content 1");
 //   insertIntoMsgList(2, 2, 0x10, "test2", "test content 2");
 //   insertIntoMsgList(2, 3, 0x20, "test3", "test content 3");
    insertIntoMsgList(39003550, 4, 0x40, "test4", "test content 4");
 //   insertIntoMsgList(2, 4, 0x00, "test5", "test content 5");
}).on('close', function() {
    console.info('byte!');
    process.exit(0);
});