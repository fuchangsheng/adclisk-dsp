 /*
 * @file  cdata_model.js
 * @description constant data model
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.19
 * @version 0.0.1 
 */
'use strict';

var CDataModel = module.exports = function(options) {
    if (!(this instanceof CDataModel))  return new CDataModel(options);
    
    var self = this;
    
    self.datas = [];
    Object.keys(options).forEach(function(k) {
        self.datas.push(options[k]);
        self[k] = options[k];
    });
}

CDataModel.prototype.find = function(name) {
    var self = this;
    name = name.trim();
    for (var i = 0; i < self.datas.length; i++) {
        if(self.datas[i].name===name){
            return self.datas[i];
        }
    }
    return null;
}

CDataModel.prototype.format = function(code) {
    var self = this;
    for (var i = 0; i < self.datas.length; i++) {
        if(self.datas[i].code==code){
            return self.datas[i].name;
        }
    }
    return '';
}

CDataModel.prototype.parse = function(name) {
    var self = this;
    var obj = self.find(name);
    if (obj) {
        return obj.code;
    }else {
        return -1;
    }
}
