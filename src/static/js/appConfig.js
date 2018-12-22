/**
 * 修改配置
 * 本地运行 使用local
 * 部署服务器 使用online
 */


var online = {
  "environmentName": "生产环境",
  "environment": "online",
  "port": "10000",
  "apiUrl": "https://chat.llllll.xyz",
  "socketUrl": "wss://chat.llllll.xyz/socket.io",
  "sqlConfig" : { //数据库配置
    "host": "101.132.35.8",
    "port": 3306,
    "user": "root",
    "password": "Root!!2018",
    "database": "company",
  },
};

var local = {
  "environmentName": "本地部署环境",
  "environment": "local",
  "port": 443, //本地公网端口
  "apiUrl": "https://127.0.0.1",
  "socketUrl": "wss://127.0.0.1",
  "sqlConfig" : { //数据库配置
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": "company",
  },
};

// 本地
// var config__env = local;
// 线上
var config__env = online;

// 非浏览器环境
if (typeof process !== 'undefined') {
  module.exports = config__env;
}



