/*
 * @file  adx_api.js
 * @description adx apis info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.13
 * @version 0.0.1 
 */
'use strict';
var express = require('express');
var router = express.Router();

var api_adx_list = require('./adx_list');
router.use(api_adx_list.router);

var api_idea_list = require('./adx_idea_list');
router.use(api_idea_list.router);

var api_adx_idea_submit = require('./adx_idea_submit');
router.use(api_adx_idea_submit.router);

var api_adx_idea_audit_edit = require('./adx_idea_audit_edit');
router.use(api_adx_idea_audit_edit.router);

var api_adx_idea_query = require('./adx_idea_query');
router.use(api_adx_idea_query.router);

var api_adx_user_list = require('./adx_user_list');
router.use(api_adx_user_list.router);

var api_adx_config = require('./adx_config');
router.use(api_adx_config.router);

var api_adx_user_submit = require('./adx_user_submit');
router.use(api_adx_user_submit.router);

var api_adx_user_query = require('./adx_user_query');
router.use(api_adx_user_query.router);

var api_adx_licence_submit = require('./adx_licence_submit');
router.use(api_adx_licence_submit.router);

module.exports.router = router;