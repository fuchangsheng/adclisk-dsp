/*
 * @file  task_api.js
 * @description task apis info data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.20
 * @version 1.1.0 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_task_list = require('./task_list');
router.use(api_task_list.router);

var api_task_restart = require('./task_restart');
router.use(api_task_restart.router);

module.exports.router = router;