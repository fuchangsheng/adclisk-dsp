/*
 * @file  finance_recharge_api.js
 * @description dsp management finance management api
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.11.30
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_faccount_balance_view = require('./faccount_balance_view');
router.use(api_faccount_balance_view.router);

var api_faccount_invoice_avaiable = require('./faccount_invoice_avaiable');
router.use(api_faccount_invoice_avaiable.router);

var api_faccount_invoice_records = require('./faccount_invoice_records');
router.use(api_faccount_invoice_records.router);

var api_faccount_invoice_request_audit = require('./faccount_invoice_request_audit');
router.use(api_faccount_invoice_request_audit.router);

var api_faccount_invoice_request_delivery = require('./faccount_invoice_request_delivery');
router.use(api_faccount_invoice_request_delivery.router);

var api_faccount_invoice_request_finish = require('./faccount_invoice_request_finish');
router.use(api_faccount_invoice_request_finish.router);

var api_faccount_invoice_request_process = require('./faccount_invoice_request_process');
router.use(api_faccount_invoice_request_process.router);

var api_faccount_op_records = require('./faccount_op_records');
router.use(api_faccount_op_records.router);

var api_faccount_recharge_update = require('./faccount_recharge_update');
router.use(api_faccount_recharge_update.router);

var api_faccount_vrecharge = require('./faccount_vrecharge');
router.use(api_faccount_vrecharge.router);


module.exports.router = router;