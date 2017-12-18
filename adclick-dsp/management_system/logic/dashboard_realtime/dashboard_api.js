/*
 * @file dashboard_api.js
 * @auth fu
 * 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_dashboard_realtime_user = require('./dashboard_realtime_user');
router.use(api_dashboard_realtime_user.router);

var api_dashboard_realtime_user_download = require('./dashboard_realtime_user_download');
router.use(api_dashboard_realtime_user_download.router);

var api_dashboard_realtime_adx = require('./dashboard_realtime_adx');
router.use(api_dashboard_realtime_adx.router);

var api_dashboard_realtime_adx_download = require('./dashboard_realtime_adx_download');
router.use(api_dashboard_realtime_adx_download.router);

var api_dashboard_realtime_all = require('./dashboard_realtime_all');
router.use(api_dashboard_realtime_all.router);

var api_dashboard_realtime_all_download = require('./dashboard_realtime_all_download');
router.use(api_dashboard_realtime_all_download.router);

var api_dashboard_query = require('./dashboard_query');
router.use(api_dashboard_query.router);

var api_dashboard_address_list = require('./dashboard_address_list');
router.use(api_dashboard_address_list.router);

module.exports.router = router;