/*
 * @file  account_recharge_log.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_user_register = require('./register');
router.use(api_user_register.router);

var api_sms_request = require('./sms_request');
router.use(api_sms_request.router);

var api_sms_verify = require('./sms_verify');
router.use(api_sms_verify.router);

var api_captha_request = require('./captha_request');
router.use(api_captha_request.router);

var api_captha_request_img = require('./captha_request_img');
router.use(api_captha_request_img.router);

var api_captha_verify = require('./captha_verify');
router.use(api_captha_verify.router);

var api_login = require('./login');
router.use(api_login.router);

var api_pwd_forget = require('./pwd_forget');
router.use(api_pwd_forget.router);

var api_pwd_reset = require('./pwd_reset');
router.use(api_pwd_reset.router);

var api_logout = require('./logout');
router.use(api_logout.router);

var api_check_login = require('./check_login');
router.use(api_check_login.router);

module.exports.router = router;