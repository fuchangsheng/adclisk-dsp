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

var api_captha_request = require('./captha_request');
router.use(api_captha_request.router);

var api_captha_request_img = require('./captha_request_img');
router.use(api_captha_request_img.router);

var api_captha_verify = require('./captha_verify');
router.use(api_captha_verify.router);

var api_login = require('./login');
router.use(api_login.router);

var api_logout = require('./logout');
router.use(api_logout.router);

module.exports.router = router;