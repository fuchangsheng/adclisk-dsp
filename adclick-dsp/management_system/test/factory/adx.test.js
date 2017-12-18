/*
 * @file  adx.test.js
 * @description test the interfaces of adx model
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// database
var mAdxModel = require('../../model/adlib_adx').create();

//model
var adx_idea_list = require('../model/adx/adx_idea_list.test').create();
var adx_idea_query = require('../model/adx/adx_idea_query.test').create();
var adx_idea_submit = require('../model/adx/adx_idea_submit.test').create();
var adx_list = require('../model/adx/adx_list.test').create();
var adx_config = require('../model/adx/adx_config.test').create();
var adx_user_list = require('../model/adx/adx_user_list.test').create();
var adx_user_query = require('../model/adx/adx_user_query.test').create();
var adx_user_submit = require('../model/adx/adx_user_submit.test').create();
var adx_idea_audit_edit = require('../model/adx/adx_idea_audit_edit.test').create();

var msg;

msg = 'to test interfaces of adx module.';
mLogger.debug('try '+msg);

var adx_id = 111;

describe('adx module', function(){
    before(function(done){
        var value = {
            id : adx_id,
            name : 'test',
        };
        var query = {
            fields : value,
            values : [value,]
        };
        mAdxModel.create(query, function(err, rows){
            done(err);
        });
    });

    after(function(done){
        mAdxModel.remove({ match : { id : adx_id } }, function(err){
            done(err);
        });
    });

    it(adx_idea_list.description, function(done){
        adx_idea_list.test({}, function(data){
            done();
        });
    });

    // it(adx_idea_submit.description, function(done){
    //     adx_idea_submit.param.id = 
    //     adx_idea_submit.test({}, function(data){
    //         done();
    //     });
    // });

    // it(adx_idea_query.description, function(done){
    //     adx_idea_query.param.id = 
    //     adx_idea_query.test({}, function(data){
    //         done();
    //     });
    // });

    it(adx_list.description, function(done){
        adx_list.test({}, function(data){
            done();
        });
    });

    it(adx_config.description, function(done){
        adx_config.param.adx_id = adx_id;
        adx_config.test({}, function(data){
            done();
        });
    });

    it(adx_user_list.description, function(done){
        adx_user_list.test({}, function(data){
            done();
        });
    });

    // it(adx_user_submit.description, function(done){
    //     adx_user_submit.param.id = 
    //     adx_user_submit.test({}, function(data){
    //         done();
    //     });
    // });

    // it(adx_user_query.description, function(done){
    //     adx_user_query.param.id = 
    //     adx_user_query.test({}, function(data){
    //         done();
    //     });
    // });
});

//models
describe('adx audit edit', function(){
    var audit_idea_id;
    var mAdxAuditIdeaModel = require('../../model/adlib_audit_ideas').create();

    before(function(done) {
        var value = {
            idea_id : 0,
            unit_id : 0,
            plan_id : 0,
            adx_id : 7,
            adx_idea_id : 'd5b353f756d381edc69021f678222bad',
            audit_status : 0,
        };
        mAdxAuditIdeaModel.create({fields: value, values: [value]}, function(err, rows) {
            if(err) {
                return console.error('create date error');
            }
            mAdxAuditIdeaModel.lookup({match:value, select:{id: 1}}, function(err, rows) {
                if(err || rows.length == 0) {
                    return console.error('lookup audit idea id failed.');
                }
                audit_idea_id = rows[0].id;
                done();
            });
        });
    });

    it(adx_idea_audit_edit.description, function(done){
        adx_idea_audit_edit.test({}, [
            function(cb){
                adx_idea_audit_edit.param.id = audit_idea_id;
                cb();
            },
            function(data){
                mAdxAuditIdeaModel.remove({match : {id : audit_idea_id}}, function(err, rows) {
                    if(err) {
                        console.error('clear error');
                        return;
                    }
                    done();
                });
            }
        ]);
    });
});