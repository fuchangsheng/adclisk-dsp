/*
 * @file  mail_helper.js
 * @description dsp mailer helper
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'mailer.helper';


//system modules
var mFs = require('fs');
var mDebug = require('debug')(MODULENAME);
var mNodeMailer = require('nodemailer');
var mExec = require('child_process').exec;

//helper
var mLogger = require('./logger')(MODULENAME);

var ERRCODE = require('../common/errCode');

var HTMLTEMPLATE = mFs.readFileSync(__dirname+'/email-template.html', {encoding:'utf-8'});
var MESSAGEHTMLTEMPLATE = mFs.readFileSync(__dirname+'/message-email-template.html', {encoding:'utf-8'});

var MAILSERVER = {
    host: 'smtp.163.com',
    port: 25,
    user: 'dmtecreporter@163.com',
    passwd: 'ZAQXSW009',
};

function sendMailVerify(param, fn) {
    var mailOptions = {
        from: 'dmtecreporter@163.com',
        to: param.receiver,
        subject: '【AdClick DSP广告系统】 邮箱地址验证',
        html: '',
    };

    var encodeToken = param.token + '';
    encodeToken = encodeToken.replace(/\+/gmi, '%2b');
    var content = HTMLTEMPLATE.replace(/token=/gmi, 'token='+encodeToken);
    mailOptions.html = content;

    sendMailEx(mailOptions, fn);
}

function sendMessageByMail(param, fn) {
    var mailOptions = {
        from: 'dmtecreporter@163.com',
        to: param.receiver,
        subject: param.title, // '【AdClick DSP广告系统】 消息通知',
        html: '',
    }

    var content = MESSAGEHTMLTEMPLATE.replace(/CONTENT_REPLACE/mi, param.content);
    mailOptions.html = content;

    sendMailEx(mailOptions, fn);
}

function sendMail(mailOptions, fn) {
    var transporter = mNodeMailer.createTransport(
        'SMTP://dmtecreporter%40163.com:ZAQXSW009@smtp.163.com');

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            mLogger.error(err);
            return fn(err);
        }

        mLogger.info(info.response);
        fn(null);
    });
}

function sendMailEx(mailOptions, cb) {
    var from_name = 'Adclick Supports Team';
    var from = 'supports@adclick.cn';
    var to = mailOptions.to;
    var email_subject = mailOptions.subject;
    var email_content = mailOptions.html;
    var mailContent = 'To: ' + to + '\n';
    mailContent += 'From: ' + from_name + '<' + from + '>\n';
    mailContent += 'Content-type : text/html\n';
    mailContent += 'Subject: ' + email_subject + '\n';
    mailContent += email_content;

    //1.write to file
    mFs.writeFileSync('mail.txt', mailContent);

    //2.command
    var commandStr = 'cat mail.txt | sendmail -t';
    mExec(commandStr, function(err, stdout, stderr) {
        var logmsg = '';
        if(err) {
            logmsg = stderr;
            mLogger.error(logmsg);
            cb({code: ERRCODE.DATA_INVALID, msg: logmsg});
        } else {
            cb(null);
        }
    });
}

function verifyNewUserMail(param, fn) {
    fn();
}
/*
sendMailVerify({
    receiver: 'zhouyaowei@dmtec.cn',
    token: 'dddddddddddddddd'}, function(err) {
    if (err) {
        mLogger.error(err);
    }
});
*/
module.exports.sendMailVerify = sendMailVerify;
module.exports.verifyNewUserMail = verifyNewUserMail;
module.exports.sendMessageByMail = sendMessageByMail;