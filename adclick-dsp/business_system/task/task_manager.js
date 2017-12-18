/*
 * @file  task_manager.js
 * @description task manager API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.10
 * @version 0.7
 * @wildcard
 *	* * * * * *
 *	┬ ┬ ┬ ┬ ┬ ┬
 *	│ │ │ │ │ |
 *	│ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
 *	│ │ │ │ └───── month (1 - 12)
 *	│ │ │ └────────── day of month (1 - 31)
 *	│ │ └─────────────── hour (0 - 23)
 *	│ └──────────────────── minute (0 - 59)
 *	└───────────────────────── second (0 - 59, OPTIONAL)
 */

'use strict';
var MODELNAME = 'task_manager.task';

//system modules
var schedule = require('node-schedule');
var mMoment = require('moment');
var ERRCODE = require('../../common/errCode');

var tasks = [];

function attach(wildcard, fn) {
	var task = schedule.scheduleJob(wildcard, fn);
	tasks.push(task);
    return task;
}

function detach(task) {
	for(var i in tasks) {
		var cur_task = tasks[i];
		if(cur_task === task) {
			cur_task.cancel();
			return true;
		}
	}

	return false;
}

module.exports.attach = attach;
module.exports.detach = detach;