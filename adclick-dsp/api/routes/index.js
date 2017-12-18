var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')

var parentdir = function(dir){
    return path.resolve(dir, '..');
}

router.get('/api', function(req, res, next){
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    var mdName = req.query.name;
    var p = parentdir(__dirname);
    console.log(mdName);
    fs.readFile(mdName, 'utf-8', function(err, data){
        if(err){
            console.log(err);
            res.end(JSON.stringify(err));
        }else{
            res.end(data);
        }
    });
});

module.exports = router;
