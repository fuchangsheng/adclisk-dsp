/*
 * @file  task_api.js
 * @description task API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.18
 * @version 0.8
 */
'use strict';
var TaskManager = require('./task_manager');

var task_account_recharge_log_clear = require('./account_recharge_log_clear.task');
TaskManager.attach('0 0 0 * * *', task_account_recharge_log_clear.taskCallback);

var task_sms_log_clear = require('./sms_log_clear.task');
TaskManager.attach('0 0 0 * * *', task_sms_log_clear.taskCallback);

var task_verify_code_log_clear = require('./verify_code_log_clear.task');
TaskManager.attach('0 0 0 * * *', task_verify_code_log_clear.taskCallback);

// message generator
require('./message_generator/message_generator_api');