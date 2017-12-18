/*
 * @file  ads_api.js
 * @description dsp ads apis
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();


//plans 
var api_ads_plan_list = require('./ads_plan_list');
router.use(api_ads_plan_list.router);

var api_ads_plan_view = require('./ads_plan_view');
router.use(api_ads_plan_view.router);

var api_ads_plan_op = require('./ads_plan_op');
router.use(api_ads_plan_op.router);


//units
var api_ads_unit_list = require('./ads_unit_list');
router.use(api_ads_unit_list.router);

var api_ads_unit_view = require('./ads_unit_view');
router.use(api_ads_unit_view.router);

var api_ads_unit_op = require('./ads_unit_op');
router.use(api_ads_unit_op.router);

var api_ads_unit_target_detail = require('./ads_unit_target_detail');
router.use(api_ads_unit_target_detail.router);


//ideas
var api_ads_idea_list = require('./ads_idea_list');
router.use(api_ads_idea_list.router);

var api_ads_idea_view = require('./ads_idea_view');
router.use(api_ads_idea_view.router);

var api_ads_idea_op = require('./ads_idea_op');
router.use(api_ads_idea_op.router);

var api_ads_idea_audit = require('./ads_idea_audit');
router.use(api_ads_idea_audit.router);

module.exports.router = router;
