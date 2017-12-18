
'use strict'
var express = require('express');
var router = express.Router();

//interface
var account_api = require('./account/account_api');
router.use(account_api.router);

var finance_api = require('./finance/finance_api');
router.use(finance_api.router);

var system_api = require('./system/system_api');
router.use(system_api.router);


module.exports.router = router;