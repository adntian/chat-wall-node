const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const xssFilters = require('xss-filters');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static('build'));
require("./controllers/route/route")(app);
// app.post('/login', (req, res) => {

//     console.log(`express login`);
//     res.send({ result: 'OK', message: 'express login' });
// });

/*
* 小程序端连接后 会发送userInfo 发送login
*/
wss.on('connection', function connection(socket, req) {
    //监听用户发布聊天内容
    console.log("有新客户端连接!");

    // 构造客户端对象
    var newclient = {
        socket: socket,
        nickName: false
    };

    console.log(req.url)
    let index = req.url.indexOf('=');
    
    // 签到
    if(index != -1) {
        let appInfoStr = decodeURI((req.url).substr(index + 1))
        let appInfo = JSON.parse(appInfoStr)
        newclient.nickName = appInfo.nickName
        console.log(appInfoStr)
        console.log(appInfo.nickName)

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                console.log('第一次登录')
                client.send(JSON.stringify({
                    type: 'LOGIN',
                    userId: appInfo.userId,//这条消息的拥有者是my
                    nickName: appInfo.nickName,
                    avatarUrl: appInfo.avatarUrl,
                    timestamp: Date.now(),
                    timeStr: getMyTime(Date.now()),
                    content: appInfo.nickName + ' 轻轻的我来了~',
                }));
            }
        });
    }else {
        newclient.nickName = '大屏幕22222'
    }
    
    socket.on('message', function incoming(data) {
        console.log('dataStr')
        console.log(data)
        var data = data && JSON.parse(data)
        // console.log('dataObj')
        
        wss.clients.forEach(function each(client) {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                if (data.type == 'text') {
                    let sendObj = {
                        userId: data.userId,//这条消息的拥有者是my
                        nickName: data.nickName,
                        avatarUrl: data.avatarUrl,
                        timestamp: Date.now(),
                        timeStr: getMyTime(Date.now()),
                        content: data.content,
                        type: data.type
                    };
                    client.send(JSON.stringify(sendObj));
                }
            }
        });
    });

    socket.on('close', function close() {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'LOGOUT',
                    content: newclient.nickName + ' 默默的就离开了~',
                    timeStr: getMyTime(Date.now()),
                    nickName: newclient.nickName,
                    timestamp: Date.now(),
                }));
            }
            console.log(newclient.nickName + "离开聊天。");
        });
    });
});

function getMyTime(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours(), minutes = date.getMinutes();
    return `${hours >= 10 ? hours : '0' + hours}:${minutes > 10 ? minutes : '0' + minutes}`
};

//
// Start the server.
//
server.listen(10000, () => console.log('Listening on http://localhost:10000'));