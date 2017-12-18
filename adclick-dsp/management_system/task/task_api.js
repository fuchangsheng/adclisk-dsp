/*
 * @file  task_api.js
 * @description task API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2017.03.15
 * @version 1.5
 */
'use strict';
var TaskManager = require('./task_manager');
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.minute = [0,5,10,15,20,25,30,35,40,45,55];

var task_mgtv_idea_query = require('./mgtv_idea_query.task');
TaskManager.attach(rule, task_mgtv_idea_query.taskCallback);

// var task_bes_idea_query = require('./bes_idea_query.task');
// TaskManager.attach(rule, task_bes_idea_query.taskCallback);

// var task_bes_user_query = require('./bes_user_query.task');
// TaskManager.attach(rule, task_bes_user_query.taskCallback);