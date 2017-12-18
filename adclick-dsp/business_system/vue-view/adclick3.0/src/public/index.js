import axios from 'axios';
import { ERRORCODE } from './constants';
function ajaxCall(param,fn){
    let sinterface = param.sinterface || {};
    let method = sinterface.method || 'get';
    let path = sinterface.path || '';
    let data = param.data || {};
    let responseType = sinterface.responseType || 'json';
    console.log('ajax call param ' + JSON.stringify(param));
    if(method == 'GET'){
        const ajaxParm = {
            method: 'get',
            url: path,
            params: data,
        };
        axios(ajaxParm).then(resData => {
            console.log('success to call GET ' + path);
            resData = resData.data;
            console.log('resData' + JSON.stringify(resData));
            if(resData.code == 0){
                fn(null,resData.data);
            } else if(resData.code == 10002){
                console.log('need login!');
                window.location.href= '/index.html';
            } else{
                let err = {
                    code : resData.code,
                    msg : resData.message
                };
                console.log(resData.message);
                fn(err);
            }
        }).catch(resData =>{
            if (resData.responseText
                    && resData.responseText.indexOf("<!DOCTYPE html>") >= 0) {
                alert("登录过期，请返回登录");
                window.location.href = "/index.html"
            } else {
                let msg = 'Failed to call GET ' + path;
                console.log(msg);
                let err = {
                    code : ERRORCODE.REQUESTERR.code,
                    msg : msg
                };
                fn(err);
            }
        });
    }else if(method == 'POST'){
        const ajaxParm = {
            method: 'post',
            url: path,
            data: data,
            responseType: responseType,
            transformRequest:[function(data){
                return JSON.Parse(data);
            }]
        };
        axios(ajaxParm).then(resData => {
            console.log('success to call POST ' + path);
            resData = resData.data;
            console.log('resData' + JSON.stringify(resData));

            if(resData.code == 0){
                fn(null,resData.data);
            } else if(resData.code==10002){
                console.log('Need login!');
                window.location.href = '/index.html';
            } else {
                let err = {code: resData.code, msg: resData.message};
                console.log(resData.message);
                fn(err);
            } 
        }).catch(resData =>{
            if (resData.responseText
                && resData.responseText.indexOf("<!DOCTYPE html>") >= 0) {
                alert("登录过期，请返回登录");
                window.location.href = "/index.html"
            } else {
                let msg = 'Failed to call POST' + path;
                console.log(msg);
                let err = {
                    code : ERRORCODE.REQUESTERR,
                    msg : msg
                };
                fn(err);
            }
        });
    }     
}


// ajax API fro Adclick 3.0 use axios
function ajaxCallPromise(param){
    const promise = new Promise(function(resolve,reject){
        let sinterface = param.sinterface || {};
        let method = sinterface.method || 'get';
        let path = sinterface.path || '';
        let data = param.data || {};
        let responseType = sinterface.responseType || 'json';
        
        console.log('ajax call param ' + JSON.stringify(param));
        if(method == 'GET'){
            const ajaxParm = {
                method: 'get',
                url: path,
                params: data,
            };
            axios(ajaxParm).then(resData => {
                console.log('success to call GET ' + path);
                resData = resData.data;
                console.log('resData' + JSON.stringify(resData));

                if(resData.code == 0){
                    resolve(resData.data);
                } else if(resData.code == 10002){
                    console.log('need login!');
                    window.location.href= '/index.html';
                } else{
                    let err = {
                        code : resData.code,
                        msg : resData.message
                    };
                    console.log(resData.message);
                    reject(err);
                }
            }).catch(resData =>{
                if (resData.responseText
                        && resData.responseText.indexOf("<!DOCTYPE html>") >= 0) {
                    alert("登录过期，请返回登录");
                    window.location.href = "/index.html"
                } else {
                    let msg = 'Failed to call GET ' + path;
                    console.log(msg);
                    let err = {
                        code : ERRORCODE.REQUESTERR,
                        msg : msg
                    };
                    reject(err);
                }
            });
        }else if(method == 'POST'){
            const ajaxParm = {
                method: 'post',
                url: path,
                data: data,
                // responseType: responseType,
                // transformRequest:[function(data){
                //     return JSON.Parse(data);
                // }]
            };
            axios(ajaxParm).then(resData => {
                console.log('success to call POST ' + path);
                resData = resData.data;
                console.log('resData' + JSON.stringify(resData));

                if(resData.code == 0){
                    resolve(resData.data);
                } else{
                    const err = {
                        code: resData.code,
                        msg: resData.message
                    };
                    console.log(resData.message);
                    reject(err);
                }
            }).catch(resData =>{
                if (resData.responseText
                    && resData.responseText.indexOf("<!DOCTYPE html>") >= 0) {
                    alert("登录过期，请返回登录");
                    window.location.href = "/index.html"
                } else {
                    let msg = 'Failed to call POST' + path;
                    console.log(msg);
                    let err = {
                        code : ERRORCODE.REQUESTERR,
                        msg : msg
                    };

                    reject(err);
                }
            });
        }   
    });
    return promise;
}


export {ajaxCall,ajaxCallPromise};
