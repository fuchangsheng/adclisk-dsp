/*
 * @file  ad_opt_http_client.js
 * @description ad opt http client API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Andy.zhou
 * @date 2017.5.12
 * @version 0.1.1 
 */
 'use strict';
var MODULENAME = 'AdBaseClient.logic';

//system modules
var util = require('util');

var u = require('underscore');

//local modules
var AdBaseClient  = require('./ad_base_http_client');

var AdOptUrls = require('./ad_urls').ADOPTS;

var mLogger = require('../../utils/logger');

var adConfig = require('./ad_config').AD_SELECT_CONFIG;


function AdOptHttpClient(clientConfig) {
    AdBaseClient.call(this, clientConfig, 'ad-opt', true);
}

util.inherits(AdOptHttpClient, AdBaseClient);


AdOptHttpClient.prototype._sendPostRequest = function(ad_options, url, fn) {
    var options = ad_options || {};
    var body = options.data || options.body || {};

    var config = u.extend(adConfig, options.config||{});

    return this.sendRequest('POST', url, {
        body: JSON.stringify(body),
        config: config 
    }, fn);
}


//post select ads 
AdOptHttpClient.prototype.selectAd = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdOptUrls.select_ad, fn);
};

//post select batch 
AdOptHttpClient.prototype.selectBatch = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdOptUrls.select_batch, fn);
}

//post query user sum by ad
AdOptHttpClient.prototype.queryAdUserSum = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdOptUrls.query_ad_user_sum, fn);
}

//post query user sum by tag
AdOptHttpClient.prototype.queryTagUserSum = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdOptUrls.query_tag_user_sum, fn);
}

//post query tag update time
AdOptHttpClient.prototype.queryTagUpdateTime = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdOptUrls.query_tag_update_time, fn);
}

module.exports = AdOptHttpClient;