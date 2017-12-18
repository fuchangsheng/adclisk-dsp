/*
 * @file  message_generator_api.js
 * @description message notify API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.3.0
 */
'use strict';
var MODULENAME = 'message_generator_api.task';

//system modules
var mMoment = require('moment');
var mAsync = require('async');

var TaskManager = require('./../task_manager');


var balance_3days_check = require('./balance_3days_check');
TaskManager.attach('0 0 0 * * *', balance_3days_check.processCheckCallback);

var balance_500_check = require('./balance_500_check');
TaskManager.attach('0 0 * * * *', balance_500_check.processCheckCallback);

var idea_audit_nopass_check = require('./idea_audit_nopass_check');
TaskManager.attach('0 0 * * * *', idea_audit_nopass_check.processCheckCallback);

var nobalance_check = require('./nobalance_check');
TaskManager.attach('0 0 * * * *', nobalance_check.processCheckCallback);

var plan_expire_check = require('./plan_expire_check');
TaskManager.attach('0 0 0 * * *', plan_expire_check.processCheckCallback);

var recharge_done_check = require('./recharge_done_check');
TaskManager.attach('0 */10 * * * *', recharge_done_check.processCheckCallback);

var account_daily_limit_check = require('./account_to_day_limit_check');
TaskManager.attach('0 0 * * * *', account_daily_limit_check.processCheckCallback);
TaskManager.attach('0 31 23 * * *', account_daily_limit_check.resetStatus);