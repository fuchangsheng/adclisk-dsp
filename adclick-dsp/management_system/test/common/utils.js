/*
 * @file  tset_utils.js
 * @description utils helper api
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';

var mCrypto = require('crypto');
var SALT = 'dkjlsfajka232349a0jsiofjal23421askwe';
var mBigInt = require("big-integer");

function createSha1Data(inputs, outencoding){
    if(!Array.isArray(inputs)){
        inputs = [inputs];
    }
    var buf = mCrypto.randomBytes(64);
    var randomStr = buf.toString('utf8');

    var hash = mCrypto.createHash('sha1');

    hash.update(SALT);
    hash.update(randomStr);
    
    for (var i = 0; i < inputs.length; i++) {
        hash.update(inputs[i], 'binary');
    }

    var now = new Date();
    hash.update(now.toString());
    hash.update(SALT);

    var encoding = outencoding || 'hex';
    var sign = hash.digest(encoding);
    return sign;
}

function httpResponseCheck(format_template, checkObj) {
    if(checkObj === null || checkObj === undefined){
        console.error('!!!!! NULL PROPERTY !!!!!');
        return;
    }

    var type = (typeof format_template);

    if(Array.isArray(format_template)) {
        checkObj.should.be.a('array');
        if(checkObj.length > 0) {
            let i = 0;
            for( ; has_null_property(checkObj[i])&&(i<checkObj.length); i++);
            if(checkObj[i] === undefined) i--;
            httpResponseCheck(format_template[0], checkObj[i]);
        } else {
            console.error('!!!!! EMPTY LIST !!!!!');
            return;
        }
    } else {
        checkObj.should.be.a(type);
        if(type === 'object') {
            for(var key in format_template) {
                checkObj.should.have.property(key);
                if(checkObj[key] === null){
                    console.error('!!!!! PROPERTY '+key+' IS NULL !!!!!');
                    continue;
                }
                if(Array.isArray(checkObj[key]) && (checkObj[key].length === 0)){
                    console.error('!!!!! PROPERTY '+key+' IS EMPTY LIST !!!!!');
                    continue;
                }
                if((typeof checkObj[key]) === 'object' && Object.getOwnPropertyNames(checkObj[key]).length === 0){
                    if(key === 'data' && Object.getOwnPropertyNames(format_template[key]).length != 0){
                        console.error('!!!!! DATA IS EMPTY !!!!!');
                        for(let pro in format_template[key])
                            checkObj[key].should.have.property(pro);
                    }
                    else if(Object.getOwnPropertyNames(format_template[key]).length != 0)
                        console.error('!!!!! PROPERTY '+key+' IS EMPTY OBJECT !!!!!');
                    
                    continue;
                } 
                if(key === 'code') {
                    checkObj[key].should.equal(format_template[key]);
                }
                else httpResponseCheck(format_template[key], checkObj[key]);
            }
        }
    }
}

function has_null_property(obj){
    if(obj === null || obj === undefined)
        return true;
    if(Array.isArray(obj)){
        if(obj.length > 0){
            if(has_null_property(obj[0]))
                return true;
        }
    } else {
        var type = typeof obj;
        if(type === 'object'){
            for(let key in obj)
                if(has_null_property(obj[key]))
                    return true;
        }
    }
    return false;
}

function createRandomTestName(inputs, size) {
    var username = createSha1Data(inputs || (new Date() +''));

    if(!size) size = 8;
    if(username.length> 10){
        username = username.substr(0,size);
    }
    // username = 'test_' + username;

    return username;
}

function createRandomPhoneNum() {
    var seg = [
        134,135,136,137,138,139,147,150,151,152,
        157,158,159,170,178,182,183,184,187,188,
        130,131,132,145,152,155,156,176,185,186,
        133,134,153,177,180,181,189
    ];
    var num = '' + seg[Math.floor(Math.random()*37)];
    for(let i = 0; i < 8; i++)
        num += Math.floor(Math.random()*10);
    return num;
}

function createRandomTelephoneNum() {
    var num = '021';
    for(let i = 0; i < 8; i++)
        num += Math.floor(Math.random()*10);
    return num;
}

function createRandomEmail() {
    var email = createRandomTestName(null, 4)+'@'+createRandomTestName(null, 4)+'.com';
    return email;
}

module.exports.httpResponseCheck = httpResponseCheck;
module.exports.createRandomTestName = createRandomTestName;
module.exports.createRandomPhoneNum = createRandomPhoneNum;
module.exports.createRandomTelephoneNum = createRandomTelephoneNum;
module.exports.createRandomEmail = createRandomEmail;