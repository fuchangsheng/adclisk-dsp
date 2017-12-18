// file server  API
// copyright@Catosoft.com reserved, 2015
/*
 * history:
 * 2015.06.07, created by Andy.zhou
 *  
 */

var moduleName = 'file_server.logic';
var debug = require('debug')(moduleName);

var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var mime = require('./mime');
// some utility method designed to help handle range request
var ADCONSTANTS = require('../common/adConstants');
var CONFIG = require('../common/config');
var rge = require('./range');
var SERVERPRV_KEY = __dirname +'/../keys/serverprv.pem';
var SERVERCERT = __dirname +'/../keys/servercert.pem';
/*
var option = {
    key: fs.readFileSync(SERVERPRV_KEY),
    cert: fs.readFileSync(SERVERCERT),
};  
*/
function appCallback(request, response) {
  try{
            // this is the file name
        var fname = url.parse(request.url).pathname.substring(1);
        if(!fname) {
            response.writeHead(404);
            response.write("Not Found!");
            response.end();
            return;
        }
        // do not response the favicon.ico file request
        if (fname == 'favicon.ico') {
            response.end();
            return ;
        }
        var filepath = null;
        if(fname.indexOf(ADCONSTANTS.MANAGE)>-1){
            filepath = '../management_system/download/' + fname;
        }else{
            filepath = '../business_system/download/' + fname;
        }
        var suffix = fname.substring(fname.indexOf('.') + 1);
        var type = mime.getMimeType(suffix);
        var stat = fs.statSync(filepath);

        debug(request.headers);
        debug('request: '+ fname);
        
        // log file size
        debug('File Size: ' + stat.size);
        // check whether the header has the Range field
        var range = request.headers['range'];
        if (range) {
            debug('Range Download');
            // partial download
            range = rge.parseRange(range, stat.size);
            console.log(range);
            // assume the format is right, no error handling
            response.writeHead(206, {'Content-Type': type,
                'Conteng-Range': 'bytes ' + range.start + '-'
                + range.end + '/' + stat.size,
                'Content-Length': range.start - range.end + 1});
            fs.createReadStream(filepath, range).pipe(response);
        } else {
            debug('Full Download');
            response.writeHead(200, {'Content-Type': type, 
                'Content-Length': stat.size,
                'Content-disposition': 'attachment; filename=' +fname
                });
            // send the file
            fs.createReadStream(filepath).pipe(response);
        } 
    }catch(err){
        var json = {};
        json.code = 1;
        json.message = err;
        json.result = {};
        console.error(moduleName +': ' +err);
        //response.json(json);
        response.writeHead(402);
        response.write(JSON.stringify(json));
        response.end();
    }   
}   

http.createServer(appCallback).listen(CONFIG.FILEPORT);
console.log('All file server started on port '+CONFIG.FILEPORT);