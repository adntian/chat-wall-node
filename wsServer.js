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
app.use(express.static('dist'));
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
        name: false
    };

    console.log(req.url)
    let index = req.url.indexOf('=');
    console.log(index);
    if(index != -1) {
        let appInfoStr = decodeURI((req.url).substr(index + 1))
        let appInfo = JSON.parse(appInfoStr)
        console.log(appInfoStr)
        console.log(appInfo.nickName)


        // socket.send(JSON.stringify({ type: 'login', appInfo: appInfo }))
    }
    // socket.send(JSON.stringify({ type: 'login', content: '23',timestamp: Date.now(), appInfo: { userId: 1,} }))
    
    

    
    socket.on('message', function incoming(data) {
        console.log('data')
        console.log(data)
        var data = data && JSON.parse(data)
        console.log(data)

        // 判断是不是第一次连接，以第一条消息作为用户名

        if (!newclient.name) {
            newclient.name = data.nickName;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        messageType: 'JOIN',
                        message: newclient.name + ' 轻轻的我来了~',
                        createTime: getMyTime(Date.now()),
                        user: data.nickName
                    }));
                }
            });
            console.log(newclient.name + "加入聊天。");
        } else {
            wss.clients.forEach(function each(client) {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    if (data.type == 'text') {
                        let timeStr = getMyTime(Date.now());
                        let sendObj = {
                            msgUserId: data.type,//这条消息的拥有者是my
                            msgNickName: data.nickName,
                            msgAvatarUrl: data.avatarUrl,
                            timestamp: Date.now(),
                            timeStr: timeStr,
                            content: data.content,
                            type: data.type
                        };
                        client.send(JSON.stringify(sendObj));
                    }
                }
            });
        }
    });

    socket.on('close', function close() {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    messageType: 'OUT',
                    message: newclient.name + ' 默默的就离开了~',
                    createTime: getMyTime(Date.now()),
                    user: {
                        nickName: newclient.name
                    }
                }));
            }
            console.log(newclient.name + "离开聊天。");
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