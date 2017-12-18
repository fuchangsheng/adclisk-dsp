/*
 * @file  pay_api.js
 * @description dsp pay apis
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();


var api_alipay_notify = require('./alipay_notify');
router.use(api_alipay_notify.router);

var api_alipay_return = require('./alipay_return');
router.use(api_alipay_return.router);

var api_alipay = require('./alipay');
router.use(api_alipay.router);

var api_wechat_pay = require('./wechat_pay');
router.use(api_wechat_pay.router);

var api_wechat_notify = require('./wechat_notify');
router.use(api_wechat_notify.router);

var api_wechat_pay_query = require('./wechat_pay_query');
router.use(api_wechat_pay_query.router);

var api_pay_info = require('./pay_info');
router.use(api_pay_info.router);

module.exports.router = router;