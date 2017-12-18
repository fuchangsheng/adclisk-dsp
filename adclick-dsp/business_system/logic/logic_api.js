/*
 * @file  logic_api.js
 * @description dsp logic helper model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'logic_api.logic';
var LOGICDEBUG = require('debug')(MODULENAME);

var mLogger = require('../../utils/logger')(MODULENAME);
var mMime = require('mime');
var mFs = require('fs');

//common
var ADCONSTANTS = require('../../common/adConstants');
var ERRCODE = require('../../common/errCode');
var CONFIG = require('../../common/config');

//auditlog
var mAduitLog = require('./auditLog/audit_record');

var LogicApi = module.exports = function(options){
    if (!(this instanceof LogicApi)) return new LogicApi(options);

    var self = this;
    self.debug = options.debug || LOGICDEBUG;
    self.refModel = options.refModel;
    self.moduleName = options.moduleName || options.modulename;
    self.processRequest = options.processRequest;
}

LogicApi.prototype.validate = function (options) {
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var inputModel = options.inputModel;

    if (!inputModel) {
        return false;
    }

    for (var k in refModel) {
        //check existence
        if(!(k in inputModel)){
            var optional = refModel[k].optional || false;
            if (!optional) {
                mLogger.error(' no filed: '+k);
                return false;               
            }
        }

        var refData = refModel[k].data;
        var refRangeCheck = refModel[k].rangeCheck;
        var inputData = inputModel[k];
        
        if((typeof refData ==='number') && !isNaN(inputData)) {
            inputData = inputModel[k] = Number(inputData);
        }

        //check type
        if(inputData && !((typeof refData) === (typeof inputData))) {
            mLogger.error(' invalid filed: '+k);
            mLogger.error(' invalid refModel: '+ refData);
            mLogger.error(' invalid inputModel: '+ inputData);
            return false;
        }

        if((inputData !== undefined)&&refRangeCheck){
            if( ! refRangeCheck(inputData)) {
                mLogger.error(' invalid data range: '+ k);
                return false;
            }
        }
    };

    return true;
}

LogicApi.prototype.responseAlipay = function(options) {
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);

    try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed: %j', message);
                
                res.end('fail');
            }else {
                mLogger.debug('Alipay notify success!');
                res.end('success');
            }
            // record aduit log
            mAduitLog.record(moduleName, param, err, data||{});
        });
    }catch(e){
        mLogger.error(" responseAlipay:" +e);               
        res.end('fail');
    }
}

LogicApi.prototype.responseHtml = function(options) {
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);

    if (CONFIG.CROSSENABLE) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    var json = {};

    // try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed: %j', message);
                
                json.code = code; //0-success, 1-fail, 2-timeout, 3-need login
                json.message = message;
                json.data = {};
                res.json(json);
            }else {
                mLogger.info('Call success, response file!');
                res.setHeader('Content-type', 'text/html');
                res.end(data.content);
            }
        });
    // }catch(e){
    //     mLogger.error(" responeHtml:" +e);              
    //     json.code = 404; //0-success, 1-fail, 2-timeout, 3-need login
    //     json.message = e.toString();
    //     json.data = {};
    //     res.json(json);
    // }
}

LogicApi.prototype.responseFile = function(options) {
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);
    if (CONFIG.CROSSENABLE) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    var json = {};

    try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed: %j', message);
                
                json.code = code; //0-success, 1-fail, 2-timeout, 3-need login
                json.message = message;
                json.data = {};
                res.json(json);
            }else {
                mLogger.info('Call success, response file!');
                mFs.readFile(ADCONSTANTS.SERVER.DOWNLOAD+data.filename, function(err, content) {
                    if (err) {
                        res.writeHead(400, {'Content-type':'text/html'})
                        mLogger.error(err);
                        res.end("No such file");  
                    }else {
                        var mimetype = mMime.lookup(data.filename);
                        res.setHeader('Content-disposition', 'attachment; filename=' + data.filename);
                        res.setHeader('Content-type', mimetype);
                        res.end(content);
                    }
                });
            }
        });
    }catch(e){
        mLogger.error(" responseFile:" +e);             
        json.code = 404; //0-success, 1-fail, 2-timeout, 3-need login
        json.message = e.toString();
        json.data = {};
        res.json(json);
    }
    
}

LogicApi.prototype.responseRaw = function(options){
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);
    if (CONFIG.CROSSENABLE) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    var json = {};

    try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed: %j', message);
                
                json.code = code; //0-success, 1-fail, 2-timeout, 3-need login
                json.message = message;
                json.data = {};
                res.json(json);
            }else {
                mLogger.info('Call success, response Raw!');
                res.end(data);
            }
        });
    }catch(e){
        mLogger.error(" responseRaw:" +e);              
        json.code = 404; //0-success, 1-fail, 2-timeout, 3-need login
        json.message = e.toString();
        json.data = {};
        res.json(json);
    }
}

LogicApi.prototype.responseWechatQuery = function(options) {
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);
    
    var json = {};

    try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed:', message);
                
                json.code = code; //0-success, 1-fail, 2-timeout, 3-need login
                json.message = message;
                json.data = {};
                res.json(json);
            }else {
                mLogger.debug('Data process success: ', data);
                if (data.redirect) {
                    res.statusCode = 302; 
                    res.setHeader("Location", data.html);
                    res.end();
                }else{
                    json.code = 0;
                    json.message = '';
                    json.data = data || {}; //accept the empty data
                    res.json(json);
                }
            }
            // record aduit log
            mAduitLog.record(moduleName, param, err, data||{});
        });
    }catch(e){
        mLogger.error( "responseRedirect:" +e);             
        json.code = 404; //0-success, 1-fail, 2-timeout, 3-need login
        json.message = e.toString();
        json.data = {};
        res.json(json);
    }
}

LogicApi.prototype.responseRedirect = function(options) {
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);
    
    var json = {};

    try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed:', message);
                
                json.code = code; //0-success, 1-fail, 2-timeout, 3-need login
                json.message = message;
                json.data = {};
                res.json(json);
            }else {
                mLogger.debug('Data process success: ', data);
                res.statusCode = 302; 
                res.setHeader("Location", data.html);
                res.end();
            }
            // record aduit log
            mAduitLog.record(moduleName, param, err, data||{});
        });
    }catch(e){
        mLogger.error( "responseRedirect:" +e);             
        json.code = 404; //0-success, 1-fail, 2-timeout, 3-need login
        json.message = e.toString();
        json.data = {};
        res.json(json);
    }
}

LogicApi.prototype.processSesstion = function(options) {
     var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    if (CONFIG.CROSSENABLE) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);

    var json = {};

    try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed:', message);
                
                json.code = code; //0-success, 1-fail, 2-timeout, 3-need login
                json.message = message;
                json.data = {};
            }else {
                mLogger.debug('Data process success: ', data);
               
                if (data.auth) {
                    req.session.auth = true;
                    req.session.userInfo = {
                        user_id: data.auth.user_id,
                        oper_id: data.auth.oper_id,
                        role: data.auth.role,
                        permissions: data.auth.permissions,
                        audit_status: data.audit_status,
                        user_name: data.auth.user_name,
                    }
                }else {
                    req.session.auth = false;
                    req.session.userInfo = null;
                    //res.statusCode = 302;
                    //res.setHeader("Location", ADCONSTANTS.DEFAULTPAGE);
                    //res.end();
                    //return;
                }
                
                json.code = 0;
                json.message = '';
                json.data = data || {}; //accept the empty data
            }

            res.json(json);
            // record aduit log
            mAduitLog.record(moduleName, param, err, data||{});
        });

    }catch(e){
        mLogger.error( "responseHttp:" +e);             
        json.code = 404; //0-success, 1-fail, 2-timeout, 3-need login
        json.message = e.toString();
        json.data = {};
        res.json(json);
    }
}

LogicApi.prototype.responseHttp = function (options) {
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var res = options.res;
    var req = options.req;
    var next = options.next;
    var processRequest = options.processRequest;
    var param = options.param;

    if (CONFIG.CROSSENABLE) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    debug( ' req.headers:%j', req.headers);
    debug( ' req.cookies:%j', req.cookies);
    debug( ' req.session:%j', req.session);
    debug( ' req.param:%j', param);

    var json = {};

    try {
        //1.1 
        //verify the signature
        //2.
        processRequest(param, function(err, data){
            if (err) {
                var code = err.code || 1;
                var message = err.msg || err;
                mLogger.error('Data process failed:', message);
                
                json.code = code; //0-success, 1-fail, 2-timeout, 3-need login
                json.message = message;
                json.data = {};
            }else {
                mLogger.debug('Data process success: ', data);
                json.code = 0;
                json.message = '';
                json.data = data || {}; //accept the empty data
                if (req.session && req.session.userInfo) {
                    // update session's username when username changed
                    if(moduleName == 'ad_account_info_edit.logic' && data.user_name) {
                        req.session.userInfo.user_name = data.user_name;
                    }
                    json.data.user_name = req.session.userInfo.user_name;
                }
                //for debug
                //json.data.user_name = 'dmtec';
            }

            res.json(json);
            // record aduit log
            console.log(moduleName);
            mAduitLog.record(moduleName, param, err, data||{});
        });
    }catch(e){
        mLogger.error( "responseHttp:" +e);             
        json.code = 404; //0-success, 1-fail, 2-timeout, 3-need login
        json.message = e.toString();
        json.data = {};
        res.json(json);
    }
 }

 LogicApi.prototype.createData = function(options){
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var inputData = options.inputData;

    var data = {};
    for (var k in refModel) {
        if (k in inputData) {
            var input = inputData[k];
            if (input){
                var ref = refModel[k].data || refModel[k];
                if (typeof ref === 'number') {
                    if (isNaN(input)) {
                        mLogger.error('Invalid input data with key='+k+
                            ',value='+input);
                    }else{
                        data[k] = Number(input);
                    }
                }else{
                    data[k] = input;
                }
            }else {
                data[k] = '';
            }
        }else{
            //set the default value

        }
    }
    return data;
 }

 LogicApi.prototype.parseEditData = function(options){
    var self = this;
    var debug = self.debug;
    var refModel = self.refModel;
    var moduleName = self.moduleName;

    var inputData = options.inputData;
    var editModel = options.editModel;

    var data = {};

    for (var k in editModel) {
        if (k in inputData) {
            var value = inputData[k];
            if (value && value !='') {
                var editRef = editModel[k].data || editModel[k];
                if (typeof editRef ==='number') {
                    if (isNaN(value)) {
                        mLogger.error('Invalid input data with key='+k+
                            ',value='+input);
                    }else{
                        data[k] = Number(value);
                    }
                }else {
                    data[k] = value;
                }
            }
        }
    }
    return data;
}

