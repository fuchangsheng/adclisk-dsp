/*
 * @file  admin_logic_api.js
 * @description admin logic api
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.3
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();


var api_admin_add = require('./admin_add');
router.use(api_admin_add.router);

var api_admin_update = require('./admin_update');
router.use(api_admin_update.router);

var api_admin_delete = require('./admin_delete');
router.use(api_admin_delete.router);

var api_admin_info = require('./admin_info');
router.use(api_admin_info.router);

var api_admin_list = require('./admin_list');
router.use(api_admin_list.router);

module.exports.router = router;