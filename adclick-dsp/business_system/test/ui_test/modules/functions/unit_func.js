/*
 * @file unit_func.js
 * @description functions for caeses of unit module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.12
 * @version 0.0.1 
 */
'use strict';

var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var adclick_url = require('../../common/constants').ADCLICK_URL;
var options = { desiredCapabilities: { browserName: 'chrome' } };

var add_unit = function(param, cb){
    // expect(param.unit_name).to.exist; 
    var unit_name = param.unit_name;
    var plan_name = param.plan_name;
    var bid = (param.bid === null || param.bid === undefined) ? 1 : param.bid;
    var bid_type = param.bid_type;
    var control = param.control;
    var err_input = param.err_input;
    var client = webdriverio.remote(options);
    client
        .init()
        .url(adclick_url)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        .waitForExist('#tabs > ul > li:nth-child(2) > a', 2000)
        .click('#tabs > ul > li:nth-child(2) > a')
        .waitForExist('#create-unit', 2000)
        .click('#create-unit')
        .waitForVisible('#input-unit-name', 2000)
        .setValue('#input-unit-name', unit_name)
        .setValue('#input-unit-bid', bid)
        .then(function(){
            if(bid_type === 'CPC') return client.click('#input-bid-type > div > input:nth-child(2)');
        })
        .then(function(){
            if(control) {
                return client
                    .click('#control-on')
                    .setValue('#control-on-imp', control.imp)
                    .setValue('#control-on-click', control.click);
            }
        })
        .then(function(){
            if(plan_name) {
                return client
                    .click('#input-plan-id')
                    .waitForVisible('#unitForm > div:nth-child(2) > div:nth-child(2) > ul > li:nth-child(1)', 2000)
                    .then(function(){
                        return client.click('#unitForm > div:nth-child(2) > div:nth-child(2) > ul > li[data-value='+plan_name+']');
                    })
                    // .click('#unitForm > div:nth-child(2) > div:nth-child(2) > ul > li[data-value='+plan_name+']');
                    // .waitForVisible('#unitForm > div:nth-child(2) > div:nth-child(2) > ul > li:nth-child(1)', 2000)
                    // .click('#unitForm > div:nth-child(2) > div:nth-child(2) > ul > li:nth-child(1)');
            }
        })
        .then(function(){
            client
                .click('#submit-unit-form')
                .then(function(){
                    if(err_input){
                        client
                            .waitForVisible('#unit-form-modal-body-con', 2000)
                            .getText('#unit-form-modal-body-con')
                            .then(function(text){
                                expect(text).to.not.equal('');
                            })
                            .end().then(function(data){
                                cb();
                            })
                            .catch(function(err){
                                cb(err);
                            });
                    }
                    else {
                        client
                            .refresh()
                            .waitForExist('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                            .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                                expect(text).to.equal(unit_name);
                            })
                            .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(3)').then(function(text){
                                expect(text).to.equal(plan_name);
                            })
                            .then(function(){
                                if(bid_type === 'CPC')
                                    return client
                                        .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(5)')
                                        .then(function(text){
                                            expect(text).to.equal('CPC');
                                        });
                            })
                            .then(function(){
                                client
                                    .end().then(function(data){
                                        console.log('success to create an unit with name: '+unit_name);
                                        cb();
                                    })
                                    .catch(function(err){
                                        cb(err);
                                    });
                            })
                            .catch(function(err){
                                cb(err);
                            });
                    }
                })
                .catch(function(err){
                    cb(err);
                });
        })
        .catch(function(err){
            cb(err);
            // console.error(err);
        });
};

var del_unit = function(param, cb){
    expect(param.unit_name).to.exist;
    var unit_name = param.unit_name;
    var dul = param.dul;
    var client = webdriverio.remote(options);
    client
        .init()
        .url(adclick_url)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        .waitForExist('#tabs > ul > li:nth-child(2) > a', 2000)
        .click('#tabs > ul > li:nth-child(2) > a')
        .waitForExist('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
            expect(text).to.equal(unit_name);
        })
        .click('#unit-list > tbody > tr:nth-child(1) > td:nth-child(6) > button:nth-child(2)')
        .alertAccept()
        .then(function(){
            if(!dul){
                setTimeout(function(){
                    client
                        .refresh()
                        .waitForExist('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                        .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                            expect(text).to.not.equal(unit_name);
                        })
                        .end().then(function(data){
                            console.log('success to delete unit with name: '+unit_name);
                            cb();
                        })
                        .catch(function(err){
                            cb(err);
                        });
                }, 500);
            } else {
                client
                    .end().then(function(data){
                        console.log('success to delete unit with name: '+unit_name);
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

var edit_unit = function(param, cb){
    // expect(param.unit_name).to.exist; 
    var unit_name = param.unit_name;
    var plan_name = param.plan_name;
    var bid = (param.bid === null || param.bid === undefined) ? 1 : param.bid;
    var bid_type = param.bid_type;
    var control = param.control;
    var err_input = param.err_input;
    var client = webdriverio.remote(options);
    client
        .init()
        .url(adclick_url)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        .waitForExist('#tabs > ul > li:nth-child(2) > a', 2000)
        .click('#tabs > ul > li:nth-child(2) > a')
        .waitForExist('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
        .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
            expect(text).to.equal(unit_name);
        })
        .click('#unit-list > tbody > tr:nth-child(1) > td:nth-child(6) > button:nth-child(1)')
        .waitForVisible('#input-unit-bid', 2000)
        .setValue('#input-unit-bid', bid)
        .then(function(){
            if(bid_type === 'CPC') return client.click('#input-bid-type > div > input:nth-child(2)');
        })
        .then(function(){
            if(control) {
                return client
                    .click('#control-on')
                    .setValue('#control-on-imp', control.imp)
                    .setValue('#control-on-click', control.click);
            }
        })
        .then(function(){
            client
                .click('#submit-unit-form')
                .then(function(){
                    if(err_input){
                        client
                            .waitForVisible('#unit-form-modal-body-con', 2000)
                            .getText('#unit-form-modal-body-con')
                            .then(function(text){
                                expect(text).to.not.equal('');
                            })
                            .end().then(function(data){
                                cb();
                            })
                            .catch(function(err){
                                cb(err);
                            });
                    }
                    else {
                        client
                            .refresh()
                            .waitForExist('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)', 2000)
                            .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(1)').then(function(text){
                                expect(text).to.equal(unit_name);
                            })
                            .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(3)').then(function(text){
                                expect(text).to.equal(plan_name);
                            })
                            .then(function(){
                                if(bid_type === 'CPC')
                                    return client
                                        .getText('#unit-list > tbody > tr:nth-child(1) > td:nth-child(5)')
                                        .then(function(text){
                                            expect(text).to.equal('CPC');
                                        });
                            })
                            .then(function(){
                                client
                                    .end().then(function(data){
                                        console.log('success to edit an unit of name: '+unit_name);
                                        cb();
                                    })
                                    .catch(function(err){
                                        cb(err);
                                    });
                            })
                            .catch(function(err){
                                cb(err);
                            });
                    }
                })
                .catch(function(err){
                    cb(err);
                });
        })
        .catch(function(err){
            cb(err);
            // console.error(err);
        });
};

module.exports.add_unit = add_unit;
module.exports.del_unit = del_unit;
module.exports.edit_unit = edit_unit;