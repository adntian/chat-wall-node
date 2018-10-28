
const async = require('async');

function DB(getConnection) {
    /**
     * 获取表的字段名
     * @ tableName    string 表名
     * @ return       array  返回该表下所有字段名数组
     * */
    this.getColumn = function (tableName, callback) {
        getConnection(function (connection) {
            var sql = 'SHOW COLUMNS FROM ' + tableName;
            connection.query(sql, function (err, queryResult) {
                var fields = [];
                for (var i = 0; i < queryResult.length; i++) {
                    fields.push(queryResult[i].Field)
                }
                callback(fields);
                connection.release();   //释放数据库连接
            });
        });
    };

    /**
     * 向表中插入一条数据
     * @ tableName   string  表名
     * @ value       object  插入值
     * */
    this.save = function (tableName, value, callback) {
        getConnection(function (connection) {
            var sql = 'INSERT INTO ' + tableName + ' SET ?';
            var back = {};
            connection.query(sql, value, function (err, result) {
                if (err) {
                    back.success = false;
                    back.err = err;
                } else {
                    back.success = true;
                    back.result = result;
                }
                callback(back);
                connection.release();   //释放数据库连接
            });
        });
    };

    /**
     * 修改一条数据
     * @ tableName   string  表名
     * @ criteria    object  主键信息
     * @ value       object  修改后的值
     * */
    this.update = function (criteria, value, callback) {
        getConnection(function (connection) {
            var sql = 'UPDATE ' + criteria.tableName + ' SET ? where ' + criteria.condition;
            console.error(sql);
            var back = {};
            connection.query(sql, value, function (err, result) {
                if (err) {
                    console.error(err)
                    back.success = false;
                    back.err = err;
                } else {
                    back.success = true;
                    back.result = result;
                }
                callback(back);
                connection.release();   //释放数据库连接
            });
        });
    };

    /**
     * 表字段 自增 或 自减
     * @ tableName   string  表名
     * @ criteria    object  主键信息
     * @ value       object  修改后的值
     * */
    this.fieldAdd = function (criteria, field, num, callback) {
        getConnection(function (connection) {
            var sql = 'UPDATE ' + criteria.tableName + ' SET ' + field + " = " + field + "+" + num + " where " + criteria.condition;
            var back = {};
            connection.query(sql, function (err, result) {
                if (err) {
                    back.success = false;
                    back.err = err;
                } else {
                    back.success = true;
                    back.result = result;
                }
                callback(back);
                connection.release();   //释放数据库连接
            });
        });
    };

    /**
     * 删除一条数据
     * @ tableName   string  表名
     * @ criteria    object  主键信息
     * */
    this.remove = function (criteria, callback) {
        getConnection(function (connection) {
            var sql = "delete  from  " + criteria.tableName + "  where " + criteria.condition;
            var back = {};
            connection.query(sql, function (err, result) {
                if (err) {
                    back.success = false;
                    back.err = err;
                } else {
                    back.success = true;
                    back.result = result;
                }
                callback(back);
                connection.release();   //释放数据库连接
            });
        });
    };

    /**
     * 查询数据
     * @ criteria      string   查询条件
     * 在分页查询是，如果同时需要统计所有符合条件的数据条数，则criteria对象里面传递count：true 字段
     * */
    this.find = function (criteria, callback) {
        var condition = '';
        var order = '';
        var limit = '';
        getConnection(function (connection) {
            if (criteria.condition) {
                condition = " where " + criteria.condition;
            }
            if (criteria.order) {
                order = " order by " + criteria.order;
            }
            if (criteria.limit) {
                //SELECT * FROM table WHERE condictions LIMIT PageSize OFFSET PageIndex
                if(criteria.offset > 1){
                    limit = " limit " + criteria.limit + " offset " + (criteria.offset - 1) * criteria.limit;
                }else{
                    limit = " limit " + criteria.limit;
                }
            }

            var sql = "SELECT * FROM  " + criteria.tableName + condition + limit + order;
            var countSql = "SELECT COUNT (*) FROM  " + criteria.tableName + condition;
            console.error("查询(find)sql:" + sql);
            if (!criteria.count) {
                console.error("查询(find)中的统计sql" + countSql);
            }

            async.parallel([
                function (callback) {
                    connection.query(sql, function (err, queryResult) {
                        callback(err, queryResult);
                    });
                },
                function (callback) {
                    if (!criteria.count) {
                        callback(null, null);
                    }else{
                        connection.query(countSql, function (err, countResult) {
                            callback(err, countResult);
                        });
                    }
                }
            ], function (err, result) {
                let queryResult = result[0];
                let countResult = '';
                if(result[1]){
                    countResult = result[1][0]['COUNT (*)'];
                }

                let jObject = {};
                if (err) {
                    jObject.success = false;
                    jObject.err = err;
                } else {
                    jObject.success = true;
                    jObject.items = queryResult;
                    jObject.count = countResult;
                }
                callback(jObject);
                connection.release();   //释放数据库连接
            });
        });
    };

    /**
     * 统计数据条数
     * @ criteria      string   查询条件
     * */
    this.count = function (criteria, callback) {
        var condition = '';
        getConnection(function (connection) {
            if (criteria.condition) {
                condition = " where " + criteria.condition;
            }
            var sql = "SELECT COUNT (*) FROM  " + criteria.tableName + condition;
            console.error("统计(count)sql:" + sql);
            var result = {};
            connection.query(sql, function (err, queryResult) {
                if (err) {
                    result.success = false;
                    result.err = err;
                } else {
                    result.success = true;
                    result.items = queryResult;
                }
                callback(result);
                connection.release();   //释放数据库连接
            });
        });
    };

    /**
     * 搜索数据
     * @ criteria      string   搜索条件
     * */
    this.search = function (criteria, callback) {
        var condition = '';
        getConnection(function (connection) {
            if (criteria.condition) {
                condition = " where " + criteria.condition;
            }
            var sql = "SELECT * FROM  " + criteria.tableName + condition;
            var result = {};
            connection.query(sql, function (err, queryResult) {
                if (err) {
                    result.success = false;
                    result.err = err;
                } else {
                    result.success = true;
                    result.items = queryResult;
                }
                callback(result);
                connection.release();   //释放数据库连接
            });
        });
    };

    //多条sql同时执行
    this.multiQuery = function (sqlArr, callback) {
        getConnection(function (connection) {
            var sql = sqlArr.join(';');
            console.error("多条查询：" + sql);
            connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                callback(error,results);
                connection.release();   //释放数据库连接
            });
        });
    };

    //直接执行sql
    this.query = function (sql, callback) {
        getConnection(function (connection) {
            connection.query(sql, function (error, result) {
                if (error) throw error;
                callback(result);
                connection.release();   //释放数据库连接
            });
        });
    }

}


module.exports = DB;

