 /*
 * @file  TestModel.js
 * @description dsp test model info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'TestModel';

//system modules
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

//common constants
var TESTCONSTANTS = require('../common/constants');
//utils
var mTestUtils = require('../common/utils');
//utils
var mLogger = require('../../../utils/logger')(MODELNAME);

chai.use(chaiHttp);

var TestModel = module.exports = function(options) {
    if (!(this instanceof TestModel)) return new TestModel(options);

    var self = this;
    self.wantedModel = options.wantedModel;
    self.debug = options.debug;
    self.modelName = options.modelName;
    self.path = options.path;
    self.method = options.method;
    self.param = options.param;
    self.description = options.modelName + ', ' + options.description;
}

TestModel.prototype.doPost = function(param, cbs) {
    var self = this;
    var before, after;
    var doFnt = function(cb){
        chai.request(server)
            .post(param.path || self.path)
            .send(param.param || self.param)
            .end(function(err, res) {
                res.should.have.status(TESTCONSTANTS.HTTP_RESPONSE_STATUS.SUCCESS);
                res.should.be.json;
                if(res.body.code != 0) {
                    mLogger.error('res : ' + JSON.stringify(res.body));
                }
                mTestUtils.httpResponseCheck(param.wantedModel || self.wantedModel, res.body);
                if(cb) cb(res.body);
                if(after) after(res.body);
            });
    };

    if(Array.isArray(cbs)){
        before = cbs[0],
        after = cbs[1];

        if(before) before(doFnt);
        else doFnt();
    }
    else doFnt(cbs);
}

TestModel.prototype.doGet = function(param, cbs) {
    var self = this;
    var before, after;
    var doFnt = function(cb){
        chai.request(server)
            .get(param.path || self.path)
            .query(param.param || self.param)
            .end(function(err, res) {
                res.should.have.status(TESTCONSTANTS.HTTP_RESPONSE_STATUS.SUCCESS);
                res.should.be.json;
                if(res.body.code != 0) {
                    mLogger.error('res : ' + JSON.stringify(res.body));
                }
                mTestUtils.httpResponseCheck(param.wantedModel || self.wantedModel, res.body);
                if(cb) cb(res.body);
                else if(after) after(res.body);
            });
    };

    if(Array.isArray(cbs)){
        before = cbs[0],
        after = cbs[1];

        if(before) before(doFnt);
        else doFnt();
    }
    else doFnt(cbs);
}

TestModel.prototype.test = function(param, cbs) {
    var self = this;

    if(param.method === TESTCONSTANTS.HTTP_REQUEST_METHOD.POST ||
        self.method === TESTCONSTANTS.HTTP_REQUEST_METHOD.POST) {
        self.doPost(param, cbs);
    } else if(param.method === TESTCONSTANTS.HTTP_REQUEST_METHOD.GET ||
        self.method === TESTCONSTANTS.HTTP_REQUEST_METHOD.GET) {
        self.doGet(param, cbs);
    } else {

    }    
}