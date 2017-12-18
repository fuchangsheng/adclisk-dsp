/*
 * @file  aduser_api.js
 * @description ad user apis info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_aduser_account_balance_view = require('./aduser_account_balance_view');
router.use(api_aduser_account_balance_view.router);

var api_aduser_account_contact_info_view = require('./aduser_account_contact_info_view');
router.use(api_aduser_account_contact_info_view.router);

var api_aduser_account_info_view = require('./aduser_account_info_view');
router.use(api_aduser_account_info_view.router);

var api_aduser_account_invoice_list = require('./aduser_account_invoice_list');
router.use(api_aduser_account_invoice_list.router);

var api_aduser_account_slot_price_list = require('./aduser_account_slot_price_list');
router.use(api_aduser_account_slot_price_list.router);

var api_aduser_account_slot_price_op = require('./aduser_account_slot_price_op');
router.use(api_aduser_account_slot_price_op.router);

var api_aduser_account_slot_price_add = require('./aduser_account_slot_price_add');
router.use(api_aduser_account_slot_price_add.router);

var api_aduser_account_operator_list = require('./aduser_account_operator_list');
router.use(api_aduser_account_operator_list.router);

var api_aduser_account_operator_view = require('./aduser_account_operator_view');
router.use(api_aduser_account_operator_view.router);

var api_aduser_account_qualification_view = require('./aduser_account_qualification_view');
router.use(api_aduser_account_qualification_view.router);

var api_aduser_account_user_name = require('./aduser_account_user_name');
router.use(api_aduser_account_user_name.router);

var api_aduser_user_audit = require('./aduser_user_audit');
router.use(api_aduser_user_audit.router);


var api_aduser_user_invoice_audit = require('./aduser_user_invoice_audit');
router.use(api_aduser_user_invoice_audit.router);

var api_aduser_user_list = require('./aduser_user_list');
router.use(api_aduser_user_list.router);

var api_aduser_user_qulification_audit = require('./aduser_user_qulification_audit');
router.use(api_aduser_user_qulification_audit.router);

var api_aduser_tag_user_sum = require('./aduser_tag_user_sum');
router.use(api_aduser_tag_user_sum.router);

var api_aduser_account_usertype = require('./aduser_account_usertype');
router.use(api_aduser_account_usertype.router);

var api_aduser_account_usertype_update = require('./aduser_account_usertype_update');
router.use(api_aduser_account_usertype_update.router);

module.exports.router = router;