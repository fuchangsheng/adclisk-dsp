/*
 * @file  administrator.test.js
 * @description test the interfaces of administrator model
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2017/1/9
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'administrator.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

// dataModels
var mAdminModel = require('../../model/management_admin').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../common/utils');

//model
var admin_add = require('../model/administrator/admin_add.test').create();
var admin_list = require('../model/administrator/admin_list.test').create();
var admin_info = require('../model/administrator/admin_info.test').create();
var admin_delete = require('../model/administrator/admin_delete.test').create();
var admin_update = require('../model/administrator/admin_update.test').create();

var msg;

msg = 'to test interfaces of administrator module.';
mLogger.debug('try '+msg);

var remove_admin = function(data, cb){
    mAdminModel.remove({ match : { name : data } }, function(err, rows){
        if(err) throw err;
        cb(rows);
    });
};

var get_admin = function(data, cb){
    mAdminModel.lookup({ match : { name : data }, select : { id : 1 } }, function(err, rows){
        if(err) throw err;
        cb(rows[0]);
    });
};

describe('admin module', function(){
    it(admin_add.description, function(done){
        var admin_add = require('../model/administrator/admin_add.test').create();
        var name = mUtils.createRandomTestName(null, 4);
        admin_add.param.name = name;
        admin_add.test({}, function(data){
            remove_admin(name, function(data){ done(); });
        });
    });

    it(admin_delete.description, function(done){
        var admin_add = require('../model/administrator/admin_add.test').create();
        var id;
        var name = mUtils.createRandomTestName(null, 4);
        admin_add.param.name = name;
        mAsync.waterfall([
            function(next){
                admin_delete.test({}, [
                    function(cb){
                        admin_add.test({}, function(data){
                            get_admin(name, function(data){
                                admin_delete.param.target_mgr_id = data.id;
                                id = data.id;
                                cb();
                            });
                        });
                    },
                    function(data){
                        next(null, null);
                    }
                ]);
            }
        ], function(err, info){
            if(id) remove_admin(name, function(data){
                if(err) throw err;
                done();
            });
            else{
                if(err) throw err;
                done();
            }
        });
    });

    it(admin_update.description, function(done){
        var admin_add = require('../model/administrator/admin_add.test').create();
        var id;
        var name = mUtils.createRandomTestName(null, 4);
        admin_add.param.name = name;
        mAsync.waterfall([
            function(next){
                admin_update.test({}, [
                    function(cb){
                        admin_add.test({}, function(data){
                            get_admin(name, function(data){
                                admin_update.param.target_mgr_id = data.id;
                                id = data.id;
                                cb();
                            });
                        });
                    },
                    function(data){
                        next(null, null);
                    }
                ]);
            }
        ], function(err, info){
            if(id) remove_admin(name, function(data){
                if(err) throw err;
                done();
            });
            else{
                if(err) throw err;
                done();
            }
        });
    });

    it(admin_info.description, function(done){
        admin_info.test({}, function(data){
            done();
        });
    });

    it(admin_list.description, function(done){
        admin_list.test({}, function(data){
            done();
        });
    });
});