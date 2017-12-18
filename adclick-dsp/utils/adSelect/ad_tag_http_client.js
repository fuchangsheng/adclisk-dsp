/*
 * @file  ad_tag_http_client.js
 * @description ad product and tag http client API and logic
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

var AdTagUrls = require('./ad_urls').ADTAGS;

var mLogger = require('../../utils/logger');

var adConfig = require('./ad_config').AD_SELECT_CONFIG;


function AdTagHttpClient(clientConfig) {
    AdBaseClient.call(this, clientConfig, 'ad', true);
}

util.inherits(AdTagHttpClient, AdBaseClient);

AdTagHttpClient.prototype._sendPostRequest = function(ad_options, url, fn) {
    var options = ad_options || {};
    var body = options.data || options.body|| {};

    var config = u.extend(adConfig, options.config||{});

    return this.sendRequest('POST', url, {
        body: JSON.stringify(body),
        config: config 
    }, fn);
}

//post upload ad
AdTagHttpClient.prototype.uploadAd = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdTagUrls.upload_ad, fn);
};


// post delete ad
AdTagHttpClient.prototype.deleteAd = function(ad_options, fn) {
     return this._sendPostRequest(ad_options, AdTagUrls.delete_ad, fn);
};

//post list ads
AdTagHttpClient.prototype.listAd = function(ad_options, fn){
    return this._sendPostRequest(ad_options, AdTagUrls.list_ad, fn);
};

 //post query ad tags
AdTagHttpClient.prototype.queryAd = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdTagUrls.query_ad, fn);
};

//post upload all tags
AdTagHttpClient.prototype.uploadAllTag = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdTagUrls.upload_all_tag, fn);
}

//post add tag
AdTagHttpClient.prototype.addTag = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdTagUrls.add_tag, fn);
}

  //post list all tag
AdTagHttpClient.prototype.listTag = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdTagUrls.list_tag, fn);
}

    //post list all tag
AdTagHttpClient.prototype.deleteTag = function(ad_options, fn) {
    return this._sendPostRequest(ad_options, AdTagUrls.delete_tag, fn);
}
module.exports = AdTagHttpClient;