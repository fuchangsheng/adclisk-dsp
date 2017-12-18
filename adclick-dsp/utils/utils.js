/*
 * @file  utils.js
 * @description utils helper api
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'utils.utils';

//system modules
var mMoment = require('moment');
var mIs = require('is_js');
var mFs = require('fs');
var mPath = require('path');
var mCsvWriter = require('csv-write-stream');
//var mFFmpeg = require('ffuent_ffmpeg');
var mExec = require('child_process').exec;

//data model

//third-party modules
var TopClient = require('./alidayu/topClient');

var mLogger = require('./logger')(MODULENAME);


//common constants
var ADCONSTANTS = require('../common/adConstants');
var ERRCODE = require('../common/errCode');

var gAlidayu = new TopClient({
    appkey: ADCONSTANTS.APPINFO.KEY,
    appsecret: ADCONSTANTS.APPINFO.SECRET,
    REST_URL: ADCONSTANTS.APPINFO.RESTURL,
});

function isEmpty(str) {
    if(str){
        str = str.trim();
        return str.length===0;
    }else{
        return true;
    }    
}

function notEmpty(data) {
    return !isEmpty(data);
}

function isExist(data) {
    return (typeof data != 'undefined');
}

function isMobile(mobile) {
    if (isEmpty(mobile)) {
        return false;
    }

    return /^1[34578]\d{9}$/.test(mobile);
}

function isPhone(phone) {
    if (isEmpty(phone)) {
        return false;
    }
    return /^0\d{2,3}-?\d{7,8}$/.test(phone) && (phone.length>=10) && (phone.length<=13);
}

function isValidDeliveryType(type){
    return (type === 0 || type === 1); 
}

function isReportElementData(data) {
    return isNaN(data);
}

function isDeliveryStatusData(data) {
    return isNaN(data);
}

function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function verifyPassword(password) {
    if (isEmpty(password)) {
        return false;
    }

    if (password.length > ADCONSTANTS.PASSWORDMAXLEN) {
        return false;
    }

    var test = /\W+/.test(password);
    if (!test) {
        return false;
    }

    test = /\w+/.test(password);
    if (!test) {
        return false;
    }

    test = /\d+/.test(password);
    if (!test) {
        return false;
    }
    return true;
}

function sendsms(param, fn) {
    var mobile = param.mobile;
    var smscode = param.smscode;

    var data = {
        'sms_type':'normal',
        'sms_free_sign_name': ADCONSTANTS.APPINFO.NAME,
        'sms_param':{ 'smsCode': smscode },
        'rec_num': mobile,
        'sms_template_code':"SMS_13016870",
    };

    gAlidayu.execute('alibaba.aliqin.fc.sms.num.send', data, function(err, result){
        if(err) {
            var msg = ' send message error';
            mLogger.error(msg + ' : '+err);
            fn({code: ERRCODE.SMSCODE_SEND_FAILED,msg:msg});
        } else {
            fn(null);
        }       
    });
}

function sendMessageBySms(param, fn) {
    var sms_param = param.sms_param;
    var mobile = param.mobile;
    var sms_template_code = param.sms_template_code;

    var data = {
        'sms_type':'normal',
        'sms_free_sign_name': ADCONSTANTS.APPINFO.NAME,
        'sms_param':sms_param,
        'rec_num': mobile,
        'sms_template_code': sms_template_code,
    }

    gAlidayu.execute('alibaba.aliqin.fc.sms.num.send', data, function(err, result){
        if(err) {
            var msg = ' send message error';
            mLogger.error(msg + ' : '+err);
            fn({code: ERRCODE.SMSCODE_SEND_FAILED,msg:msg});
        } else {
            fn(null);
        }
    });
}

function verifyDatatime(data, format) {
    return mMoment(data, format).isValid();
}

function parseDateTime(data, format) {
    return mMoment(data, format);
}

function parseKeysWithAddPrefix(param){
    var keys = param.keys || [];
    var prefix = param.prefix;
    var model = param.model || {};

    Object.keys(model).forEach(function(k) {
        keys.push(prefix + k);
    }); 

    return keys;
}

function getInvoiceItemName(itemtype) {
    if (itemtype==1) {
        return '广告费';
    }else {
        return '服务费';
    }
}

function isValidUserId(data) {
    return data >=0;
}

function isPositiveNumber(data) {
    return data > 0;
}

function isValidAssetId(data) {
    return data >= 0;
}

function isValidMgrId(data) {
    return data >= 0;
}

function isValidPlanId(data) {
    return data >=0;
}

function  isValidUnitId(data) {
    return data>=0;
}

function  isNaturNum(data) {
    return data>=0;
}

function isValidIdeaId(data) {
    return data >=0;
}

function isValidAdxId(data){
    return data >=0;
}

function  checkIdeaSlots(data) {
    if (isEmpty(data)) {
        return false;
    }

    var slots = data.split(',');
    for (var i = 0; i < slots.length; i++) {
        if(!mIs.number( slots[i] )) {
            return false;
        }
    }
    return true;
}

function compileIdeaSlots(datas) {
    
    var slots = [];
    var marks = [];
    for (var i = 0; i < datas.length; i++) {
        var type = ADCONSTANTS.IDEASLOTTYPE.parse(datas[i].type);
        if ( (!marks[type]) && type !=-1 ) {
            marks[type] = type;
            slots.push(type);
        }
    }
    return slots.join(',');
}

function compileMatchStr(match ){
    var ca = [];
    Object.keys(match).forEach(function(k) {
        if (typeof match[k] === 'object') {
            var date = mMoment(match[k]).format('YYYY-MM-DD HH:mm:ss');
            ca.push('' + k + '=' + '\'' + date + '\'');
        } else {
            ca.push('' + k + '=' + (typeof match[k] === 'string' ? '"' + match[k] + '"' : match[k]));
        }
    });
    return ca.join(' and ');
}

function checkDashBoardDataType(data, acceptTypes) {
    if (isEmpty(data)) {
        return false;
    }

    var types = data.split(',');
    for (var i = 0; i < types.length; i++) {
        var type = ADCONSTANTS.DASHBOARDDATA.find(types[i]);
        if (!type) {
            return false;
        }

        if(! mIs.inArray(type.code, acceptTypes)) {
            return false;
        }
    }
    return true;
}

function checkSummaryOptionsType(data, acceptTypes) {
    if (isEmpty(data)) {
        return false;
    }

    var types = data.split(',');
    for (var i = 0; i < types.length; ++i) {
        var type = ADCONSTANTS.ADOPTIONALTYPE.find(types[i]);
        if (!type) {
            return false;
        }
        if (!mIs.inArray(type.code, acceptTypes)) {
            return false;
        }
    }
    return true;
}

function checkSummaryDataType(data, acceptTypes) {
    if (isEmpty(data)) {
        return false;
    }

    var types = data.split(',');
    for (var i = 0; i < types.length; ++i) {
        var type = ADCONSTANTS.SUMMARYDATA.find(types[i]);
        if (!type) {
            return false;
        }
        if (!mIs.inArray(type.code, acceptTypes)) {
            return false;
        }
    }
    return true;
}

function getSummaryENname(summaryDataType) {
    var name = '';
    switch (summaryDataType) {
        case ADCONSTANTS.SUMMARYDATA.REQUEST:
            name = 'request';
            break;
        case ADCONSTANTS.SUMMARYDATA.BID:
            name = 'bid';
            break;
        case ADCONSTANTS.SUMMARYDATA.IMP:
            name = 'imp';
            break;
        case ADCONSTANTS.SUMMARYDATA.CLICK:
            name = 'click';
            break;
        case ADCONSTANTS.SUMMARYDATA.CTR:
            name = 'ctr';
            break;
        case ADCONSTANTS.SUMMARYDATA.CPC:
            name = 'cpc';
            break;
        case ADCONSTANTS.SUMMARYDATA.CPM:
            name = 'cpm';
            break;
        case ADCONSTANTS.SUMMARYDATA.COST:
            name = 'cost';
            break;
        case ADCONSTANTS.SUMMARYDATA.ACTIVE:
            name = 'active';
            break;
        case ADCONSTANTS.SUMMARYDATA.CPA:
            name = 'cpa';
            break;
        default:
            break;
    }
    return name;
}

function getENname(dashboardDataType) {
    var name = '';
    switch(dashboardDataType) {
    case ADCONSTANTS.DASHBOARDDATA.REQUEST:
        name = 'request';
        break;
    case ADCONSTANTS.DASHBOARDDATA.BID:
        name = 'bid';
        break;
    case ADCONSTANTS.DASHBOARDDATA.IMP:
        name = 'imp';
        break;
    case ADCONSTANTS.DASHBOARDDATA.CLICK:
        name = 'click';
        break;
    case ADCONSTANTS.DASHBOARDDATA.CTR:
        name = 'ctr';
        break;
    case ADCONSTANTS.DASHBOARDDATA.CPC:
        name = 'cpc';
        break;
    case ADCONSTANTS.DASHBOARDDATA.CPM:
        name = 'cpm';
        break;
    case ADCONSTANTS.DASHBOARDDATA.COST:
        name = 'cost';
        break;
    default:
        break;
    }

    return name;
}

function getDashBoardCSVHeader(data_type) {
    var types = data_type.split(',');

    var headers = [];
    headers.push('date');
    for (var i = 0; i < types.length; i++) {
        var type = ADCONSTANTS.DASHBOARDDATA.find(types[i]);
        if (type == ADCONSTANTS.DASHBOARDDATA.ALL) {
            headers = [];
            headers.push('date');
            Object.keys(ADCONSTANTS.DASHBOARDDATA).forEach(function (k) {
                if (k != 'ALL') {
                    headers.push(getENname(ADCONSTANTS.DASHBOARDDATA[k]));
                }
            });
            break;
        }else {
            headers.push(getENname(type));
        }
    }
    return headers;
}

function getSummaryCSVHeader(data_type) {
    var types = data_type.split(',');

    var headers = [];
    headers.push('date');
    for (var i = 0; i < types.length; i++) {
        var type = ADCONSTANTS.SUMMARYDATA.find(types[i]);
        if (type == ADCONSTANTS.SUMMARYDATA.ALL) {
            headers = [];
            headers.push('date');
            Object.keys(ADCONSTANTS.SUMMARYDATA).forEach(function (k) {
                if (k != 'ALL') {
                    var name = getSummaryENname(ADCONSTANTS.SUMMARYDATA[k]);
                    if(name != ''){
                        headers.push(name);
                    }
                }
            });
            break;
        } else {
            headers.push(getSummaryENname(type));
        }
    }
    return headers;
}


function getDashBoardDataTypes(data_type) {
    var types = [];
    var dataTypes = data_type.split(',');
    for (var i = 0; i < dataTypes.length; i++) {
        var type = ADCONSTANTS.DASHBOARDDATA.find(dataTypes[i]);
        if (type) {
            types.push(type);
        }
    }
    return types;
}

function getSummaryDataTypes(data_type) {
    var types = [];
    var dataTypes = data_type.split(',');
    for (var i = 0; i < dataTypes.length; i++) {
        var type = ADCONSTANTS.SUMMARYDATA.find(dataTypes[i]);
        if (type) {
            types.push(type);
        }
    }
    return types;
}

function writeBusinessDashBoardDataToFile(data) {
    var filename = data.filename;
    var data_type = data.data_type;
    var rows = data.rows;

    var writer = mCsvWriter({headers: getDashBoardCSVHeader(data_type)});
    writer.pipe(mFs.createWriteStream(ADCONSTANTS.SERVER.DOWNLOAD+filename));

    var types = getDashBoardDataTypes(data.data_type);

    var ctr = 0;
    var cpc = 0;
    var cpm = 0;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var value  = [];
        var date = row.date;

        row.revenue = fenToYuan(row.revenue/1000);
        value.push(mMoment(date).format(ADCONSTANTS.DATATIMEFORMAT));

        for (var j = 0; j < types.length; j++) {
            var type = types[j];
            if (type == ADCONSTANTS.DASHBOARDDATA.ALL) {
                value = [];
                value.push(mMoment(date).format(ADCONSTANTS.DATATIMEFORMAT));
                value.push(row.request);
                value.push(row.bid);
                value.push(row.imp);
                value.push(row.click);
                ctr = 0;
                cpc = 0;
                cpm = 0;
                if (row.imp>0) {
                    ctr = row.click / row.imp;
                    cpm =  row.revenue * 1000 /row.imp;
                }
                if (row.click>0) {
                    cpc = row.revenue / row.click;
                }

                ctr = Number(ctr.toFixed(3));
                cpc = Number(cpc.toFixed(3));
                cpm = Number(cpm.toFixed(3));
                value.push(ctr);
                value.push(cpc);
                value.push(cpm);
                value.push(row.revenue);
                break;
            } else if (type == ADCONSTANTS.DASHBOARDDATA.REQUEST) {
                value.push(row.request);
            }  else if (type== ADCONSTANTS.DASHBOARDDATA.BID) {
                value.push(row.bid);
            } else if (type == ADCONSTANTS.DASHBOARDDATA.IMP) {
                value.push(row.imp);
            }else if (type == ADCONSTANTS.DASHBOARDDATA.CLICK) {
                value.push(row.click);
            } else if (type==ADCONSTANTS.DASHBOARDDATA.CTR) {
                ctr = 0;
                if (row.imp>0) {
                    ctr = row.click / row.imp;
                }
                ctr = Number(ctr.toFixed(3));
                value.push(ctr);
            } else if (type==ADCONSTANTS.DASHBOARDDATA.CPC) {
                cpc = 0;
                if (row.click >0) {
                    cpc = row.revenue /row.click;
                }
                cpc = Number(cpc.toFixed(3));
                value.push(cpc);
            } else if (type==ADCONSTANTS.DASHBOARDDATA.CPM) {
                cpm = 0;
                if (row.imp>0) {
                    cpm = row.revenue * 1000 / row.imp;
                }
                cpm = Number(cpm.toFixed(3));
                value.push(cpm)
            }else if (type==ADCONSTANTS.DASHBOARDDATA.COST) {
                value.push(row.revenue);
            }
        }

        writer.write(value);
    }
    writer.end();
}

function formatBusinessDashBoardData(data) {
    var rows = data.rows;
    var types = getDashBoardDataTypes(data.data_type);

    var values = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var value  = {};
        row.revenue = fenToYuan(row.revenue/1000);
        for (var j = 0; j < types.length; j++) {
            var type = types[j];
            if (type == ADCONSTANTS.DASHBOARDDATA.ALL) {
                value = { 
                    request: row.request,
                    bid: row.bid,
                    imp: row.imp,
                    click: row.click,
                    cpm: 0,
                    ctr: 0,
                    cpc: 0,
                    cost: row.revenue,
                    cvt: 0,
                };
                if(typeof row.conversion === 'number'){
                    value.conversion = row.conversion;
                }
                if (row.imp>0) {
                    value.ctr = row.click / row.imp;
                    value.cpm = row.revenue * 1000 /row.imp;
                    value.ctr = Number(value.ctr.toFixed(5));
                    value.cpm = Number(value.cpm.toFixed(3));
                }
                if (row.click>0) {
                    value.cpc = row.revenue / row.click;
                    value.cpc = Number(value.cpc.toFixed(3));
                    value.cvt = row.conversion / row.click;
                    value.cvt = Number(value.cvt.toFixed(5));
                }
                break;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.REQUEST) {
                value.request = row.request;
            }else if (type== ADCONSTANTS.DASHBOARDDATA.BID) {
                value.bid = row.bid;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.IMP) {
                value.imp = row.imp;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.CLICK) {
                value.click = row.click;
            }else if (type==ADCONSTANTS.DASHBOARDDATA.CTR) {
                value.ctr = 0;
                if (row.imp>0) {
                    value.ctr = row.click / row.imp;
                    value.ctr = Number(value.ctr.toFixed(5));
                }
            }else if (type==ADCONSTANTS.DASHBOARDDATA.CPC) {
                value.cpc = 0;
                if (row.click >0) {
                    value.cpc = row.revenue /row.click;
                    value.cpc = Number(value.cpc.toFixed(3));
                }
            }else if (type==ADCONSTANTS.DASHBOARDDATA.CPM) {
                value.cpm = 0;
                if (row.imp>0) {
                    value.cpm = row.revenue * 1000 / row.imp;
                    value.cpm = Number(value.cpm.toFixed(3));
                }
            }else if (type==ADCONSTANTS.DASHBOARDDATA.COST) {
                value.cost = row.revenue;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.CON) {
                value.conversion = row.conversion;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.CVT) {
                value.cvt = 0;
                if(row.click > 0) {
                    value.cvt = row.conversion / row.click;
                    value.cvt = Number(value.cvt.toFixed(5));
                }
            }
        }
        value.date_time = mMoment(row.date).format(ADCONSTANTS.HOURLYTIME);
        values.push(value);
    }
    return values;
}

function writeDashBoardDataToFile(data) {
    var filename = data.filename;
    var data_type = data.data_type;
    var rows = data.rows;

    var writer = mCsvWriter({headers: getDashBoardCSVHeader(data_type)});
    writer.pipe(mFs.createWriteStream(ADCONSTANTS.SERVER.DOWNLOAD+filename));

    var types = getDashBoardDataTypes(data.data_type);

    var ctr = 0;
    var cpc = 0;
    var cpm = 0;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var value  = [];
        var date = row.date;

        row.cost = fenToYuan(row.cost/1000);
        value.push(mMoment(date).format(ADCONSTANTS.DATATIMEFORMAT));

        for (var j = 0; j < types.length; j++) {
            var type = types[j];
            if (type == ADCONSTANTS.DASHBOARDDATA.ALL) {
                value = [];
                value.push(mMoment(date).format(ADCONSTANTS.DATATIMEFORMAT));
                value.push(row.request);
                value.push(row.bid);
                value.push(row.imp);
                value.push(row.click);
                ctr = 0;
                cpc = 0;
                cpm = 0;
                if (row.imp>0) {
                    ctr = row.click / row.imp;
                    cpm =  row.cost * 1000 /row.imp;
                }
                if (row.click>0) {
                    cpc = row.cost / row.click;
                }

                ctr = Number(ctr.toFixed(3));
                cpc = Number(cpc.toFixed(3));
                cpm = Number(cpm.toFixed(3));
                value.push(ctr);
                value.push(cpc);
                value.push(cpm);
                value.push(row.cost);
                break;
            } else if (type == ADCONSTANTS.DASHBOARDDATA.REQUEST) {
                value.push(row.request);
            }  else if (type== ADCONSTANTS.DASHBOARDDATA.BID) {
                value.push(row.bid);
            } else if (type == ADCONSTANTS.DASHBOARDDATA.IMP) {
                value.push(row.imp);
            }else if (type == ADCONSTANTS.DASHBOARDDATA.CLICK) {
                value.push(row.click);
            } else if (type==ADCONSTANTS.DASHBOARDDATA.CTR) {
                ctr = 0;
                if (row.imp>0) {
                    ctr = row.click / row.imp;
                }
                ctr = Number(ctr.toFixed(3));
                value.push(ctr);
            } else if (type==ADCONSTANTS.DASHBOARDDATA.CPC) {
                cpc = 0;
                if (row.click >0) {
                    cpc = row.cost /row.click;
                }
                cpc = Number(cpc.toFixed(3));
                value.push(cpc);
            } else if (type==ADCONSTANTS.DASHBOARDDATA.CPM) {
                cpm = 0;
                if (row.imp>0) {
                    cpm = row.cost * 1000 / row.imp;
                }
                cpm = Number(cpm.toFixed(3));
                value.push(cpm)
            }else if (type==ADCONSTANTS.DASHBOARDDATA.COST) {
                value.push(row.cost);
            }
        }

        writer.write(value);
    }
    writer.end();
}

function writeSummaryDataToFile(data,time_type) {
    var filename = data.filename;
    var data_type = data.data_type;
    var rows = data.rows;
    
    var time_format = ADCONSTANTS.DATATIMEFORMAT;
    if(time_type == ADCONSTANTS.DATAUNIT.UNIT_DAY.code){
        time_format = ADCONSTANTS.DATAFORMAT;
    }else if(time_type == ADCONSTANTS.DATAUNIT.UNIT_HOUR.code){
        time_format = "YYYY-MM-DD HH";
    }else if(time_type == ADCONSTANTS.DATAUNIT.UNIT_MONTH.code){
        time_format = ADCONSTANTS.MONTHLYFORMAT;
    }
    var writer = mCsvWriter({
        headers: getSummaryCSVHeader(data_type)
    });
    writer.pipe(mFs.createWriteStream(ADCONSTANTS.SERVER.DOWNLOAD + filename));

    var types = getSummaryDataTypes(data.data_type);

    var ctr = 0;
    var cpc = 0;
    var cpm = 0;
    var cpa = 0;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var value = [];
        var date = row.date;

        row.cost = fenToYuan(row.cost / 1000);
        
        value.push(mMoment(date).format(time_format));
        
        for (var j = 0; j < types.length; j++) {
            var type = types[j];
            if (type == ADCONSTANTS.SUMMARYDATA.ALL) {
                value = [];
                value.push(mMoment(date).format(ADCONSTANTS.DATAFORMAT));
                value.push(row.request);
                value.push(row.bid);
                value.push(row.imp);
                value.push(row.click);

                ctr = 0;
                cpc = 0;
                cpm = 0;
                cpa = 0;
                if (row.imp > 0) {
                    ctr = row.click / row.imp;
                    cpm = row.cost * 1000 / row.imp;
                }
                if (row.click > 0) {
                    cpc = row.cost / row.click;
                }
                if (row.active > 0) {
                    cpa = row.cost / row.active;
                }
                ctr = Number(ctr.toFixed(5));
                cpc = Number(cpc.toFixed(5));
                cpm = Number(cpm.toFixed(5));
                cpa = Number(cpa.toFixed(5));
                value.push(ctr);
                value.push(cpc);
                value.push(cpm);
                value.push(row.cost);
                value.push(row.active);
                value.push(cpa);
                break;
            } else if (type == ADCONSTANTS.SUMMARYDATA.REQUEST) {
                value.push(row.request);
            } else if (type == ADCONSTANTS.SUMMARYDATA.BID) {
                value.push(row.bid);
            } else if (type == ADCONSTANTS.SUMMARYDATA.IMP) {
                value.push(row.imp);
            } else if (type == ADCONSTANTS.SUMMARYDATA.CLICK) {
                value.push(row.click);
            } else if (type == ADCONSTANTS.SUMMARYDATA.CTR) {
                ctr = 0;
                if (row.imp > 0) {
                    ctr = row.click / row.imp;
                }
                ctr = Number(ctr.toFixed(5));
                value.push(ctr);
            } else if (type == ADCONSTANTS.SUMMARYDATA.CPC) {
                cpc = 0;
                if (row.click > 0) {
                    cpc = row.cost / row.click;
                }
                cpc = Number(cpc.toFixed(5));
                value.push(cpc);
            } else if (type == ADCONSTANTS.SUMMARYDATA.CPM) {
                cpm = 0;
                if (row.imp > 0) {
                    cpm = row.cost * 1000 / row.imp;
                }
                cpm = Number(cpm.toFixed(5));
                value.push(cpm)
            } else if (type == ADCONSTANTS.SUMMARYDATA.COST) {
                value.push(row.cost);
            } else if (type == ADCONSTANTS.SUMMARYDATA.ACTIVE) {
                value.push(row.active);
            } else if (type == ADCONSTANTS.SUMMARYDATA.CPA) {
                cpa = 0;
                if (row.active > 0) {
                    cpa = row.cost / row.active;
                }
                cpa = Number(cpa.toFixed(5));
                value.push(row.cpa);
            }
        }
        
        writer.write(value);
    }
    writer.end();
}

function formatDashBoardData(data) {
    var rows = data.rows;
    var types = getDashBoardDataTypes(data.data_type);

    var values = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var value  = {};
        row.cost = fenToYuan(row.cost/1000);
        for (var j = 0; j < types.length; j++) {
            var type = types[j];
            if (type == ADCONSTANTS.DASHBOARDDATA.ALL) {
                value = { 
                    request: row.request,
                    bid: row.bid,
                    imp: row.imp,
                    click: row.click,
                    cpm: 0,
                    ctr: 0,
                    cpc: 0,
                    cost: row.cost,
                };
                if (row.imp>0) {
                    value.ctr = row.click / row.imp;
                    value.cpm = row.cost * 1000 /row.imp;
                    value.ctr = Number(value.ctr.toFixed(5));
                    value.cpm = Number(value.cpm.toFixed(3));
                }
                if (row.click>0) {
                    value.cpc = row.cost / row.click;
                    value.cpc = Number(value.cpc.toFixed(3));
                }
                break;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.REQUEST) {
                value.request = row.request;
            }else if (type== ADCONSTANTS.DASHBOARDDATA.BID) {
                value.bid = row.bid;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.IMP) {
                value.imp = row.imp;
            }else if (type == ADCONSTANTS.DASHBOARDDATA.CLICK) {
                value.click = row.click;
            }else if (type==ADCONSTANTS.DASHBOARDDATA.CTR) {
                value.ctr = 0;
                if (row.imp>0) {
                    value.ctr = row.click / row.imp;
                    value.ctr = Number(value.ctr.toFixed(5));
                }
            }else if (type==ADCONSTANTS.DASHBOARDDATA.CPC) {
                value.cpc = 0;
                if (row.click >0) {
                    value.cpc = row.cost /row.click;
                    value.cpc = Number(value.cpc.toFixed(3));
                }
            }else if (type==ADCONSTANTS.DASHBOARDDATA.CPM) {
                value.cpm = 0;
                if (row.imp>0) {
                    value.cpm = row.cost * 1000 / row.imp;
                    value.cpm = Number(value.cpm.toFixed(3));
                }
            }else if (type==ADCONSTANTS.DASHBOARDDATA.COST) {
                value.cost = row.cost;
            }
        }
        value.date_time = mMoment(row.date).format(ADCONSTANTS.HOURLYTIME);
        values.push(value);
    }
    return values;
}

function  verifyDataUnit(data, acceptTypes) {
    var type = ADCONSTANTS.DATAUNIT.parse(data);
    return mIs.inArray(type, acceptTypes);
}

function verifySummaryOptions(data, acceptTypes) {
    var type = ADCONSTANTS.ADOPTIONALTYPE.parse(data);
    return mIs.inArray(type, acceptTypes);
}

function getClientIp(req) {
  
  var ipAddress;
  var ipstr = req.ip;
  if (req.ip) {
    var ips = req.ip.split(':');
    if (ips.length>0) {
        return ips[ips.length-1];
    }
  }
  
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

function transactionBatch(param, fn) {
    var callCollect = 0;
    var callDone = 0;
    var collectErr = null;
    var doneErr = null;
    var transactionDatas = [];
    var transactions = param.transactions;

    var batchTransactionCollection = function(err, options){
        mLogger.debug('batchTransactionCollection,count:'+callCollect);
        callCollect++;
        if (err) {
            var msg = err.msg|| err;
            mLogger.error('batchTransactionCollection:err'+msg);
            collectErr = err;
        }
        transactionDatas.push(options);
        if (callCollect==transactions.length) {
            for (var i = 0; i < transactionDatas.length; i++) {
                var option = transactionDatas[i];
                if (option.callback) {
                    option.callback(collectErr, option.data);
                }
            }
        }
    };
     
    var batchTransactionDone = function(err) {
        mLogger.debug('batchTransactionDone, count'+callDone);
        callDone++;
        if (err) {
            var msg = err.msg|| err;
            mLogger.error('batchTransactionDone:err'+msg);
            doneErr = err;
        }
        if (callDone==transactions.length) {
              fn(doneErr);
        }
    }

    for (var i = 0; i < transactions.length; i++) {
        var transaction = transactions[i];
        var data = transaction.data;
        var model = transaction.model;
        data.batchTransactionDone = batchTransactionDone;
        model.doTransactionBatch(data, batchTransactionCollection);
    }
}

function yuanToFen(amount) {
    try {
        var num = Number(amount);
        var fennum = num * 100;
        return parseInt(fennum, 10);
    }catch(e){
        mLogger.error('Failed to translate the amount to fen:'+amount);
        return -1;
    }
}

function fenToYuan(amount) {
    try{
        var num = Number(amount);
        var newNum = num / 100;
        return newNum.toFixed(2);
    }catch(e){
        mLogger.error('Failed to translate the amount to yuan:'+amount);
        return -1;
    }
}

function getBusinessDashboardUnitDayDate(list) {
    var obj = {};
    var sumdayrows = [];

    for(var i in list) {
        var datetime = mMoment(list[i].date).format('YYYY-MM-DD').valueOf();
        if(!obj[datetime]) {
            obj[datetime] = {};
            obj[datetime].date = list[i].date;
            obj[datetime].request = list[i].request;
            obj[datetime].bid = list[i].bid;
            obj[datetime].imp = list[i].imp;
            obj[datetime].click = list[i].click;
            obj[datetime].revenue = list[i].revenue;
        } else {
            obj[datetime].request += list[i].request;
            obj[datetime].bid += list[i].bid;
            obj[datetime].imp += list[i].imp;
            obj[datetime].click += list[i].click;
            obj[datetime].revenue += list[i].revenue;
        }
    }

    for(var key in obj) {
        sumdayrows.push(obj[key]);
    }

    return sumdayrows;
}

function getDateConversion(date, list){
    for(var i = 0; i < list.length; i++){
        if(list[i].date == date){
            return list[i].conversion;
        }
    }
    return 0;
}
//dashboard data with conversion
function getBusinessDashboardUnitDayDate2(list, conversion_list) {
    var obj = {};
    var sumdayrows = [];

    for(var i in list) {
        var datetime = mMoment(list[i].date).format('YYYY-MM-DD').valueOf();
        var conversion = getDateConversion(datetime, conversion_list);
        if(!obj[datetime]) {
            obj[datetime] = {};
            obj[datetime].date = list[i].date;
            obj[datetime].request = list[i].request;
            obj[datetime].bid = list[i].bid;
            obj[datetime].imp = list[i].imp;
            obj[datetime].click = list[i].click;
            obj[datetime].revenue = list[i].revenue;
            obj[datetime].conversion = conversion;
        } else {
            obj[datetime].request += list[i].request;
            obj[datetime].bid += list[i].bid;
            obj[datetime].imp += list[i].imp;
            obj[datetime].click += list[i].click;
            obj[datetime].revenue += list[i].revenue;
            obj[datetime].conversion = conversion;
        }
    }

    for(var key in obj) {
        sumdayrows.push(obj[key]);
    }

    return sumdayrows;
}

function getBusinessDashboardRealtimeDate(list) {
    var obj = {};
    var sumhourrows = [];

    for(var i in list) {
        var datetime = mMoment(list[i].date).format('YYYY-MM-DD HH').valueOf();
        if(!obj[datetime]) {
            obj[datetime] = {};
            obj[datetime].date = list[i].date;
            obj[datetime].request = list[i].request;
            obj[datetime].imp = list[i].imp;
            obj[datetime].click = list[i].click;
            obj[datetime].revenue = list[i].cost;
        } else {
            obj[datetime].request += list[i].request;
            obj[datetime].imp += list[i].imp;
            obj[datetime].click += list[i].click;
            obj[datetime].revenue += list[i].cost;
        }
    }

    for(var key in obj) {
        sumhourrows.push(obj[key]);
    }

    return sumhourrows;
}

function getDashboardUnitDayDate(list) {
    var obj = {};
    var sumdayrows = [];

    for(var i in list) {
        var datetime = mMoment(list[i].date).format('YYYY-MM-DD').valueOf();
        if(!obj[datetime]) {
            obj[datetime] = {};
            // 12-04 merged  obj[datetime].date = list[i].date;
            obj[datetime].date = datetime;
            obj[datetime].request = list[i].request;
            obj[datetime].bid = list[i].bid;
            obj[datetime].imp = list[i].imp;
            obj[datetime].click = list[i].click;
            obj[datetime].cost = list[i].cost;
        } else {
            obj[datetime].request += list[i].request;
            obj[datetime].bid += list[i].bid;
            obj[datetime].imp += list[i].imp;
            obj[datetime].click += list[i].click;
            obj[datetime].cost += list[i].cost;
        }
    }

    for(var key in obj) {
        sumdayrows.push(obj[key]);
    }
    return sumdayrows;
}

function getSummaryUnitDaily(list) {
    var obj = {};
    var sumdayrows = [];

    for (var i in list) {
        var datetime = mMoment(list[i].date).format('YYYY-MM-DD').valueOf();
        if (!obj[datetime]) {
            obj[datetime] = {};
            obj[datetime].date = list[i].date;
            obj[datetime].request = list[i].request;
            obj[datetime].bid = list[i].bid;
            obj[datetime].imp = list[i].imp;
            obj[datetime].click = list[i].click;
            obj[datetime].cost = list[i].cost;
            obj[datetime].active = list[i].active;
        } else {
            obj[datetime].request += list[i].request;
            obj[datetime].bid += list[i].bid;
            obj[datetime].imp += list[i].imp;
            obj[datetime].click += list[i].click;
            obj[datetime].cost += list[i].cost;
            obj[datetime].active = list[i].active;
        }
    }

    for (var key in obj) {
        sumdayrows.push(obj[key]);
    }
    return sumdayrows;
}

function getSummaryUnitHourly(list){
    var obj = {};
    var sumhourrows = [];

    for(var i in list){
        var datetime = mMoment(list[i].date).format('YYYY-MM-DD HH').valueOf();
        if(!obj[datetime]){
            obj[datetime] = {};
            obj[datetime].date = list[i].date;
            obj[datetime].request = list[i].request;
            obj[datetime].bid = list[i].bid;
            obj[datetime].imp = list[i].imp;
            obj[datetime].click = list[i].click;
            obj[datetime].cost = list[i].cost;
            obj[datetime].active = list[i].active;
        }else{
            obj[datetime].request += list[i].request;
            obj[datetime].bid += list[i].bid;
            obj[datetime].imp += list[i].imp;
            obj[datetime].click += list[i].click;
            obj[datetime].cost += list[i].cost;
            obj[datetime].active = list[i].active;
        }
    }

    for(var key in obj){
        sumhourrows.push(obj[key]);
    }
    return sumhourrows;
}

function getSummaryUnitMonthly(list){
    var obj = {};
    var summonthrows = [];
    
    for(var i in list){
        var datetime = mMoment(list[i].date).format('YYYY-MM').valueOf();
        if(!obj[datetime]){
            obj[datetime] = {};
            obj[datetime].date = list[i].date;
            obj[datetime].request = list[i].request;
            obj[datetime].bid = list[i].bid;
            obj[datetime].imp = list[i].imp;
            obj[datetime].click = list[i].click;
            obj[datetime].cost = list[i].cost;
            obj[datetime].active = list[i].active;
        }else{
            obj[datetime].request += list[i].request;
            obj[datetime].bid += list[i].bid;
            obj[datetime].imp += list[i].imp;
            obj[datetime].click += list[i].click;
            obj[datetime].cost += list[i].cost;
            obj[datetime].active = list[i].active;
        }
    }

    for(var key in obj){
        summonthrows.push(obj[key]);
    }
    return summonthrows;
}

function mkdirsSync(dirpath, mode) {
    if (!mFs.existsSync(dirpath)) {
        var pathtmp;
        var pathsep = (dirpath.indexOf('/')!=-1)? '/' : mPath.sep;

        dirpath.split(pathsep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = mPath.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!mFs.existsSync(pathtmp)) {
                if (!mFs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}

function createCommonDir(rootpath, pathlist) {
    var filepathlist = pathlist;

    for(var i in filepathlist) {
        var filepath = rootpath + filepathlist[i];
        mkdirsSync(filepath);
    }
}

function fileExist(path){
    try{
        console.log('The file path is:'+path);
        mFs.accessSync(path, fs.F_OK| fs.R_OK);
    }catch(e){
        return false;
    }
    return true;
}

function loadJson(path){
    try{
        var content = mFs.readFileSync(path, {encoding:'utf-8'});
        return JSON.parse(content);
    }catch(e){
        mLogger.error(e.toString());
        return null;
    }
}

function isNeedToUpdate(data, update) {
    if(typeof data != 'object' ||
        typeof update != 'object') {
        mLogger.error('type error, data = ' + (typeof data)
            + ' update = ' + (typeof update));
        return false;
    }

    for(var key in update) {
        if((typeof data[key] === 'number') && !isNaN(update[key])) {
            update[key] = Number(update[key]);
        }

        if(data[key] != update[key]) {
            if(typeof data[key] === 'object') {
                if(!mMoment(data[key]).isSame(update[key])) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }

    return false;
}

function isInCycle(cycleInfo, date, limit) {
    var week_date = mMoment(date).day();
    var hour = mMoment(date).hour();
    var minute = mMoment(date).minute();

    if(limit == 'end')
        // if less than 30 minutes left to next hour, add 1 hour more
        hour += Math.floor((minute+30)/60);
    else if(limit == 'start')
        hour += Math.floor((minute+30)/60);

    for(var i in cycleInfo.list) {
        var week_day_info = cycleInfo.list[i];
        // week check
        if(week_day_info.day.code == week_date) {
            if(limit == 'day' || !limit) {
                return true;
            }
            // hour check
            var hours = week_day_info.hours;
            for(var j in hours) {
                if(limit == 'end') {
                    if(hour > hours[j]) {
                        return true;
                    }
                } else if(limit == 'start') {
                    if(hour <= hours[j]) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function getCycleDayInfo(cycleStr) {
    var info = {
        days : 0,
        list : [],
    }

    if(typeof cycleStr != 'string' ||
        cycleStr.length != 42) {
        return info;
    }

    var days = 0;
    var bit0 = Math.pow(2, 0);
    var bit1 = Math.pow(2, 1);
    var bit2 = Math.pow(2, 2);
    var bit3 = Math.pow(2, 3);

    for(var i = ADCONSTANTS.WEEK.datas.length-1; i >=0; i--) {
        var dayCycleStr = cycleStr.substr(i*6, 6);
        var hasHourEnable = false;
        var hours = [];
        for(var j = dayCycleStr.length-1; j >= 0; j--) {
            var byte = Number('0x'+dayCycleStr[j]);
            if(byte & bit0) {
                hasHourEnable = true;
                hours.push(0 + (5-j)*4);
            }
            if(byte & bit1) {
                hasHourEnable = true;
                hours.push(1 + (5-j)*4);
            }
            if(byte & bit2) {
                hasHourEnable = true;
                hours.push(2 + (5-j)*4);
            }
            if(byte & bit3) {
                hasHourEnable = true;
                hours.push(3 + (5-j)*4);
            }
         }

         if(hasHourEnable) {
            var day = ADCONSTANTS.WEEK.datas[6-i];
            info.list.push({day: day, hours: hours});
         }
    }

    info.days = info.list.length;

    return info;
}

function getDurationDays(start_time, end_time, cycle) {
    var cycleInfo = getCycleDayInfo(cycle);
    var start = mMoment(start_time);
    var end = mMoment(end_time);
    var now = mMoment();
    if(start.isBefore(now)) {
        start = now;
    }

    var start_date = mMoment(start.format('YYYY-MM-DD'));
    var end_date = mMoment(end.format('YYYY-MM-DD'));
    var days = end_date.diff(start_date, 'days')+1;

    var start_day = start.day();
    var end_day = end.day();

    //
    var whole_weeks = 0;
    var duration_days = 0;
    if(days > 14) {
        var left_start_day = 7 - start_day;
        var left_end_day = end_day + 1;
        var whole_week_start = mMoment(start_date).add(left_start_day, 'days');
        var whole_week_end = mMoment(end_date).subtract(left_end_day, 'days');
        var whole_week_days = whole_week_end.diff(whole_week_start, 'days');
        whole_weeks = Math.ceil(whole_week_days/7);

        // start
        for(var i = 0; i < left_start_day; i++) {
            if(i == 0) {
                duration_days += (isInCycle(cycleInfo, start, 'start')?1:0);
            } else {
                var cur_date = mMoment(start_date).add(i, 'days');
                duration_days += (isInCycle(cycleInfo, cur_date)?1:0);
            }
        }
        // end
        for(var i = 0; i < left_end_day; i++) {
            if(i == 0) {
                duration_days += (isInCycle(cycleInfo, end, 'end')?1:0);
            } else {
                var cur_date = mMoment(end_date).subtract(i, 'days');
                duration_days += (isInCycle(cycleInfo, cur_date)?1:0);
            }
        }
        // whole weeks
        duration_days += cycleInfo.days * whole_weeks;
    } else {
        for(var i = 0; i < days; i++) {
            if(i == 0) {
                duration_days += (isInCycle(cycleInfo, start_time, 'start')?1:0);
            } else if(i == days - 1) {
                duration_days += (isInCycle(cycleInfo, end_time, 'end')?1:0);
            } else {
                duration_days += (isInCycle(cycleInfo, cur_date)?1:0);
            }
        }
    }

    return duration_days;
}

function generateThumbnailEx(options, cb) {
    if(!options.source || !options.folder) {
        return cb(false, 'Invalid param.');
    }

    var source = options.source;
    var pathsep = (source.indexOf('/')!=-1)? '/' : mPath.sep;
    var dst_folder = options.folder;
    var filename = source.split(pathsep).pop() + '.jpg';
    var dst_filename = dst_folder + filename;
    var size = options.size;
    var size_str = size&&size.w&&size.h?('-s '+size.w+'*'+size.h):'';
    var cmd = 'ffmpeg -i '+source+' -y -ss 1 -t 0.011 '+size_str+' '+dst_filename;

    mLogger.debug(cmd);

    mExec(cmd, function(err, stdout, stderr) {
        if(err) {
            return cb(false, err);
        }
        if(stderr) {
            return cb(true, stderr);
        }
        if(stdout) {
            return cb(true, stdout);
        }
    });
}

module.exports.isEmpty = isEmpty;
module.exports.sendsms = sendsms;
module.exports.sendMessageBySms = sendMessageBySms;
module.exports.isMobile = isMobile;
module.exports.isPhone = isPhone;
module.exports.isValidDeliveryType = isValidDeliveryType;
module.exports.isReportElementData = isReportElementData;
module.exports.isDeliveryStatusData = isDeliveryStatusData;
module.exports.isEmail = isEmail;
module.exports.verifyPassword = verifyPassword;
module.exports.verifyDatatime = verifyDatatime;
module.exports.parseKeysWithAddPrefix = parseKeysWithAddPrefix;
module.exports.notEmpty = notEmpty;
module.exports.isExist = isExist;
module.exports.getInvoiceItemName = getInvoiceItemName;
module.exports.isValidUserId = isValidUserId;
module.exports.isValidMgrId = isValidMgrId;
module.exports.isValidPlanId = isValidPlanId;
module.exports.isValidUnitId = isValidUnitId;
module.exports.isValidIdeaId = isValidIdeaId;
module.exports.isNaturNum = isNaturNum;
module.exports.isValidAssetId = isValidAssetId;
module.exports.isPositiveNumber = isPositiveNumber;
module.exports.checkIdeaSlots = checkIdeaSlots;
module.exports.compileIdeaSlots = compileIdeaSlots;
module.exports.compileMatchStr = compileMatchStr;
module.exports.parseDateTime= parseDateTime;
module.exports.checkDashBoardDataType = checkDashBoardDataType;
module.exports.checkSummaryOptionsType = checkSummaryOptionsType;
module.exports.checkSummaryDataType = checkSummaryDataType;
module.exports.writeSummaryDataToFile = writeSummaryDataToFile;
module.exports.getSummaryUnitDaily = getSummaryUnitDaily;
module.exports.getSummaryUnitHourly = getSummaryUnitHourly;
module.exports.getSummaryUnitMonthly = getSummaryUnitMonthly;
module.exports.writeBusinessDashBoardDataToFile = writeBusinessDashBoardDataToFile;
module.exports.formatBusinessDashBoardData = formatBusinessDashBoardData;
module.exports.formatDashBoardData= formatDashBoardData;
module.exports.writeDashBoardDataToFile = writeDashBoardDataToFile;
module.exports.getClientIp = getClientIp;
module.exports.verifyDataUnit = verifyDataUnit;
module.exports.transactionBatch = transactionBatch;
module.exports.yuanToFen = yuanToFen;
module.exports.fenToYuan = fenToYuan;
module.exports.getBusinessDashboardUnitDayDate = getBusinessDashboardUnitDayDate;
module.exports.getBusinessDashboardUnitDayDate2 = getBusinessDashboardUnitDayDate2;
module.exports.getBusinessDashboardRealtimeDate = getBusinessDashboardRealtimeDate;
module.exports.getDashboardUnitDayDate = getDashboardUnitDayDate;
module.exports.createCommonDir = createCommonDir;
module.exports.isValidAdxId = isValidAdxId;
module.exports.loadJson = loadJson;
module.exports.isNeedToUpdate = isNeedToUpdate;
module.exports.getCycleDayInfo = getCycleDayInfo;
module.exports.getDurationDays = getDurationDays;
module.exports.generateThumbnailEx = generateThumbnailEx;
