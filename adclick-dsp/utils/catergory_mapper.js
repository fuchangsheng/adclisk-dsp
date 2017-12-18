/*
 * @file  catergory_mapper.js
 * @description catergory mapper for system
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.19
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'catergory_mapper.utils';

//system modules
var mMoment = require('moment');
var mIs = require('is_js');
var mFs = require('fs');

//data model


var mLogger = require('./logger')(MODULENAME);


//common constants
var ADCONSTANTS = require('../common/adConstants');
var ERRCODE = require('../common/errCode');

var CATERGORY = [
    {
        code: 0,
        name: '',
        subs: [
            {
                code: 0,
                name: '',
            }
        ]
    }
];

function formatCategories(categories) {
    return categories;
}

function formatSubCategories(categories) {
    return categories;
}

function verifyCategories(categories) {
    return true;
}

function verifySubCategories(categories) {
    return true;
}

function parseCategories(code) {
    return code;
}

function parseSubCategories(code) {
    return code;
}


module.exports.formatCategories = formatCategories;
module.exports.formatSubCategories = formatSubCategories;
module.exports.verifyCategories = verifyCategories;
module.exports.verifySubCategories = verifySubCategories;
module.exports.parseCategories = parseCategories;
module.exports.parseSubCategories = parseSubCategories;