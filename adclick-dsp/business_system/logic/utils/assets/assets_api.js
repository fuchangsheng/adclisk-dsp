
'use strict'
var express = require('express');
var router = express.Router();

//interface
var api_upload = require('./upload_assets');
router.use(api_upload.router);

var api_add = require('./assets_add');
router.use(api_add.router);

var api_edit = require('./assets_edit');
router.use(api_edit.router);

var api_del = require('./assets_del');
router.use(api_del.router);

var api_view = require('./assets_view');
router.use(api_view.router);

var api_search = require('./assets_search');
router.use(api_search.router);

var api_list = require('./assets_list');
router.use(api_list.router);


module.exports.router = router;