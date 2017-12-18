'use strict';
var moment = require('moment');

function todayStartTime(){
    return moment().format('YYYY-MM-DD 00:00:00');
}

function currentTime(){
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

export {todayStartTime,currentTime};