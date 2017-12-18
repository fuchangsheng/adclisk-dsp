/*
 * @file  coast_api.js
 * @description coast apis info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.22
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_cost_overview_adx = require('./cost_overview_adx');
router.use(api_cost_overview_adx.router);

var api_cost_detail_adx = require('./cost_detail_adx');
router.use(api_cost_detail_adx.router);

module.exports.router = router;