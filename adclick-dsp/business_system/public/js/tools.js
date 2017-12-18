/*
 * @file  tools.js
 * @description dsp tools for common js logic
 * @copyright dmtec.cn reserved, 2016
 * @author zhuyu
 * @date 2016.11.16
 * @version 0.0.1 
 */
'use strict';

/*
 * 
 */
var lrflag = false;

function ajaxCall(param, fn) {
    //we use sinterface as the interface is reserved word under 'strict' mode
    var sinterface = param.sinterface || {};
    var path = sinterface.path || '';
    var method = sinterface.method || 'GET';
    var data = param.data || {};

    console.log('ajax call param:'+JSON.stringify(param));

    if (method=='GET') {
        $.ajax({
            url: getServerURL(path),
            data: data,
            type: method, 
            success: function(resData) {
                console.log('success to call GET '+path);
                console.log('resData'+JSON.stringify(resData));

                if (resData.code==0) {
                    fn(null, resData.data);
                } else if(resData.code==10002){
                    console.log('Need login!');
                    window.location.href= '/index.html';
                } else {
                    var err = {code: resData.code, msg: resData.message};
                    console.log(resData.message);
                    fn(err);
                }               
            },
            error: function(resData) {
                var msg = 'Failed to call GET '+path;
                console.log(msg);
                var err = {code: ERRCODE.REQUESTERR, msg: msg};
                fn(err, resData);
            },
        });
    }else if (method=='POST') {
        $.ajax({
            url: getServerURL(path),
            data: JSON.stringify(data),
            method: method,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(resData) {
                console.log('success to call POST'+path);
                console.log('resData'+JSON.stringify(resData));
                if (resData.code==0) {
                    fn(null, resData.data);
                } else if(resData.code==10002){
                    console.log('Need login!');
                    window.location.href = '/index.html';
                } else {
                    var err = {code: resData.code, msg: resData.message};
                    console.log(resData.message);
                    fn(err);
                }   
            },
            error: function(resData) {
                var msg = 'Failed to call POST'+path;
                console.log(msg);
                var err = {code: ERRCODE.REQUESTERR, msg: msg};
                fn(err, resData);
            },
        });
    }else {
        console.log('Not supported method!');
    }
}

function ajaxCallPromise(param, fn) {
    // we use sinterface as the interface is reserved word under
                // 'strict' mode
    var sinterface = param.sinterface || {};
    var path = sinterface.path || '';
    var method = sinterface.method || 'GET';
    var data = param.data || {};
    var promise;

    console.log('ajax call param:' + JSON.stringify(param));

    if (method == 'GET') {
        promise = $.ajax({
            url : getServerURL(path),
            data : data,
            type : method,
            success : function(resData) {
                console.log('success to call GET ' + path);
                console.log('resData' + JSON.stringify(resData));

                if (resData.code == 0) {
                    fn(null, resData.data);
                } else if(resData.code==10002){
                    console.log('Need login!');
                    window.location.href= '/index.html';
                } else {
                    var err = {
                        code : resData.code,
                        msg : resData.message
                    };
                    console.log(resData.message);
                    fn(err);
                }
            },
            error : function(resData) {
                if (resData.responseText
                        && resData.responseText.indexOf("<!DOCTYPE html>") >= 0) {
                    alert("登录过期，请返回登录");
                    window.location.href = "/index.html"
                } else {
                    var msg = 'Failed to call GET ' + path;
                    console.log(msg);
                    var err = {
                        code : ERRCODE.REQUESTERR,
                        msg : msg
                    };
                    fn(err, resData);
                }
            },
        });
    } else if (method == 'POST') {
        promise = $.ajax({
            url : getServerURL(path),
            data : JSON.stringify(data),
            method : method,
            contentType : "application/json; charset=utf-8",
            dataType : "json",
            success : function(resData) {
                console.log('success to call POST' + path);
                console.log('resData' + JSON.stringify(resData));
                if (resData.code == 0) {
                    fn(null, resData.data);
                } else {
                    var err = {
                        code : resData.code,
                        msg : resData.message
                    };
                    console.log(resData.message);
                    fn(err);
                }
            },
            error : function(resData) {
                if (resData.responseText
                    && resData.responseText.indexOf("<!DOCTYPE html>") >= 0) {
                    alert("登录过期，请返回登录");
                    window.location.href = "/index.html"
                } else {
                    var msg = 'Failed to call POST' + path;
                    console.log(msg);
                    var err = {
                        code : ERRCODE.REQUESTERR,
                        msg : msg
                    };
                    fn(err, resData);
                }
            },
        });
    } else {
        console.log('Not supported method!');
    }
    return promise;
}

function parseJson(string) {
    var ret = null;
    try {
        ret = JSON.parse(string);
    } catch (e) {
    }
    return ret;
}

function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return null;
}

function parseURLParameter() {
    var vars = {}, hash;
    var hashes = window.location.href.slice(
            window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        // vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getServerURL(path) {
    // var url = SERVERCONF.HOST +':'+ SERVERCONF.PORT + path;
    var url = path;
    return url;
}

function getUserName(fn) {
    var user_name = '';
    if (!window.config) {
        window.config = {};
    }
    if (window.config.user_name) {
        user_name = window.config.user_name;
        console.log('Use the window cached name:' + user_name);
        return fn(null, user_name);
    }

    var param = {
        sinterface : SERVERCONF.USERS.USERNAME,
        data : {},
    };

    ajaxCall(param, function(err, data) {
        if (err) {
            fn(err);
        } else {
            user_name = window.user_name = data.user_name;
            fn(null, user_name);
        }
    });
}

function str2short(str) {
    var short = "";
    switch (str) {
    case '所有':
        short = 'all';
        break;
    case '请求(次)':
        short = "request";
        break;
    case '竞价(次)':
        short = "bid";
        break;
    case '展现量(次)':
        short = "imp";
        break;
    case '点击量(次)':
        short = "click";
        break;
    case '点击率':
        short = "ctr";
        break;
    case 'CPC(元)':
        short = "cpc";
        break;
    case 'CPM(元)':
        short = "cpm";
        break;
    case '花费(元)':
        short = "cost";
        break;
    case '转化(次)':
        short = "conversion";
        break;
    case '转化率':
        short = "cvt";
        break;
    }
    return short;
}

function num2str(num) {
    var str = "";
    switch (num) {
    case 0:
        str = "所有";
        break;
    case 1:
        str = "请求(次)";
        break;
    case 2:
        str = "竞价(次)";
        break;
    case 3:
        str = "展现量(次)";
        break;
    case 4:
        str = "点击量(次)";
        break;
    case 5:
        str = "点击率";
        break;
    case 6:
        str = "CPC(元)";
        break;
    case 7:
        str = "CPM(元)";
        break;
    case 8:
        str = "花费(元)";
        break;
    case 9:
        str = "转化(次)";
        break;
    case 10:
        str = "转化率";
        break;
    }
    return str;
}

/**
 * 
 * @param charts
 *        chartsname
 * @param lvar
 *        left condition
 * @param rvar
 *        right condition
 * @param strat_time
 * @param end_time
 * @param id
 * @param type
 * @param others
 * @returns
 */
function initChart(charts, lvar, rvar, start_time, end_time, id, type, others) {
    charts.clear();
    var option = null;
    // ajax
    var now = moment();
    var unit = null;
    var data_type = new Array();
    var param = null;
    var start_timedate = moment(start_time);
    var end_timedate = moment(end_time);
    var len = end_timedate.diff(start_timedate, 'days');
    if (len == 0) {
        unit = ADCONSTANT.DATAUNIT.UNIT_HOUR;
    } else {
        if(others == 'realtime'){
            unit = ADCONSTANT.DATAUNIT.UNIT_HOUR;
        }else{
            unit = ADCONSTANT.DATAUNIT.UNIT_DAY;
        }
    }
    var slvar = num2str(Number(lvar));
    data_type.push(slvar);
    var srvar = num2str(Number(rvar));
    data_type.push(srvar);
    data_type = data_type.join(",");
    data_type = data_type.replace(/[量]{0,1}\([\u4e00-\u9fa5]\)/g, "");
    if (type == ADCONSTANT.DASHBOARDCHOOSEID.PLAN) {
        param = {
            sinterface : SERVERCONF.DASHBOARD.PLANVIEW,
            data : {
                count : 100,
                plan_id : id,
                start_time : start_time,
                end_time : end_time,
                unit : unit,
                data_type : data_type
            }
        };
        if(others == 'realtime'){
            param.sinterface = SERVERCONF.DASHBOARD.REALTIMEPLANVIEW;
        }
    } else if (type == ADCONSTANT.DASHBOARDCHOOSEID.UNIT) {
        param = {
            sinterface : SERVERCONF.DASHBOARD.UNITVIEW,
            data : {
                unit_id : id,
                count : 100,
                start_time : start_time,
                end_time : end_time,
                unit : unit,
                data_type : data_type
            }
        };
        if(others == 'realtime'){
            param.sinterface = SERVERCONF.DASHBOARD.REALTIMEUNITVIEW;
        }
    } else if (type == ADCONSTANT.DASHBOARDCHOOSEID.IDEA) {
        param = {
            sinterface : SERVERCONF.DASHBOARD.IDEAVIEW,
            data : {
                idea_id : id,
                count : 100,
                start_time : start_time,
                end_time : end_time,
                unit : unit,
                data_type : data_type
            }
        };
        if(others == 'realtime'){
            param.sinterface = SERVERCONF.DASHBOARD.REALTIMEIDEAVIEW;
        }
    } else {
        param = {
            sinterface : SERVERCONF.DASHBOARD.ADUSERVIEW,
            data : {
                start_time : start_time,
                end_time : end_time,
                unit : unit,
                count : 100,
                data_type : data_type
            }
        };
        if(others == 'realtime'){
            param.sinterface = SERVERCONF.DASHBOARD.REALTIMEADUSERVIEW;
        }
    }
    ajaxCall(param, function(err, data) {
        if (err) {
            ecb(err);
        } else {
            scb(data);
        }
    });
    function ecb(err) {
        console.log(err.msg);

    }
    function scb(data) {
        // 指定图表的配置项和数据

        // data clear zero fill
        data=zerofill(data,unit,start_time,end_time,slvar,srvar);
        option = {
            color : [ '#444444', '#c23531' ],
            title : {},
            tooltip : {
                trigger : 'axis',
                formatter : function(params, ticket, callback) {
                    var content = "";
                    content = content || params[0].name + "<br>";
                    for (var i = 0; i < params.length; i++) {
                        var key = params[i].seriesName;
                        var val = params[i].value == undefined ? 0
                                : params[i].value;
                        if (key == ADCONSTANT.DASHBOARDDATA.CTR) {
                            content = content + key + ":"
                                    + (val * 100).toFixed(2) + "%";
                            +"<br>";
                        } else {
                            content = content + key + ":" + val + "<br>";
                        }
                    }
                    return content;
                }
            },
            legend : {
                zlevel : 5,
                itemWidth : 26,
                itemGap : 15,
                padding : 8,
                data : [ slvar, srvar ]
            },
            toolbox : {
                show : true,
                feature : {
                    dataView : {
                        readOnly : false
                    },
                    restore : {},
                    saveAsImage : {}
                },
                right : 15
            },
            dataZoom : {
                show : true,
                start : 0,
                end : 100
            },
            xAxis : [ {
                type : 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data : (function() {
                    var res = [];
                    var len = data.size;
                    for (var i = len - 1; i >= 0; i--) {
                        var date_time = data.list[i].date_time;
                        if (unit == ADCONSTANT.DATAUNIT.UNIT_HOUR) {
                            date_time = moment(date_time).format("HH:00");
                        } else {
                            date_time = moment(date_time).format("MM-DD");
                        }
                        res.unshift(date_time);
                    }
                    return res;
                })()
            } ],
            yAxis : [ {
                type : 'value',
                scale : true,
                name : slvar,
                min : 0,
                boundaryGap : [ 0.2, 0.2 ],
                axisLabel : {
                    formatter : function(value, index) {
                        if (String(value).indexOf(".") > -1) {
                            value = value.toFixed(2);
                        }
                        if (lvar == 5) {
                            value = (value * 100).toFixed(2) + "%";
                        }
                        return value;
                    }
                },
                splitLine : {
                    show : true
                },

            }, {
                type : 'value',
                name : srvar,
                splitLine : {
                    show : false
                },
                boundaryGap : [ 0.2, 0.2 ],
                axisLabel : {
                    formatter : function(value, index) {
                        if (String(value).indexOf(".") > -1) {
                            value = value.toFixed(2);
                        }
                        if (rvar == 5) {
                            value = (value * 100).toFixed(2) + "%";
                        }
                        return value;
                    }
                },
                min : 0,
                scale : true,
            } ],
            series : [ {
                name : slvar,
                type : 'line',
                yAxisIndex : 0,
                data : (function() {
                    var short = str2short(slvar);
                    var res = [];
                    var len = data.size;
                    for (var i = len - 1; i >= 0; i--) {
                        if (short in data.list[i]) {
                            var sht = data.list[i][short];
                            res.unshift(sht);
                        }
                    }
                    return res;
                })()
            }, {
                name : srvar,
                type : 'line',
                yAxisIndex : 1,
                data : (function() {
                    var short = str2short(srvar);
                    var res = [];
                    var len = data.size;
                    for (var i = len - 1; i >= 0; i--) {
                        if (short in data.list[i]) {
                            var sht = data.list[i][short];
                            res.unshift(sht);
                        }
                    }
                    return res;
                })()
            } ]
        };
        charts.setOption(option);
    }

    // 自适应
    window.onresize = charts.resize;

    // 使用刚指定的配置项和数据显示图表。
}

function initTabConfig(name, content, url) {
    for (var i = 0; i < name.length; i++) {
        var configs = new Array();
        var config = {
            "name" : name[i],
            "text" : content[i],
            "url" : url[i]
        };
        configs.push(config);
    }
    return configs;
}

/**
 * 
 * @param arr
 * @param val
 * @returns
 */
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
/**
 * 
 * @param str
 * @param len
 * @returns
 */
function limitstr(str, len) {
    if (str.length > len) {
        str = str.substring(0, len) + '...';
    }
    return str;
}
/**
 * 
 * @param Div
 *        example $('#examp')
 * @param type
 * @param msg
 * @returns
 */
function setInfoDiv(Div, type, msg) {
    if (type == "error") {
        Div.html("<div class='alert alert-danger alert-dismissible' role='alert'>"
                        + "<button type='button' class='close' data-dismiss='alert'>"
                        + "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>"
                        + "</button>"
                        + "<span>"
                        + msg
                        + "</span>" + "</div>");
    } else if (type == "info") {
        Div.html("<div class='alert alert-warning alert-dismissible' role='alert'>"
                        + "<button type='button' class='close' data-dismiss='alert'>"
                        + "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>"
                        + "</button>"
                        + "<span>"
                        + msg
                        + "</span>" + "</div>");
    } else if (type == "success") {
        Div.html("<div class='alert alert-success alert-dismissible' role='alert'>"
                        + "<button type='button' class='close' data-dismiss='alert'>"
                        + "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>"
                        + "</button>"
                        + "<span>"
                        + msg
                        + "</span>" + "</div>");
    }
}
// form validate function start
function isMobile(num) {
    return /^1[34578]\d{9}$/.test(num);// 手机号码
}

function isPhone(num) {
    return /^0\d{2,3}-?\d{7,8}$/.test(num);// 座机号码
}

function isPhone2(obj) {
    var re = /^0\d{2,3}-?\d{7,8}$/;
    if (re.test(obj.val())) {
        obj.parent().removeClass("has-error");
    } else {
        obj.parent().addClass("has-error");
    }
}

function isEmail(email) {
    var re = /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/;
    return re.test(email);
}

function isPassword(pass) {
    var re = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,16}$/;
    return re.test(pass);
}

function isMoney(num) {
    if(num == 0 || num == ""){
        return false;
    }
    var re = /^[0-9]*(\.[0-9]{1,2})?$/;
    return re.test(num);
}

function isUrl(url) {
    var re = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g;
    return re.test(url);
}

function isPInt(num) {
    var re = /^[0-9]*[1-9][0-9]*$/;
    return re.test(num);
}
// form validate function end
function dataAdd(interval, number, date) {
    number = parseInt(number);
    if (typeof (date) == "string") {
        date = date.split(/\D/);
        --date[1];
        eval("var date = new Date(" + date.join(",") + ")");
    }else if (typeof (date) == "object") {
        var date = date;
    }
    switch (interval) {
        case "y": date.setFullYear(date.getFullYear() + number); break;
        case "m": date.setMonth(date.getMonth() + number); break;
        case "d": date.setDate(date.getDate() + number); break;
        case "w": date.setDate(date.getDate() + 7 * number); break;
        case "h": date.setHours(date.getHours() + number); break;
        case "n": date.setMinutes(date.getMinutes() + number); break;
        case "s": date.setSeconds(date.getSeconds() + number); break;
    }      
    return date;
}

function samearr(arry1, arry2) {
    var arry3 = new Array();
    var j = 0;
    for (var i = 0; i < arry1.length; i++) {
        for (var k = 0; k < arry2.length; k++) {
            if (arry1[i] == arry2[k]) {
                arry3[j] = arry1[i];
                ++j;
            }
        }
    }
    return arry3
}

function zerofill(data, type,start_time,end_time,slvar,srvar) {
    var start_timedate = moment(start_time);
    var end_timedate = moment(end_time);
    if (type == ADCONSTANT.DATAUNIT.UNIT_HOUR) {
        type = 'hours';
    } else {
        type = 'days';
    }

    var len = data.size;
    for (var i = 1; i < len; i++) {
        var a = moment(data.list[i - 1].date_time);
        var b = moment(data.list[i].date_time);
        var ab = b.diff(a, type);
        if (ab > 1) {
            var l = str2short(slvar);
            var r = str2short(srvar);
            var temp = new Object();
            temp['date_time'] = a.add(1, type).format('YYYY-MM-DD HH:mm:ss');
            temp[l] = 0;
            temp[r] = 0;
            data.list.insert(i, temp);
            data.size = data.size + 1;
            data.total = data.total + 1;
            len = len + 1;
        }

    }
    if (len > 0) {
        var a = moment(data.list[0].date_time);
        var la = moment(moment(data.list[0].date_time).format('YYYY-MM-DD 00:00:00'));
        var sa = a.diff(la, type);
        for (var i = sa; i > 0; i--) {
            var l = str2short(slvar);
            var r = str2short(srvar);
            var temp = new Object();
            temp['date_time'] = a.subtract(1, type).format(
                    'YYYY-MM-DD HH:mm:ss');
            temp[l] = 0;
            temp[r] = 0;
            data.list.unshift(temp);
            data.size = data.size + 1;
            data.total = data.total + 1;
        }
        var b = moment(data.list[data.size - 1].date_time);
        var lb = moment(moment(data.list[data.size - 1].date_time).format('YYYY-MM-DD 23:59:59'));
        var bs = lb.diff(b, type);
        for (var i = 0; i < bs; i++) {
            var l = str2short(slvar);
            var r = str2short(srvar);
            var temp = new Object();
            temp['date_time'] = b.add(1, type).format('YYYY-MM-DD HH:mm:ss');
            temp[l] = 0;
            temp[r] = 0;
            data.list.push(temp);
            data.size = data.size + 1;
            data.total = data.total + 1;
        }
    }else{
        var se=end_timedate.diff(start_timedate,type);
        for(var i=0;i<se;i++){
            var l = str2short(slvar);
            var r = str2short(srvar);
            var temp = new Object();
            temp['date_time'] = start_timedate.add(1, type).format('YYYY-MM-DD HH:mm:ss');
            temp[l] = 0;
            temp[r] = 0;
            data.list.push(temp);
            data.size = data.size + 1;
            data.total = data.total + 1;
        }
       
    }
    return data;
}

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};

Date.prototype.format = function(format) {
    var date = {
        "M+" : this.getMonth() + 1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth() + 3) / 3),
        "S+" : this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '')
                .substr(4 - RegExp.$1.length));
    }
    for ( var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? date[k] : ("00" + date[k])
                            .substr(("" + date[k]).length));
        }
    }
    return format;
}

//rewrite alert
window.alert = function(msg){
    if(document.getElementById("alertShield") == null){
        var alertShield = document.createElement("DIV");
        alertShield.id = "alertShield";
        var alertFram = document.createElement("DIV");
        alertFram.id="alertFram";
        var strHtml = "<ul>";
        strHtml += "<li>" + 
                     " AdClick温馨提示" + 
                     "<a class='close-modal' onclick='alertOk()' href='javascript:;'>x</a>" +
                   " </li> ";
        strHtml += " <li id='alert-message'>"+msg+"</li> ";
        strHtml += " <li>" + 
                       "<a class='confirm-btn' href='javascript:;' onclick='alertOk()'>确定</a>"+
                    "</li> ";
        strHtml += "</ul> ";
        alertFram.innerHTML = strHtml;
        document.body.appendChild(alertFram);
        document.body.appendChild(alertShield);
        window.alertOk = function(){
            alertFram.style.display = "none";
            alertShield.style.display = "none";
        }
        alertFram.focus();
        document.body.onselectstart = function(){return false;};
    }else{
        document.getElementById("alert-message").innerHTML = msg;
        document.getElementById("alertFram").style.display = "block";
        document.getElementById("alertShield").style.display = "block";
    }
}

//rewrite confirm
window.confirm = function(msg, cb){
    var confirmShield = document.createElement("DIV");
    confirmShield.id = "confirmShield";
    var confirmFram = document.createElement("DIV");
    confirmFram.id="confirmFram";
    var strHtml = "<ul>";
    strHtml += "<li>" + 
                    "AdClick温馨提示" + 
                    "<a class='close-modal' onclick='confirmNOk()' href='javascript:;'>x</a>" +
               "</li> ";
    strHtml += " <li id='confirm-message'>"+msg+"</li> ";
    strHtml += " <li>" + 
                   "<a  class='confirm-btn' href='javascript:;' onclick='confirmOk()'>确定</a>" +
                   "<a class='cancel-btn' href='javascript:;' onclick='confirmNOk()'>取消</a>" +
               " </li> ";
    strHtml += "</ul>";
    confirmFram.innerHTML = strHtml;
    document.body.appendChild(confirmFram);
    document.body.appendChild(confirmShield);
    window.confirmNOk = function(){
        confirmFram.style.display = "none";
        confirmShield.style.display = "none";
    }
    window.confirmOk = function(){
        confirmFram.style.display = "none";
        confirmShield.style.display = "none";
        if(typeof cb == 'function'){
            cb();
        }
    }
    confirmFram.focus();
    document.body.onselectstart = function(){return false;};
}
