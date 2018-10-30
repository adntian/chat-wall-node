//mysql操作模块
const mysql = require('mysql');
const appConfig = require('./../appConfig');

//数据库连接参数设置
let nhOption = {}

if (appConfig.environment == 'local') {
    nhOption = {
        host: appConfig.host,
        port: 3306,
        user: 'root',
        password: '123',
        connectTimeout: 60 * 60 * 1000,
        aquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        connectionLimit: 10,
        database: 'company'
    };
} else if (appConfig.environment == 'online') {
    nhOption = {
        host: appConfig.host,
        port: 3306,
        user: 'root',
        password: 'Root!!2018',
        connectTimeout: 60 * 60 * 1000,
        aquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        connectionLimit: 10,
        database: 'company'
    };
}

let nhPool = mysql.createPool(nhOption);
//测试数据库是否连接
nhPool.getConnection(function (err, connection) {
    if (err) {
        console.log(err);
    } else {
        console.log('2018年会mysql数据库已连接，地址为：' + nhOption.host);
        connection.release();
    }
});

const get2018NhConnection = function (callback) {
    //注意：在数据库操作结束后 要释放链接
    // connection.release();   //释放数据库连接
    nhPool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        callback(connection);
    })
};

module.exports = {
    get2018NhConnection: get2018NhConnection
};

