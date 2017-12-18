/*
 * @file  ad_account_api.js
 * @description dsp ad account apis
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();


var api_license_upload = require('./license_upload');
router.use(api_license_upload.router);

var api_qualification_upload = require('./qualification_upload');
router.use(api_qualification_upload.router);

module.exports.router = router;