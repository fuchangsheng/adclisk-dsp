/*
 * @file plan_func.js
 * @description functions for caeses of plan module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.12
 * @version 0.0.1 
 */
'use strict';

var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var ADCLICK_URL = require('../../common/constants').ADCLICK_URL;
var ADS_STATUS = require('../../common/constants').ADS_STATUS;
var options = { desiredCapabilities: { browserName: 'chrome' } };

var add_plan = function(param, cb){
    var plan_name = param.name;
    var budget = (param.budget === null || param.budget === undefined) ? 1 : param.budget;
    var period = param.period;
    var err_input = param.err_input;
    var dul = param.dul;

    var client = webdriverio.remote(options);
    client
        .init()
        .url(ADCLICK_URL)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        .waitForExist('#create-plan', 2000)
        .click('#create-plan')
        .waitForVisible('#input-plan-name', 2000)
        .setValue('#input-plan-name', plan_name)
        .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(3)')
        .click('body > div:nth-child(17) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
        .click('body > div:nth-child(17) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(1)')
        .click('body > div:nth-child(17) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
        .then(function(){
            if(period === 'empty') return;
            if(period === 'wrong') {
                return client
                    .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(3) > div > span:nth-child(3)')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(1)')
                    .click('body > div:nth-child(18) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
            }
            else {
                return client
                    .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(3) > div > span:nth-child(3)')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(2)')
                    .click('body > div:nth-child(18) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
            }
        })
        .setValue('#input-budget', budget)
        .click('#plan-form-modal-body > form > div:nth-child(4) > div > div > div:nth-child(3) > div > button:nth-child(3)')
        .click('#submit-plan-form')
        .then(function(){
            if(!err_input) {
                client
                    .refresh()
                    .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                    .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                        expect(text).to.equal(plan_name);
                    })
                    .end().then(function(data){
                        console.log('success to create plan with name: '+plan_name);
                        cb();
                    })
                    .catch(function(err){
                        cb(err);
                    });
            } else {
                client
                    .waitForVisible('#err-msg', 2000)
                    .getText('#err-msg').then(function(text){
                        expect(text).to.not.equal('');
                    })
                    .then(function(){
                        if(!dul) {
                            client
                                .click('#modal-plan-form > div > div > div.modal-footer > button.btn.btn-default.btn-sm')
                                .refresh()
                                .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                                .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                                    expect(text).to.not.equal(plan_name);
                                })
                                .end().then(function(data){
                                    cb();
                                })
                                .catch(function(err){
                                    cb(err);
                                });
                        } else {
                            client
                                .end().then(function(data){
                                    cb();
                                })
                                .catch(function(err){
                                    cb(err);
                                });
                        }
                    })
                    .catch(function(err){
                        cb(err);
                    });
            }
        })
        .catch(function(err){
            cb(err);
        });
};

var del_plan = function(name, cb){
    var client = webdriverio.remote(options);
    client
        .init()
        .url(ADCLICK_URL)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
            expect(text).to.equal(name);
        })
        .click('#plan-list > tbody > tr:nth-child(1) > td:nth-child(6) > button:nth-child(2)')
        .alertAccept()
        .refresh()
        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
            expect(text).to.not.equal(name);
        })
        .end().then(function(data){
            console.log('success to delete plan with name: '+name);
            cb();
        })
        .catch(function(err){
            cb(err);
        });
};

var change_status = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        var plan_name = Math.random().toString(36).substr(2, 6);
        it('change status of a plan of name: '+plan_name, function(done){
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                } else {
                    var client = webdriverio.remote(options);
                    var checked;
                    client
                        .init()
                        .url(ADCLICK_URL)
                        .waitForExist('#sidenav > a:nth-child(3)', 2000)
                        .click('#sidenav > a:nth-child(3)')
                        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                        .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                            expect(text).to.equal(plan_name);
                        })
                        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > input[type="checkbox"]', 2000)
                        .getAttribute('#plan-list > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > input[type="checkbox"]', 'checked').then(function(param){
                            checked = param;
                        })
                        .click('#plan-list > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > span.bootstrap-switch-label')
                        .refresh()
                        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > input[type="checkbox"]', 2000)
                        .getAttribute('#plan-list > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > input[type="checkbox"]', 'checked').then(function(param){
                            if(checked) expect(param).to.equal(ADS_STATUS.OFF);
                            else expect(param).to.equal(ADS_STATUS.ON);
                        })
                        .end().then(function(data){
                            console.log('success to change status of the plan with name: '+plan_name);
                            del_plan(plan_name, function(err){
                                done(err);
                                cb();
                            });
                        })
                        .catch(function(err){
                            del_plan(plan_name, function(err2){
                                if(err2) console.error(err2);
                                done(err);
                                cb();
                            });
                        });
                }
            });
        });
    });
};

var edit_plan = function(param, cb){
    expect(param.name_p).to.exist;
    var edit_plan_name = (param.name_e === null || param.name_e === undefined) ? Math.random().toString(36).substr(2, 6) : param.name_e;
    var plan_name = param.name_p;
    var budget = (param.budget === null || param.budget === undefined) ? 1 : param.budget;
    var period = param.period;
    var err_input = param.err_input;
    
    var client = webdriverio.remote(options);
    client
        .init()
        .url(ADCLICK_URL)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
            expect(text).to.equal(plan_name);
        })
        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(6) > button:nth-child(1)', 2000)
        .click('#plan-list > tbody > tr:nth-child(1) > td:nth-child(6) > button:nth-child(1)')
        .waitForVisible('#input-plan-name', 2000)
        .setValue('#input-plan-name', edit_plan_name)
        .then(function(){
            if(period === 'empty') {
                return client.click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(2) > span');
            }
            if(period === 'wrong') {
                return client
                    .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(3)')
                    .click('body > div:nth-child(17) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
                    .click('body > div:nth-child(17) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(1)')
                    .click('body > div:nth-child(17) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
                    .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(3) > div > span:nth-child(3)')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(1)')
                    .click('body > div:nth-child(18) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
            }
            else if(period === 'correct') {
                return client
                    .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(3)')
                    .click('body > div:nth-child(17) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
                    .click('body > div:nth-child(17) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(1)')
                    .click('body > div:nth-child(17) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
                    .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(3) > div > span:nth-child(3)')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
                    .click('body > div:nth-child(18) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(2)')
                    .click('body > div:nth-child(18) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
            }
        })
        .setValue('#input-budget', budget)
        .click('#plan-form-modal-body > form > div:nth-child(4) > div > div > div:nth-child(3) > div > button:nth-child(3)')
        .click('#submit-plan-form')
        .then(function(){
            if(!err_input) {
                client
                    .refresh()
                    .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                    .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                        expect(text).to.equal(edit_plan_name);
                    })
                    .end().then(function(data){
                        console.log('success to edit plan of name: '+plan_name+' to '+edit_plan_name);
                        cb();
                    })
                    .catch(function(err){
                        cb(err);
                    });
            } else {
                client
                    .waitForVisible('#err-msg', 2000)
                    .getText('#err-msg').then(function(text){
                        expect(text).to.not.equal('');
                    })
                    .click('#modal-plan-form > div > div > div.modal-footer > button.btn.btn-default.btn-sm')
                    .refresh()
                    .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                    .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                        expect(text).to.not.equal(edit_plan_name);
                    })
                    .end().then(function(data){
                        cb();
                    })
                    .catch(function(err){
                        cb(err);
                    });
                    // .then(function(){
                    //     if(!dul) {
                    //         client
                    //             .click('#modal-plan-form > div > div > div.modal-footer > button.btn.btn-default.btn-sm')
                    //             .refresh()
                    //             .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                    //             .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                    //                 expect(text).to.not.equal(plan_name);
                    //             })
                    //             .end().then(function(data){
                    //                 cb();
                    //             })
                    //             .catch(function(err){
                    //                 cb(err);
                    //             });
                    //     } else {
                    //         client
                    //             .end().then(function(data){
                    //                 cb();
                    //             })
                    //             .catch(function(err){
                    //                 cb(err);
                    //             });
                    //     }
                    // })
                    // .catch(function(err){
                    //     cb(err);
                    // });
            }
        })
        .catch(function(err){
            cb(err);
        });
        // .waitForVisible('#input-plan-name', 2000)
        // .setValue('#input-plan-name', edit_plan_name)
        // .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(3)')
        // .click('body > div:nth-child(17) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
        // .click('body > div:nth-child(17) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(1)')
        // .click('body > div:nth-child(17) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
        // .click('#plan-form-modal-body > form > div:nth-child(2) > div:nth-child(3) > div > span:nth-child(3)')
        // .click('body > div:nth-child(18) > div.datetimepicker-days > table > thead > tr:nth-child(1) > th.next')
        // .click('body > div:nth-child(18) > div.datetimepicker-days > table > tbody > tr:nth-child(2) > td:nth-child(2)')
        // .click('body > div:nth-child(18) > div.datetimepicker-hours > table > tbody > tr > td > span:nth-child(1)')
        // .setValue('#input-budget', 1)
        // .click('#plan-form-modal-body > form > div:nth-child(4) > div > div > div:nth-child(3) > div > button:nth-child(3)')
        // .click('#submit-plan-form')
        // .refresh()
        // // .waitForExist('#plan-list > tfoot > tr > td > nav > ul > li:last-child > a', 2000)
        // // .click('#plan-list > tfoot > tr > td > nav > ul > li:last-child > a')
        // .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        // .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
        //     expect(text).to.equal(edit_plan_name);
        // })
        // .end().then(function(data){
        //     console.log('success to edit the plan with name: '+plan_name);
        //     cb();
        // })
        // .catch(function(err){
        //     cb(err);
        // });
};

var err_edit = function(param, cb){
    expect(param.name_p).to.exist;
    // expect(param.name_e).to.exist;
    var edit_plan_name = (param.name_e === null || param.name_e === undefined) ? Math.random().toString(36).substr(2, 6) : param.name_e;
    var plan_name = param.name_p;
    var budget = (param.budget === null || param.budget === undefined) ? 1 : param.budget;

    var client = webdriverio.remote(options);
    client
        .init()
        .url(ADCLICK_URL)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        // .waitForExist('#plan-list > tfoot > tr > td > nav > ul > li:last-child > a', 2000)
        // .click('#plan-list > tfoot > tr > td > nav > ul > li:last-child > a')
        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
            expect(text).to.equal(plan_name);
        })
        .waitForExist('#plan-list > tbody > tr:last-child > td:nth-child(6) > button:nth-child(1)', 2000)
        .click('#plan-list > tbody > tr:last-child > td:nth-child(6) > button:nth-child(1)')
        .waitForVisible('#input-plan-name', 2000)
        .setValue('#input-plan-name', edit_plan_name)
        .setValue('#input-budget', budget)
        .click('#submit-plan-form')
        .waitForVisible('#err-msg', 2000)
        .getText('#err-msg').then(function(text){
            expect(text).to.not.equal('');
        })
        .click('#modal-plan-form > div > div > div.modal-footer > button.btn.btn-default.btn-sm')
        .refresh()
        // .waitForExist('#plan-list > tfoot > tr > td > nav > ul > li:last-child > a', 2000)
        // .click('#plan-list > tfoot > tr > td > nav > ul > li:last-child > a')
        .waitForExist('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        .getText('#plan-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
            expect(text).to.equal(plan_name);
        })
        .end().then(function(data){
            cb();
        })
        .catch(function(err){
            cb(err);
        });
};

module.exports.add_plan = add_plan;
module.exports.del_plan = del_plan;
module.exports.edit_plan = edit_plan;
module.exports.change_status = change_status;