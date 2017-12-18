
'use strict'
var express = require('express');
var router = express.Router();

//interface
var api_ad_account_view = require('./ad_account_info_view');
router.use(api_ad_account_view.router);

var api_ad_account_edit = require('./ad_account_info_edit');
router.use(api_ad_account_edit.router);

var api_ad_account_contact_view = require('./ad_account_contact_info_view');
router.use(api_ad_account_contact_view.router);

var api_ad_account_qualification_view = require('./ad_account_qualification_view');
router.use(api_ad_account_qualification_view.router);

var api_ad_account_qualification_edit = require('./ad_account_qualification_edit');
router.use(api_ad_account_qualification_edit.router);

module.exports.router = router;