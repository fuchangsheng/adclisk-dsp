/*
 * @file  message_api.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.04
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_email_receiver_verify = require('./email_receiver_verify');
router.use(api_email_receiver_verify.router);

var api_internal_message_list = require('./internal_message_list');
router.use(api_internal_message_list.router);

var api_mark_read = require('./mark_read');
router.use(api_mark_read.router);

var api_msg_receiver_add = require('./msg_receiver_add');
router.use(api_msg_receiver_add.router);

var api_msg_receiver_del = require('./msg_receiver_del');
router.use(api_msg_receiver_del.router);

var api_msg_receivers_list = require('./msg_receivers_list');
router.use(api_msg_receivers_list.router);

var api_msg_unread_num = require('./msg_unread_num');
router.use(api_msg_unread_num.router);

var api_sms_receiver_verify = require('./sms_receiver_verify');
router.use(api_sms_receiver_verify.router);

module.exports.router = router;