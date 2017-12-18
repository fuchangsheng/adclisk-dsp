'use strict'
var express = require('express');
var router = express.Router();

//list all info about user;summary_list_daily.logic
var summary_list_daily = require('./summary_list_daily');
router.use(summary_list_daily.router);

//list matched info according to the options;summary_list_options.logic
var summary_list_options = require('./summary_list_options');
router.use(summary_list_options.router);

//Obtain user's account ;summary_user_balance.logic
var summary_user_balance = require('./summary_user_balance');
router.use(summary_user_balance.router);

//download summary file; summary_download.logic
var summary_download = require('./summary_download');
router.use(summary_download.router);

module.exports.router = router;