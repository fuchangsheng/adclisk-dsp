/*
 * @file  verify_api.js
 * @description dsp user verify model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.11.29
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_email_verify = require('./email_verify');
router.use(api_email_verify.router);

module.exports.router = router;