/*
 * @file dashboard_api.js
 * @auth fu
 * 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_dashboard_overview_user = require('./dashboard_overview_user');
router.use(api_dashboard_overview_user.router);

var api_dashboard_overview_user_download = require('./dashboard_overview_user_download');
router.use(api_dashboard_overview_user_download.router);

var api_dashboard_overview_adx = require('./dashboard_overview_adx');
router.use(api_dashboard_overview_adx.router);

var api_dashboard_overview_adx_download = require('./dashboard_overview_adx_download');
router.use(api_dashboard_overview_adx_download.router);

var api_dashboard_overview_all = require('./dashboard_overview_all');
router.use(api_dashboard_overview_all.router);

var api_dashboard_overview_all_download = require('./dashboard_overview_all_download');
router.use(api_dashboard_overview_all_download.router);

module.exports.router = router;