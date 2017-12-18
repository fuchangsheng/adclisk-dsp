
'use strict'
var express = require('express');
var router = express.Router();

//1.create ads_plan_create.logic
var api_ads_plan_create = require('./ads_plan_create');
router.use(api_ads_plan_create.router);

//2.edit ads_plan_edit.logic
var api_ads_plan_edit = require('./ads_plan_edit');
router.use(api_ads_plan_edit.router);

// //3.remove ads_plan_remove.logic
// var api_ads_plan_remove = require("./ads_plan_remove");
// router.use(api_ads_plan_remove.router);

// //4.delete ads_plan_delete.logic
var api_ads_plan_delete = require("./ads_plan_delete");
router.use(api_ads_plan_delete.router);

// //5.list  ads_plan_list.logic
// var api_ads_plan_list = require('./ads_plan_list');
// router.use(api_ads_plan_list.router);

//6.view ads_plan_view.logic
var api_ads_plan_view = require("./ads_plan_view");
router.use(api_ads_plan_view.router);

//7.change plan status;ads_plan_chstatus.logic
var api_ads_plan_chstatus = require("./ads_plan_chstatus");
router.use(api_ads_plan_chstatus.router);

// //8.copy;ads_plan_copy.logic
// var api_ads_plan_copy = require("./ads_plan_copy");
// router.use(api_ads_plan_copy.router);

// //9.options;list ad data,according to options;ads_plan_options.logic
// // var api_ads_plan_options = require("./ads_plan_options");
// // router.use(api_ads_plan_options.router);

// //10.childs;list units and ideas which belongs to ad plan
// // ads_plan_childs.logic
// var api_ads_plan_childs = require("./ads_plan_childs");
// router.use(api_ads_plan_childs.router);

//11.report

// //12.download,export file contains ad data,according to options
// var api_ads_plan_download = require("./ads_plan_download");
// router.use(api_ads_plan_download.router);

module.exports.router = router;