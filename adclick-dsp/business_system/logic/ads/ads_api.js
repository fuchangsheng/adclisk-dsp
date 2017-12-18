
'use strict'
var express = require('express');
var router = express.Router();

//interface
var api_idea = require('./idea/idea_api');
router.use(api_idea.router);

var api_plan = require('./plan/plan_api');
router.use(api_plan.router);

var api_unit = require('./unit/unit_api');
router.use(api_unit.router);

var api_summary = require('./summary/summary_api');
router.use(api_summary.router);

module.exports.router = router;