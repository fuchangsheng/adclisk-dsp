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

var api_account_records = require('./account_records');
router.use(api_account_records.router);

var api_audit_operate_log = require('./audit_operate_log');
router.use(api_audit_operate_log.router);

var api_plan_records = require('./plan_records');
router.use(api_plan_records.router);

var api_unit_records = require('./unit_records');
router.use(api_unit_records.router);

var api_idea_records = require('./idea_records');
router.use(api_idea_records.router);

module.exports.router = router;