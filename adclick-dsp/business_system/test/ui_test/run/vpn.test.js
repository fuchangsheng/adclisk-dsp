'use strict';

var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var options = { desiredCapabilities: { browserName: 'chrome' } };

var open = function(param, cb){
    expect(param.name).to.exist;
    expect(param.city).to.exist;
    var client = webdriverio.remote(options);
    client
        .init()
        .url('http://222.186.190.55:9090/')
        .waitForExist('#loginForm > div:nth-child(1) > input', 10000)
        .setValue('#loginForm > div:nth-child(1) > input', param.name)
        .setValue('#loginForm > div:nth-child(2) > input', 1)
        .click('#loginBtn')
        .waitForExist('#profileName', 10000)
        .click('#profileName')
        .click('#profileName option[value='+param.city+']')
        .click('#changeBtn').then(function(){
            client.alertAccept();
        })
        .end().then(function(data){
            cb();
        })
        .catch(function(err){
            cb(err);
        });
};

var address = [
    '广东广州电信',
    '广东广州电信2',
    '湖南长沙电信',
    '浙江杭州电信',
    '辽宁沈阳联通',
    '浙江温州电信',
    '浙江宁波电信',
    '安徽合肥电信',
    '江苏南京电信',
    '江苏无锡电信',
    '浙江绍兴电信',
    '江苏南通电信',
    '重庆电信'
];

var num = {
    count : 151,
    index : 0
};

var run = function(){
    if(num.count > 300) return;
    var name = 'sh'+(num.count++);
    var city = address[ (num.index++)%13 ];
    open({ name : name, city : city }, function(err){
        if(err) {
            console.err(err);
            return;
        }
        else run();
    });
}

run();
