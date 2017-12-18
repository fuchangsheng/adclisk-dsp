/*
 * @file  account_recharge_log.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author fuchangsheng
 * @date 2017.11.27
 * @version 0.0.1 
 */
'use strict'
var express = require('express');
var router = express.Router();

var api_tt_create = require('./ads_target_template_create');
router.use(api_tt_create.router);

var api_tt_del = require('./ads_target_template_del');
router.use(api_tt_del.router);

var api_tt_edit = require('./ads_target_template_edit');
router.use(api_tt_edit.router);

var api_tt_list = require('./ads_target_template_list');
router.use(api_tt_list.router);

var api_tt_view = require('./ads_target_template_view');
router.use(api_tt_view.router);

module.exports.router = router;
