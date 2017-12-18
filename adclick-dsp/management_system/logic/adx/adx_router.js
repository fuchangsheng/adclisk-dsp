/*
 * @file  adx_router.js
 * @description adx route data and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.14
 * @version 0.0.1 
 */

 var mgtv  = require('./mgtv_adx');
 var bes = require('./bes_adx');
 var adswitch = require('./adswitch_adx');

 //common constants
var ADCONSTANTS = require('../../../common/adConstants');

 var mGetAdx = function(param) {
    if (param.adx_id === ADCONSTANTS.ADXLIST.ADX_MGTV.code) {
        return mgtv;
    } else if (param.adx_id === ADCONSTANTS.ADXLIST.BES.code) {
    	return bes;
    } else if (param.adx_id === ADCONSTANTS.ADXLIST.AD_SWITCH.code) {
        return adswitch;
    } else if (param.adx_id === ADCONSTANTS.ADXLIST.AD_SWITCH_TENCENT.code) {
        return adswitch;
    } else if (param.adx_id === ADCONSTANTS.ADXLIST.AD_SWITCH_JD.code) {
        return adswitch;
    } else {
        return false;
    }
 };

 module.exports.getAdx = mGetAdx;