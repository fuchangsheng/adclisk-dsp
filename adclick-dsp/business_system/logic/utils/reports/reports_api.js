
'use strict'
var express = require('express');
var router = express.Router();

//interface
var api_ads_report_create = require('./ads_report_create');
router.use(api_ads_report_create.router);

var api_ads_report_del = require('./ads_report_del');
router.use(api_ads_report_del.router);

var api_ads_report_edit = require('./ads_report_edit');
router.use(api_ads_report_edit.router);

var api_ads_report_limit_edit = require('./ads_report_limit_edit');
router.use(api_ads_report_limit_edit.router);

var api_ads_report_list = require('./ads_report_list');
router.use(api_ads_report_list.router);

module.exports.router = router;