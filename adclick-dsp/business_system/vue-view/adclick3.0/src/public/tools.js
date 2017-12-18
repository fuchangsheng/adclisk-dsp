'use strict';

function isMobile(num) {
    return /^1[34578]\d{9}$/.test(num);// 手机号码
}


function isEmail(email){
    let re = /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/;
    return re.test(email);
}

function isMoney(num) {
    if(num == 0 || num == ""){
        return false;
    }
    let re = /^[0-9]*(\.[0-9]{1,2})?$/;
    return re.test(num);
}

function isUrl(url) {
    let re = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g;
    return re.test(url);
}

function isPInt(num) {
    let re = /^[0-9]*[1-9][0-9]*$/;
    return re.test(num);
}

function isEmptyObject(obj){
    for (let t in obj){
        return false;
    }
    return true;
}

function isPassword(pass) {
    var re = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,16}$/;
    return re.test(pass);
}

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

export { isMobile, isEmail, isMoney, isUrl, isPInt, isEmptyObject, isPassword };



