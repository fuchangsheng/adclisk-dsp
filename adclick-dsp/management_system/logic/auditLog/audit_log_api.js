/*
 * @file  audit_log_api.js
 * @description dsp aduit log info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.05
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_audit_log_manager_list = require('./audit_log_manager_list');
router.use(api_audit_log_manager_list.router);

module.exports.router = router;