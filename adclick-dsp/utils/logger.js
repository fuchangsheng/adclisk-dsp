/*
 * @file  logger.js
 * @description dsp logger and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';

var log4js = require('log4js');
var path = __dirname +'/../conf/log4js.json';
var Debbuger = require('debug');

log4js.configure(path, 
     { reloadSecs: 300
     });

var logger= log4js.getLogger('console');
//module.exports = log4js.getLogger('console');


var Logger = function(options) {
    if (!(this instanceof Logger)) return new Logger(options);

    var self = this;
    self.name = '[' + options.name +']'||'[unkonwn.app]';
    //self.debug = Debbuger(self.name);
}

Logger.prototype.debug = function() {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    args.unshift(self.name);
    logger.debug.apply(logger, arguments);
};

Logger.prototype.info = function() {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    args.unshift(self.name);
    logger.info.apply(logger, args);
};

Logger.prototype.error = function(){
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    args.unshift(self.name);
    logger.error.apply(logger, args);
}

module.exports = function(name){
    return Logger({name:name});
}
