/*
 * @file  account_recharge_log.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author fuchangsheng
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict'
var express = require('express');
var router = express.Router();

var api_tt = require('./target_templates/target_templates_api');
router.use(api_tt.router);

var api_assets = require('./assets/assets_api');
router.use(api_assets.router);

var api_custom_audience = require('./custom_audience/custom_audience_api');
router.use(api_custom_audience.router);

var api_reports = require('./reports/reports_api');
router.use(api_reports.router);

module.exports.router = router;
