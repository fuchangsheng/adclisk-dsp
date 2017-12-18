 /*
 * @file  DBModel.js
 * @description dsp db model info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'DBModel';

var mMoment = require('moment');
var mDefaultDB = require('../../common/db');
var ERRCODE = require('../../common/errCode');
var TIMEOUT = 10000; //10s
var Logger =  require('../../utils/logger');

var mUtils = require('../../utils/utils');

var DBModel = module.exports = function(options) {
    if (!(this instanceof DBModel)) return new DBModel(options);

    var self = this;
    self.refModel = options.refModel;
    self.debug = options.debug;
    self.tableName = options.tableName;
    self.modelName = options.modelName;
    self.db = options.db || mDefaultDB;
    self.logger = Logger(self.modelName);
/*
    self.validate = validate;
    self.filter = filter;
    self.lookup = lookup;
    self.create = create;
    self.update = update;
    self.remove = remove;
    self.count = count;
    self.query = query;
    */
}

/// input validate on 
/// check if fields are exist and correct data type.
/// - if model is valid, return true, 
/// - otherwise return false
DBModel.prototype.validate = function (model) {
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var logger = self.logger;

    logger.debug('validate model: %j', model);

    for (var k in model) {
        // check existence
        if (!(k in refModel)) {
            logger.error(tableName + ' no filed:' + k);
            return false;
        }

        if ((typeof refModel[k] === 'number') && !isNaN(model[k])) {
            model[k] = Number(model[k]);
        }

        // check type
        if (!(typeof refModel[k] === typeof model[k])) {
            logger.error(tableName + ' typeof refModel[k]:' + (typeof refModel[k]));
            logger.error(tableName + ' typeof model[k]:' + (typeof model[k]));
            logger.error(tableName + ' invalid field:' + k + ',value:' + model[k]);
            return false;
        }

        // check format, TBD...
        // like Date, etc
    }

    return true;
}

/// input select fields filter on 
/// - return avaibale fields in {f1: 1, f2: 1, f3: 1 ...} if have some
/// - return false if no available fields
/// - return entire fields if * is in select
DBModel.prototype.filter= function(select){
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var logger = self.logger;
  
    logger.debug('filter select: %j', select);

    var filtered = {};

    // allow *
    if ('*' in select) {
        return {
            '*': 1
        };
    }
    // filer valid fields
    Object.keys(select).forEach(function(k) {
        if (k in refModel)
            filtered[k] = 1;
    });

    return filtered;
}

/// lookup 
/// notes: query include match and select two part
/// - match used to lookup, 
/// - select for filter fields
DBModel.prototype.lookup = function(query, fn){
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var logger = self.logger;

    var match = query.match; // don't allow null or empty
    var expect = query.select; // null means entire record fields
    var timeout = query.timeout || TIMEOUT;

    // 1.
    // Validate input
    // if failed return error
    if (!self.validate(match)) {
        var msg = ' Invalid lookup input';
        logger.error(tableName + msg);
        return fn({
            code: ERRCODE.DB_PARAMS_INVALID,
            msg: msg
        });
    }

    var select = self.filter(expect);
    if (!select) {
        var msg = tableName + ' invalid select input';
        logger.error(msg);
        return fn({
            code: ERRCODE.DB_PARAMS_INVALID,
            msg: msg
        });
    }

    logger.debug(' calling Database lookup');

    // 1.1
    // Construct SQL string according to query.match and query.select
    // SELECT field1, field2,...fieldN table_name1, table_name2... [WHERE Clause] [OFFSET M ][LIMIT N]
    var sqlstr = '';

    // select part
    sqlstr += 'select ';
    sqlstr += Object.keys(select).join(',');
    sqlstr += ' from ' + tableName + ' where ';

    // condition part support only AND statement for now
    var ca = [];
    Object.keys(match).forEach(function(k) {
        if (typeof match[k] === 'object') {
            var date = mMoment(match[k]).format('YYYY-MM-DD HH:mm:ss');
            ca.push('' + k + '=' + '\'' + date + '\'');
        } else {
            ca.push('' + k + '=' + (typeof match[k] === 'string' ? '"' + match[k] + '"' : match[k]));
        }
    });
    sqlstr += ca.join(' and ');
    sqlstr += ';';

    logger.info(sqlstr);

    //2 query the sql
    query.sqlstr = sqlstr;
    self.query(query, fn);
}

/// create record
DBModel.prototype.create = function(query, fn) {
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var logger = self.logger;

    var expect = query.fields; // don't allow null or empty
    var values = query.values; // value's key must match to fields
    var timeout = query.timeout || TIMEOUT;


    if (!Array.isArray(values)) {
        values = [values];
    }

    //0.set the default value
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if (refModel.create_time) {
            value.create_time = value.create_time || new Date();
        }
        if (refModel.update_time) {
            value.update_time = value.update_time || new Date();
        }
        
    }
    if (refModel.create_time) {
        expect.create_time = values[0].create_time;
    }
    if (refModel.update_time) {
        expect.update_time = values[0].update_time;
    }
    

    // 1.
    // Validate input
    // if failed return error
    var fields = self.filter(expect);
    if (!fields) {
        var msg = 'Invalid lookup input';
        logger.error(tableName + msg);
        return fn({
            code: ERRCODE.DB_PARAMS_INVALID,
            msg: msg
        });
    }

    for (var k in values) {
        if (!self.validate(values[k])) {
            var msg = 'Invalid values input';
            logger.error(tableName + msg);
            return fn({
                code: ERRCODE.DB_VALUES_INVALID,
                msg: msg
            });
        }
    }

    logger.debug(' calling Database create');
    // 1.1
    // Construct SQL string       
    // INSERT INTO tableName(field1, field2,...fieldN) VALUES (value1, value2,...valueN),...
    var sqlstr = 'insert into ' + tableName;

    // fields part
    sqlstr += ' (' + Object.keys(fields).join(',') + ') ';

    // values part
    var va = [];
    values.forEach(function(v) {
        var vs = '(';
        var vsa = [];
        Object.keys(fields).forEach(function(k) {
            if (typeof v[k] === 'object') {
                var date = mMoment(v[k]).format('YYYY-MM-DD HH:mm:ss');
                vsa.push('\'' + date + '\'');
            } else {
                vsa.push(typeof v[k] === 'string' ? '"' + v[k] + '"' : v[k]);
            }
        });
        vs += vsa.join(',');
        vs += ')';

         va.push(vs);
    });

    sqlstr += ' values '
    sqlstr += va.join(',');
    sqlstr += ';';

    logger.info(sqlstr);

    //2 query the sql
    query.sqlstr = sqlstr;
    self.query(query, fn);
}

/// update record
DBModel.prototype.update = function(query, fn){
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var logger = self.logger;

    var match = query.match; // don't allow null or empty
    var update = query.update; // don't allow null or empty
    var timeout = query.timeout || TIMEOUT;

    //set the default value
    if (refModel.update_time) {
        update.update_time = update.update_time || new Date();
    }
    
    // 1.
    // Validate input
    // if failed return error
    if (!self.validate(match)) {
        var msg = ' Invalid match input';
        logger.error(tableName + msg);
        return fn({
            code: ERRCODE.DB_PARAMS_INVALID,
            msg: msg
        });
    }

    if (!self.validate(update)) {
        var msg = ' Invalid update input';
        logger.error(tableName + msg);
        return fn({
            code: ERRCODE.DB_VALUES_INVALID,
            msg: msg
        });
    }

    logger.debug(' calling Database update');

    // 1.1
    // Construct SQL string
    // UPDATE tableName SET field1=new-value1, field2=new-value2 [WHERE Clause]
    var sqlstr = 'update ' + tableName + ' set ';

    // update part
    var ua = [];
    Object.keys(update).forEach(function(k) {
        if (typeof update[k] === 'object') {
            var date = mMoment(update[k]).format('YYYY-MM-DD HH:mm:ss');
            ua.push('' + k + '=' + '\'' + date + '\'');
        } else {
            ua.push('' + k + '=' + (typeof update[k] === 'string' ? '"' + update[k] + '"' : update[k]));
        }
    });
    sqlstr += ua.join(',');

    // condition part support only AND statement for now
    sqlstr += ' where ';

    var ca = [];
    Object.keys(match).forEach(function(k) {
        if (typeof match[k] === 'object') {
            var date = mMoment(match[k]).format('YYYY-MM-DD HH:mm:ss');
            ca.push('' + k + '=' + '\'' + date + '\'');
        } else {
            ca.push('' + k + '=' + (typeof match[k] === 'string' ? '"' + match[k] + '"' : match[k]));
        }
    });
    sqlstr += ca.join(' and ');
    sqlstr += ';';

    logger.info(sqlstr);

    //2 query the sql
    query.sqlstr = sqlstr;
    self.query(query, fn);
}

/// remove record
DBModel.prototype.remove = function(query, fn){
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var logger = self.logger;

    var match = query.match; // don't allow null or empty
    var timeout = query.timeout || TIMEOUT;

    // 1.
    // Validate input
    // if failed return error
    if (!self.validate(match)) {
        var msg = ' Invalid delete input';
        logger.error(tableName + msg);
        return fn({
            code: ERRCODE.DB_PARAMS_INVALID,
            msg: msg
        });
    }

    logger.debug(' calling Database remove');

    // 1.1
    // Construct SQL string
    // DELETE FROM tableName [WHERE Clause]
    var sqlstr = 'delete from ' + tableName + ' where ';

    // condition part support only AND statement for now
    var ca = [];
    Object.keys(match).forEach(function(k) {
        if (typeof match[k] === 'object') {
            var date = mMoment(match[k]).format('YYYY-MM-DD HH:mm:ss');
            ca.push('' + k + '=' + '\'' + date + '\'');
        } else {
            ca.push('' + k + '=' + (typeof match[k] === 'string' ? '"' + match[k] + '"' : match[k]));
        }
    });
    sqlstr += ca.join(' and ');
    sqlstr += ';';

    logger.info(sqlstr);

    //2 query the sql
    query.sqlstr = sqlstr;
    self.query(query, fn);
}

//count record
DBModel.prototype.count = function(query, fn){
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var logger = self.logger;

    var match = query.match; // don't allow null or empty
    // var expect = query.select; // null means entire record fields
    var timeout = query.timeout || TIMEOUT;

    // 1.
    // Validate input
    // if failed return error
    if (!self.validate(match)) {
        var msg = ' Invalid match input';
        logger.error(tableName + msg);
        return fn({
            code: ERRCODE.DB_PARAMS_INVALID,
            msg: msg
        });
    }

    // var select = self.filter(expect);
    // if (!select) {
    //     return fn(tableName +' invalid select input');
    // }
    logger.debug(' calling Database count');
    
    // 1.1
    // Construct SQL string according to query.match and query.select
    // SELECT field1, field2,...fieldN table_name1, table_name2... [WHERE Clause] [OFFSET M ][LIMIT N]
    var sqlstr = '';

    // select part
    sqlstr += 'select count(*) as total ';
    sqlstr += ' from ' + tableName ;

    // condition part support only AND statement for now
    var ca = [];
    Object.keys(match).forEach(function(k) {
        if (typeof match[k] === 'object') {
            var date = mMoment(match[k]).format('YYYY-MM-DD HH:mm:ss');
            ca.push('' + k + '=' + '\'' + date + '\'');
        } else {
            ca.push('' + k + '=' + (typeof match[k] === 'string' ? '"' + match[k] + '"' : match[k]));
        }
    });

    if (ca.length>0) {
        sqlstr+=' where ';
        sqlstr += ca.join(' and ');
    }
    
    sqlstr += ';';

    logger.info(sqlstr);

    //2 query the sql
    query.sqlstr = sqlstr;
    self.query(query, function(err, rows) {
        if (err) {
            fn(err);
        }else {
            var result = rows[0];
            fn(null, result.total);
        }
    });
}

DBModel.prototype.doQuery = function(param, fn){
    var self = this;

    var connection = param.connection;
    var timeout = param.timeout || TIMEOUT;
    var sqlstr = param.sqlstr || param.sqlStr || param;
    var modelName = self.modelName || modelName;
    var logger = self.logger;

    if (mUtils.isEmpty(sqlstr)) {
        var msg = 'The sql string is empty!';
        logger.error(msg);
        return fn({
            code: ERRCODE.DB_SQL_EMPTY,
            msg:msg,
        });
    }

    logger.info(sqlstr);

    // 1.1 Use the connection
    connection.query({
        sql: sqlstr,
        timeout: timeout
    }, function(err, rows) {
        // 1.2
        // Check result
        if (err) {
            var msg = modelName + ' sql query failed:' + err;
            logger.error(msg);

            fn({
                code: ERRCODE.DB_QUERY_FAIL,
                msg: err
            }); 
        } else {
            // 1.3
            // Process result ...
            // logger.log('count result:%j', rows);
            fn(null, rows);
        }
    });  
}

DBModel.prototype.release = function(connection) {
    try{
        if(connection) {
            connection.release();
        }
    }catch(e) {
        logger.error('Failed to release connection:'+e.message);
    }
}

DBModel.prototype.query = function(param, fn){
    var self = this;
    var db = self.db;
    var logger = self.logger;

    //if aleady has the connection, do the transaction
    if (param.connection) {
        // 2.1 Execute query SQL
        self.doQuery(param, fn);
    }else{
        
        db.getConnection(function(err, connection) {
            if (err) {
                logger.error('Database connection err:' + err);
                self.release(connection);
                return fn({
                    code: ERRCODE.DB_CONNECTION_FAIL,
                    msg: err
                });
            }

            // 2.1 Execute query SQL
            // Use the connection
            param.connection = connection;
            self.doQuery(param, function(err, rows){
                self.release(connection);
                param.connection = null;
                fn(err, rows);
            });
        });  
    }   
}

//do not support different database
DBModel.prototype.doTransaction = function(param, fn){
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var db = self.db;
    var logger = self.logger;

    var timeout = param.timeout || TIMEOUT;
    
    if (!param.transactionFun) {
        var msg = 'The transaction callback is empty!';
        logger.error(msg);
        var err = {
            code: ERRCODE.DB_QUERY_FAIL,
            msg: msg,
        };
       return fn(err);
    }

    var transactionFun = param.transactionFun ;

    logger.info('do transaction');

    // 2.
    // Execute SQL
    db.getConnection(function(err, connection) {
        if (err) {
            logger.error('Database connection err:' + err);
            self.release(connection);

            return fn({
                code: ERRCODE.DB_CONNECTION_FAIL,
                msg: err
            });
        }

        //2.2 do transaction
        param.connection = connection;
        connection.beginTransaction(function(err) {
            transactionFun(param, function(err, data){ 
                param.connection = null;
                if (err) {
                    connection.rollback(function(r_err){
                        //2.2.1 release connection
                        self.release(connection);

                        if (r_err) {
                            logger.error('Rollback err:'+r_err);
                        }

                        var msg = err.msg || err;
                        var code = err.code || ERRCODE.DB_TRANSACTION_ERR;
                        logger.error('Rollback for transaction err:'+msg);
                        err= {
                            msg: msg,
                            code: code,
                        };
                        fn(err);
                    });
                }else {
                    connection.commit(function(c_err){
                        self.release(connection);

                        if(c_err){
                            logger.error('Commit error:'+c_err);
                        }

                        logger.info('transaction commit done!');
                        fn(null, data);
                    });
                }
            });
        });
    });
}

//to support different database
//FIXME, we may improve this by using eventEmit
DBModel.prototype.doTransactionBatch = function(param, fn){
    var self = this;

    var refModel = self.refModel;
    var tableName = self.tableName;
    var debug = self.debug;
    var modelName = self.modelName;
    var db = self.db;
    var logger = self.logger;

    var timeout = param.timeout || TIMEOUT;
    
    if (!param.transactionFun) {
        var msg = 'The transaction callback is empty!';
        logger.error(msg);
        var err = {
            code: ERRCODE.DB_QUERY_FAIL,
            msg: msg,
        };
       return fn(err);
    }

    var transactionFun = param.transactionFun ;
    var batchTransactionDone = param.batchTransactionDone;
    logger.info('do transaction');

    // 2.
    // Execute SQL
    db.getConnection(function(err, connection) {
        if (err) {
            logger.error('Database connection err:' + err);
            self.release(connection);

            return fn({
                code: ERRCODE.DB_CONNECTION_FAIL,
                msg: err
            });
        }

        param.connection = connection;
        
        var transactionDone = function(err, data){ 
            logger.debug('transactionDone callback!');

            param.connection = null;
            if (err) {
                connection.rollback(function(r_err){
                    self.release(connection);

                    var msg = err.msg || err;
                    var code = err.code || ERRCODE.DB_TRANSACTION_ERR;
                    logger.error('Rollback for transaction err:'+msg);
                    err= {
                        msg: msg,
                       code: code,
                    };

                    if(r_err) {
                        logger.error('Rollback err:'+r_err);
                    }

                    batchTransactionDone(err);
                });
            }else {
                connection.commit(function(c_err){
                    self.release(connection);
                    if (c_err) {
                        logger.error('Commit err:'+c_err);
                    }

                    logger.info('Transaction commit done!');

                    batchTransactionDone(null, data);
                });
            }
        }; //end transaction done function

        connection.beginTransaction(function(err) {
            transactionFun(param, function(err, data){
                logger.debug('Transaction work finished callback!');
                var options = {
                    callback: transactionDone,
                    data: data,
                };
                if (err) {
                    fn(err, options);
                }else {
                    fn(null, options);
                }
            });
        });
    });
}