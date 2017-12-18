/*
 * @file  data_helper.js
 * @description data helper for id creator
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
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

function createPasswordSha1Data(inputs, outencoding){
    if(!Array.isArray(inputs)){
        inputs = [inputs];
    }
    var hash = mCrypto.createHash('sha1');

    hash.update(SALT);

    for (var i = 0; i < inputs.length; i++) {
        hash.update(inputs[i], 'binary');
    }

    hash.update(SALT);

    var encoding = outencoding || 'hex';
    var sign = hash.digest(encoding);
    return sign;
}

 function createUserId (options) {
    var userId = options.mobile || createId();

    return userId;
 }

function createUserTokenId(options) {
    var userId = options.userId;

    var tokenId = createSha1Data(userId);

    return tokenId;
}

function createOrderId (options) {
    var userId = options.userId;
    var sign = createSha1Data(userId);

    if(sign.length> 32){
        sign = sign.substr(0,32);
    }

    return sign;
}

function createOrderProcessId(options){
    var orderId = options.orderId;
    var userId = options.userId;
    var values  = [orderId, userId];
    
    var processId = createSha1Data(values);
    if(processId.length> 32){
        processId = processId.substr(0, 32);
    }

    return processId;
}

function createGroupId(options){
    var orderId = options.orderId;
    var chatRoomId = createSha1Data(orderId);
    if(chatRoomId.length> 32){
        chatRoomId = chatRoomId.substr(0, 32);
    }

    return chatRoomId;
}

function createGroupName(options){
    var description = options.description;

    if(description.length > 10){
        description = description.substr(0,10);
    }
    return description;
}

function createId(data ){
    var createId = data || 'createId';
    var id = createSha1Data(createId);
    if(id.length> 32){
        id = id.substr(0, 32);
    }

    return id;
}

function createNumberId(data) {
    var buf = mCrypto.randomBytes(32);
    var id = '';
    var j = 0;
    for (var i = 0; i < buf.length && j< 16; j++) {
        var data =(buf[i++] ^ buf[i++] ^ buf[i++]^ buf[i++]);
        data = data % 10;
        id += data;
    };
    return Number(id);
}

function createSMSCode(){
    var buf = mCrypto.randomBytes(32);
    var smscode = '';
    var j = 0;
    for (var i = 0; i < buf.length && j< 6; j++) {
        var data =(buf[i++] ^ buf[i++] ^ buf[i++]^ buf[i++]);
        data = data % 10;
        smscode += data;
    };
    return smscode;
}

function createParentPath(date){
    var d = new Date();
    var parentpath = date.getFullYear()+"-";
    var month = date.getMonth()+1;
    if ( month< 10) {       
        parentpath += "0" + month;
    }else{
        parentpath += month;
    }

    return parentpath;
}

function createRandomBigInt(data) {
    var id = createSha1Data(data);
    if (id.length > 13) {
        id = id.substr(0, 13);
    }

    var bigint = mBigInt(id, 16);
    return bigint;
}

function createHash(param) {
    var inputs = param.inputs || [];
    var hashName = param.hash || 'sha1';
    var encoding = param.encoding || 'hex';

    if(!Array.isArray(inputs)){
        inputs = [inputs];
    }
    var buf = mCrypto.randomBytes(64);
    var randomStr = buf.toString('utf8');

    var hash = mCrypto.createHash(hashName);

    hash.update(SALT);
    hash.update(randomStr);
    
    for (var i = 0; i < inputs.length; i++) {
        hash.update(inputs[i], 'binary');
    }

    var now = new Date();
    hash.update(now.toString());
    hash.update(SALT);

    var sign = hash.digest(encoding);
    return sign;
}

function createEmailToken(email) {
    var token = createHash({
            inputs: [email],
            hash: 'sha256',
            encoding: 'base64',
        });

    return token;
}

 module.exports.createUserId = createUserId;
 module.exports.createUserTokenId = createUserTokenId;
 module.exports.createOrderId = createOrderId;
 module.exports.createOrderProcessId = createOrderProcessId;
 module.exports.createGroupId = createGroupId;
 module.exports.createGroupName = createGroupName;
 module.exports.createId = createId;
 module.exports.createSMSCode = createSMSCode;
 module.exports.createParentPath = createParentPath;
 module.exports.createRandomBigInt = createRandomBigInt;
 module.exports.createEmailToken = createEmailToken;
 module.exports.createNumberId=createNumberId;
 module.exports.createPasswordSha1Data=createPasswordSha1Data;