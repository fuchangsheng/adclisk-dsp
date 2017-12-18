/*
 * @file  idea_upload.js
 * @description ad idea upload logic API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'idea_upload.logic';

//multer upload
var mMulter = require('multer');
var mFs = require('fs');
var mPath = require('path');
var mCrypto = require('crypto');
var mMoment = require('moment');

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');


mUtils.createCommonDir('./', ['download/captha']);

var mStorage = mMulter.diskStorage({
   destination: function (req, file, fn) {
    var filepath = '';
    var hashedUserId = '';
    var rootpath = ADCONSTANTS.SERVER.ROOT;
    var daystr = mMoment().format('YYYY-MM-DD');
    if (req.session && req.session.userInfo) {
        var hash = mCrypto.createHash('sha1');
        hash.update(req.session.userInfo.user_id + '');
        var encoding = 'hex';
        var sign = hash.digest(encoding);
        var hashedtext = sign.substr(0, 16);
        hashedUserId = hashedtext +'/';
    }
    //FIXME, we will update this when acl ready
    //req.body.user_id = 2;

    switch(req.url){
      case '/v3/utils/assets/license':
          filepath = 'license';
        break;
      case '/v3/utils/assets/qualification':
          filepath = 'qualification';
        break;
      case '/v3/utils/assets/invoice':
          filepath = 'invoice' ;
          break;
      case '/v3/utils/assets/flash':
          filepath = 'idea/flash' ;
          break;
      case '/v3/utils/assets/video':
          filepath = 'idea/video';
          break;
      case '/v3/utils/assets/img':
          filepath =  'idea/img'
          break;
      default:
        var msg = 'Not supported url'+req.url;
        mLogger.error(msg);
        fn(msg);
        break;
    }
    filepath += '/'+hashedUserId+daystr;
    mLogger.debug('changeDest filepath:%j', filepath);
    req.body.filepath = filepath;
    mUtils.createCommonDir(rootpath, [filepath]);
    fn(null, rootpath+filepath);
  },
  
  filename: function(req, file, fn) {
    mLogger.debug('File:'+JSON.stringify(file));
    var splits = file.originalname.split('.');
    var suffix = '';
    if(splits.length > 1) {
      suffix += '.' + splits[splits.length - 1];
    }
    var newName = mDataHelper.createId(file.originalname) + suffix;

    req.body.filepath = req.body.filepath+'/'+newName;

    mLogger.debug('rename: new Name:'+newName);
    
    fn(null, newName);
  }
});

var uploader = module.exports= mMulter({storage: mStorage});