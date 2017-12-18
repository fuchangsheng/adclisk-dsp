/*
 * @file  AdSelectBaseClient.js
 * @description ad select http client API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Andy.zhou
 * @date 2017.5.12
 * @version 0.1.1 
 */
'use strict';
var MODULENAME = 'AdSelectBaseClient.logic';

//bce js sdk 
var bce_sdk_js = require('bce-sdk-js');
var HttpClient = bce_sdk_js.HttpClient;
var Auth =  bce_sdk_js.Auth;



//system modules
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Q = require('q');
var u = require('underscore');

//
var H = require('./ad_headers');
var config = require('./ad_config')

var mLogger = require('../../utils/logger')(MODULENAME);

/**
 * BceBaseClient
 *
 * @constructor
 * @param {Object} clientConfig The ad select client configuration.
 * @param {string} serviceId The service id.
 * @param {boolean=} regionSupported The service supported region or not.
 */
function AdBaseClient(clientConfig, serviceId, regionSupported) {
    EventEmitter.call(this);

    this.config = u.extend({}, config.DEFAULT_CONFIG, clientConfig||{});
    this.serviceId = serviceId;
    this.regionSupported = !!regionSupported;

    this.config.endpoint = this._computeEndpoint();
    
    //mLogger.debug('This http client config:'+JSON.stringify(this.config));

    /**
     * @type {HttpClient}
     */
    this._httpAgent = null;
}
util.inherits(AdBaseClient, EventEmitter);

AdBaseClient.prototype._computeEndpoint = function () {
    if (this.config.endpoint) {
        return this.config.endpoint;
    }

    if (this.regionSupported) {
        return util.format('%s://%s.%s.%s',
            this.config.protocol,
            this.serviceId,
            this.config.region,
            config.DEFAULT_SERVICE_DOMAIN);
    }
    return util.format('%s://%s.%s',
        this.config.protocol,
        this.serviceId,
        config.DEFAULT_SERVICE_DOMAIN);
};

AdBaseClient.prototype.createSignature = function (credentials, httpMethod, path, params, headers) {
    return Q.fcall(function () {
        var auth = new Auth(credentials.ak, credentials.sk);
        return auth.generateAuthorization(httpMethod, path, params, headers);
    });
};

AdBaseClient.prototype.processRes = function(err, res, fn) {
    if (err) {
        return fn(err);
    }
    if(Buffer.isBuffer(res.body)){
        res.body = res.body.toString();
    }
    fn(null, res.body);
}

AdBaseClient.prototype.sendRequest = function (httpMethod, resource, varArgs, fn) {
    var client = this;

    var defaultArgs = {
        body: null,
        headers: {},
        params: {},
        config: {},
        outputStream: null
    };

    //set the default header for high QPS
    defaultArgs.headers[H.CONNECTION] = 'Keep-Alive';

    var args = u.extend(defaultArgs, varArgs);

    var config = u.extend({}, client.config, args.config);
    if (config.sessionToken) {
        args.headers[H.SESSION_TOKEN] = config.sessionToken;
    }

    if(fn) {
        client.sendHTTPRequest(httpMethod, resource, args, config)
        .then(function(res){
            client.processRes(null, res, fn);
        })
        .catch(function(fail){
            mLogger.error('failed to call sendRequest: %j', fail);
            client.processRes(fail, res, fn);
        });
    }else {
        return client.sendHTTPRequest(httpMethod, resource, args, config);
    }
};

AdBaseClient.prototype.sendHTTPRequest = function (httpMethod, resource, args, config) {
    var client = this;
    var agent = client._httpAgent = new HttpClient(config);
    u.each(['progress', 'error', 'abort'], function (eventName) {
        agent.on(eventName, function (evt) {
            client.emit(eventName, evt);
        });
    });

    return client._httpAgent.sendRequest(httpMethod, resource, args.body,
        args.headers, args.params, u.bind(client.createSignature, client),
        args.outputStream
    );
};

module.exports = AdBaseClient;
