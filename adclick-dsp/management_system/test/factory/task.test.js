/*
 * @file  task.test.js
 * @description test the interfaces of task model
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.02.02
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'task.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// database
var mAdxModel = require('../../model/adlib_adx').create();

//model
var task_list = require('../model/task/task_list.test').create();
var task_restart = require('../model/task/task_restart.test').create();

//models
describe('task management part', function(){
    it(task_list.description, function(done){
        task_list.test({}, function(data) {
        	done();
        });
    });

    it(task_restart.description, function(done) {
    	task_restart.test({}, [
	    	function(cb) {
	    		task_list.test({}, function(data) {
					if(data.data.list.length == 0) {
		    			return console.error('cannot find failed data in task list');
		    		}
		    		var task_id;
		    		for(var i = 0; i < data.data.size; i++) {
		    			if(data.data.list[i].status == 'FAILED') {
		    				task_id = data.data.list[i].id;
		    				break;
		    			}
		    		}
		    		task_restart.param.id = task_id;
		    		cb();
	    		});	    		
	    	},
	    	function(data) {
	    		done();
	    	}
    	]);
    });
});