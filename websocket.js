const WebSocket = require('ws');
const xssFilters = require('xss-filters');
const Mock = require('mockjs')

function websocket(server) {
    const wss = new WebSocket.Server({ server });
    // let timer = null;
    // if(timer) clearInterval(timer);
    /*
    * 监听socket连接
    */
    wss.on('connection', function connection(socket, req) {
        //监听用户发布聊天内容
        console.log("有新客户端连接!");

        // 构造客户端对象
        var newclient = {
            socket: socket,
            nickName: false
        };

        /**
         * 小程序首次连接 url携带appInfo 标识当前用户
         * 截取客户端发送的url 获取用户信息 解析获取的appInfo对象
         * 如果url不包含参数 则是pc端
         */
        let index = req.url.indexOf('=');
        if (index != -1) {
            let encodeStr = req.url.substr(index + 1)
            let appInfoStr = decodeURIComponent(decodeURIComponent(encodeStr))
            let appInfo = (appInfoStr && JSON.parse(appInfoStr))
            newclient.nickName = appInfo.nickName

            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    console.log('第一次登录')

                    // 当前用户登录 广播一条消息
                    client.send(JSON.stringify({
                        type: 'LOGIN',
                        userId: appInfo.userId,//这条消息的拥有者是my
                        nickName: appInfo.nickName,
                        avatarUrl: appInfo.avatarUrl,
                        timestamp: Date.now(),
                        timeStr: getMyTime(Date.now()),
                        content: appInfo.nickName + ' 加入群聊~',
                    }));
                }
            });

            // 监听客户端关闭事件 广播消息 --只监听小程序连接
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
        } else {
            newclient.nickName = '大屏幕';
        }

        // 监听消息事件
        socket.on('message', function incoming(data) {
            console.log('dataStr')
            console.log(data)
            var data = data && JSON.parse(data)

            wss.clients.forEach(function each(client) {
                if (client !== socket && client.readyState === WebSocket.OPEN) {

                    // 文本消息
                    if (data.type === 'text') {
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
                    } else if (data.type === 'image') {
                        let sendObj = {
                            userId: data.userId,//这条消息的拥有者是my
                            nickName: data.nickName,
                            avatarUrl: data.avatarUrl,
                            timestamp: Date.now(),
                            timeStr: getMyTime(Date.now()),
                            content: data.content,
                            largePic: data.largePic,
                            type: data.type
                        };
                        client.send(JSON.stringify(sendObj));
                    }
                }
            });
        });


        // let testContent = [
        //     Mock.Random.csentence(1, 30),// 中文1-30
        //     Mock.Random.paragraph(1, 7), // 英文句子
        //     Mock.Random.cparagraph(1, 5), // 中文文本
        //     Mock.Random.sentence(1, 10), // 英文单词
        //     Mock.Random.float(),
        // ]
        /**
         * 测试用 定时广播消息
         */
        // timer = setInterval(() => {
        //     wss.clients.forEach(function each(client) {
        //         if (client.readyState === WebSocket.OPEN) {
        //             client.send(JSON.stringify({
        //                 userId: Mock.Random.natural(111, 999),//这条消息的拥有者是my
        //                 nickName: testContent[Mock.Random.natural(0, testContent.length)],
        //                 avatarUrl: Mock.Random.image(),
        //                 timestamp: Date.now(),
        //                 timeStr: getMyTime(Date.now()),
        //                 content: testContent[Mock.Random.natural(0, testContent.length)],
        //                 type: 'text'
        //             }));
        //         }
        //     });
        // }, 5000)

    });

    // 时间转换函数
    function getMyTime(timestamp) {
        let date = new Date(timestamp);
        let hours = date.getHours(), minutes = date.getMinutes();
        return `${hours >= 10 ? hours : '0' + hours}:${minutes > 10 ? minutes : '0' + minutes}`
    };
}

module.exports = websocket;