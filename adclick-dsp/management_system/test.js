process.env.TZ = 'PRC';

var moment = require('moment');

var date = new Date();

console.log(moment().toString());
console.log(date.toString());