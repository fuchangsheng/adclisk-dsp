/*
 * @file  finacial_api.js
 * @description dsp finacial account apis
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1
 */
'use strict';
var express = require('express');
var router = express.Router();

// faccount
var api_faccount_balance_view = require('./faccount_balance_view');
router.use(api_faccount_balance_view.router);

var api_faccount_invoice_avaiable = require('./faccount_invoice_avaiable');
router.use(api_faccount_invoice_avaiable.router);

var api_faccount_invoice_records = require('./faccount_invoice_records');
router.use(api_faccount_invoice_records.router);

var api_faccount_invoice_request = require('./faccount_invoice_request');
router.use(api_faccount_invoice_request.router);

var api_faccount_op_records = require('./faccount_op_records');
router.use(api_faccount_op_records.router);

var api_faccount_invoice_sign = require('./faccount_invoice_sign');
router.use(api_faccount_invoice_sign.router);

// invoice
var api_faccount_invoice_records = require('./faccount_invoice_add');
router.use(api_faccount_invoice_records.router);

var api_faccount_invoice_request = require('./faccount_invoice_del');
router.use(api_faccount_invoice_request.router);

var api_faccount_op_records = require('./faccount_invoice_edit');
router.use(api_faccount_op_records.router);

var api_faccount_invoice_sign = require('./faccount_invoice_list');
router.use(api_faccount_invoice_sign.router);

// pay
var api_pay = require('./pay/pay_api');
router.use(api_pay.router);

// cost
var api_faccount_cost_list = require('./faccount_cost_list');
router.use(api_faccount_cost_list.router);

module.exports.router = router;