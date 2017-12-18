
'use strict'
var express = require('express');
var router = express.Router();

//operators
var api_ad_account_operator_add = require('./ad_account_operator_add');
router.use(api_ad_account_operator_add.router);

var api_ad_account_operator_del = require('./ad_account_operator_del');
router.use(api_ad_account_operator_del.router);

var api_ad_account_operator_edit  = require('./ad_account_operator_edit');
router.use(api_ad_account_operator_edit.router);

var api_ad_account_operator_list = require('./ad_account_operator_list');
router.use(api_ad_account_operator_list.router);

//roles
var api_ad_account_role_create = require('./ad_account_role_create');
router.use(api_ad_account_role_create.router);

var api_ad_account_role_del = require('./ad_account_role_del');
router.use(api_ad_account_role_del.router);

var api_ad_account_role_edit = require('./ad_account_role_edit');
router.use(api_ad_account_role_edit.router);

var api_ad_account_role_list = require('./ad_account_role_list');
router.use(api_ad_account_role_list.router);

var api_ad_account_role_view = require('./ad_account_role_view');
router.use(api_ad_account_role_view.router);

//interface
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

var api_msg_setting_view  = require('./msg_setting_view');
router.use(api_msg_setting_view.router);

var api_msg_setting_edit = require('./msg_setting_edit');
router.use(api_msg_setting_edit.router);

var api_msg_unread_num = require('./msg_unread_num');
router.use(api_msg_unread_num.router);

var api_sms_receiver_verify = require('./sms_receiver_verify');
router.use(api_sms_receiver_verify.router);

var api_email_request = require('./email_request');
router.use(api_email_request.router);

var msg_categories = require('./msg_categories_view');
router.use(msg_categories.router);

module.exports.router = router;