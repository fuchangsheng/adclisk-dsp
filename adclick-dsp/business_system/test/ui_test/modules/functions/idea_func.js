/*
 * @file idea_func.js
 * @description functions for caeses of idea module
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

var add_idea = function(param, cb){
    // expect(param.idea_name).to.exist;
    // var idea_name = param.idea_name;
    // var plan_name = param.plan_name;
    // var bid = (param.bid === null || param.bid === undefined) ? 1 : param.bid;
    // var bid_type = param.bid_type;
    // var control = param.control;
    // var err_input = param.err_input;
    var client = webdriverio.remote(options);
    client
        .init()
        .url(adclick_url)
        .waitForExist('#sidenav > a:nth-child(3)', 2000)
        .click('#sidenav > a:nth-child(3)')
        // .waitForExist('#tabs > ul > li:nth-child(3) > a', 2000)
        // .click('#tabs > ul > li:nth-child(3) > a')
        // .waitForExist('#create-idea', 2000)
        // .click('#create-idea')
        // .waitForVisible('#view-type-btn-group > input:nth-child(2)', 2000)
        // .click('#view-type-btn-group > input:nth-child(2)')
        // .click('#slot');
        .waitForExist('#tabs > ul > li:nth-child(2) > a', 2000)
        .click('#tabs > ul > li:nth-child(2) > a')
        .waitForExist('#create-unit', 2000)
        .click('#create-unit')
        .waitForVisible('#input-bid-type > div > input:nth-child(2)', 2000)
        .getHTML('#input-bid-type > div > input:nth-child(2)')
        .then(function(text){
            console.log(text);
        })
        .click('#input-bid-type > div > input:nth-child(2)')
        // .click('#view-type-btn-group > input:nth-child(2)')
        // .click('#slot');
}

add_idea();