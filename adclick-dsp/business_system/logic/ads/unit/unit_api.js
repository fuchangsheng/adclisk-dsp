
'use strict'
var express = require('express');
var router = express.Router();

//interface

var api_ads_unit_target_detail = require('./ads_unit_target_detail');
router.use(api_ads_unit_target_detail.router);

var api_ads_unit_target_edit = require('./ads_unit_target_edit');
router.use(api_ads_unit_target_edit.router);

module.exports.router = router;