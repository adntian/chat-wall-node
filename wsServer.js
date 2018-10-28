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
wss.on('connection', function connection(socket) {
    //监听用户发布聊天内容
    console.log("有新客户端连接!");
    socket.send(JSON.stringify({ type: 'login', userInfo: {} }))

    
    socket.on('message', function incoming(data) {
        console.log('data')
        console.log(data)
        var data = data && JSON.parse(data)
        console.log(data)
        var user = data.user || {}

        // Broadcast to everyone else.
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
        


    });

    socket.on('close', function close() {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    messageType: 'OUT',
                    message: newclient.name + ' 默默的就离开了~',
                    createTime: getTime(),
                    user: {
                        nickName: newclient.name
                    }
                }));
            }
            console.log(newclient.name + "离开聊天。");
        });
    });
    // socket.on('message', function incoming(obj) {
    //     console.log('socket message!'); 
    //     //向所有客户端广播发布的消息
    //     console.log(obj.msg)
    //     console.log(obj.img)
    //     if (!obj.msg && !obj.img) {
    //         return;
    //     }

    //     // 后端限制字符长度
    //     const msgLimit = obj.msg.slice(0, 200);
    //     const mess = {
    //         username: obj.username,
    //         src: obj.src,
    //         msg: xssFilters.inHTMLData(msgLimit),
    //         img: obj.img, // 防止xss
    //         roomid: obj.room,
    //         time: obj.time
    //     }
    //     socket.send(mess);

    //     if (obj.img === '') {
    //         const message = new Message(mess)
    //         message.save(function (err, mess) {
    //             if (err) {
    //                 global.logger.error(err)
    //             }
    //             global.logger.info(mess)
    //         })
    //     }
    // });

    // socket.on('login', function (obj) {
    //     console.log('socket login!');
    //     if (!obj.name) {
    //         return;
    //     }
    // })
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