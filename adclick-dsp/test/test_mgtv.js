'use strict';
var request = require('request');
var http = require('http');
var mAsync = require('async');
var path = require('path');
var fs = require('fs');
var debug = require('debug')('testMgtv');

function fileExist(path){
	try{
		console.log('The file path is:'+path);
		fs.accessSync(path, fs.F_OK| fs.R_OK);
	}catch(e){
		return false;
	}
	return true;
}

function postHttpData(param, fn) {
	debug('Try to post data to http server!');

	var jsonData = JSON.stringify(param.data || {});
	var headers = {
    	'Content-Type': 'application/json',
    	'Content-Length': jsonData.length
	};
	var options = {
		hostname: param.host || 'localhost',
		path: param.path || '/',
		port: param.port,
		method: 'POST',
		headers: headers,
	};
	var req = http.request(options, function(res) {
		var chunks = [];
	    res.setEncoding('utf8');
        res.on('data', function (chunk) {
            debug('on data:'+ chunk);
            chunks.push(chunk);
        });
        res.on('end',function(){
 			var ret = chunks.join('');
            debug('get response.json: %j', ret);

            var json = JSON.parse(ret);
            fn(null, json);
        });
	});

    req.on('error',function(e){
       console.error('problem with request:' + e.message);
       fn({
       	code: errorCode.SERVER_ERROR,
       	msg: e.message
       });
    })

    req.write(jsonData);
    req.end();
}

function loadJson(path) {
	if (!fileExist(path)) {
		console.error('The file \"' +path+'\" is not a file!');
		return null;
	}

	var content = fs.readFileSync(path, {encoding:'utf-8'});
	return JSON.parse(content);
}

function doTestMgtv(param) {
	mAsync.waterfall([
		function(next){
			doBidding(param, function(err, data){
				if (err) {
					next(err);
				}else{
					next(null, data);
				}
			});
		}, 
		function(resData, next){
			doImpression(resData, function(err){
				if (err) {
					next(err);
				}else{
					next(null, resData);
				}
			});
		},
		function(resData, next){
			doClick(resData, function(err){
				if (err) {
					next(err);
				}else{
					next(null, resData);
				}
			});
		}
	], function(err, data){
		if (err) {
			console.log('Failed to do mgtv test!');
			console.log(err);
		}else {
			console.log('Succss to do mgtv test!');
		}
	});
}

function getHttpData(param, fn){
	var jsonData = querystring.stringify(param.data);
	var path = param.path +'?'+jsonData;

	debug('try to get data from http server!');
	var options = {
		hostname: param.host || 'localhost',
		path: path,
		port: param.port,
		method: 'GET'
	};
	http.request(options, function(res){
		var chunks = [];			
		res.setEncoding('utf8');
			
		res.on('data', function(chunk){
			chunks.push(chunk);
		});

		res.on('end', function(){
			var ret = chunks.join('');

			debug('Get response.json: %j', ret);
			var json = JSON.parse(ret);
			fn(null, json);
		});
	}).on('err', function(err){
	   console.error('problem with request:' + err);
       fn({	code: errorCode.SERVER_ERROR, msg: err});
	});
}


function doBidding(param, fn) {
	var data = param.data;
	var url = param.url;
	console.log(url);
	/*
	request.post({url: url, form: data}, 
		function(err, res, body) {
		    if (err) {
                fn(err);
            } else {
                if (res.statusCode !== 200) {
                	console.log('The response statusCode='+res.statusCode);
                    console.log('The bid request is failed!');
                    fn('The bid request is failed!');
                } else {
                    fn(null, JSON.parse(body));
                }
            }
        });
        */
    postHttpData(param, fn);
}

function doImpression(param, fn) {
	var ads = param.ads;
	if (ads.length==0) {
		console.log('There is no ads!');
		return fn('There is no ads!');
	}

	var iurls = ads[0].iurl;
	if (iurls.length==0) {
		console.log('There is no iurls!');
		return fn('There is no iurls!');	
	}

	var iurl = iurls[0].url;
	var price = 'f10a017190690bc8aa882ce3499855b5';
	iurl = iurl.replace(/%SETTLE_PRICE%/i, price);
	request.get(iurl).on('response', function(res){
		if (res.statusCode!=200) {
			console.log('impression response.statusCode='+res.statusCode);
		}
		fn(null);
	}).on('error', function(err){
		console.log(err);
		fn(err);
	});
}

function doClick(param, fn) {
	var ads = param.ads;
	if (ads.length==0) {
		console.log('There is no ads!');
		return fn('There is no ads!');
	}

	var clickurl = ads[0].click_through_url;
	request.get(clickurl).on('response', function(res){
		if (res.statusCode!=200) {
			console.log('click response.statusCode='+res.statusCode);
		}
		fn(null);
	}).on('error', function(err){
		console.log(err);
		fn(err);
	});
}
function test(){
	var data = loadJson(path.join(__dirname,'mgtv.txt'));
	if (!data) {
		console.log('Failed to read json!');
		return ;
	}

	var param = {
		data: data,
		url: 'http://180.76.156.69:80/bidding/mgtv',
		host: '180.76.156.69',
		port: 80,
		path: '/bidding/mgtv',
	};

	setInterval(doTestMgtv, 1000, param);
}


test();
