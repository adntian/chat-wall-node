(function ($) {
    var host = "ws://localhost:10000/";
    websocket = new WebSocket(host);

    // 链接打开
    websocket.onopen = function (res) {
        console.log("连接服务器成功。");
        websocket.send(JSON.stringify({
            user: {
                nickName: '大屏幕'
            },
            type: 'JOIN',
        }))
    };
    
    // 连接关闭
    websocket.onclose = function (res) {
        console.log("断开连接。");
    };

    /**
     * 接收消息
     * 通过messageType判断 类型
     * JOIN加入 OUT退出 SIGN签到 CHAT聊天
     * @param {接收的消息对象} data 
     */
    websocket.onmessage = function (data) {
        console.log(data)
        console.log('收到服务器内容：' + data.data);
        
        if (data.data.indexOf("type") !== -1) {
            var msgData = JSON.parse(data.data)
            console.log(msgData)
            switch (msgData.type) {
                case 'JOIN':// 加入
                    danmu(msgData);
                    break;
                case 'OUT':// 退出
                    danmu(msgData);
                    break;
                case 'SIGN':// 签到
                    signIn(msgData);
                    break;
                case 'text':// 聊天
                    danmu(msgData);
                    break;
            
                default:
                    break;
            }
        }
    };

    // 连接错误
    websocket.onerror = function (res) {
        console.log("连接错误。");
    };

    /**
     * 弹幕
     * @param {接收的消息对象} data 
     */
    function danmu(data) {
        $('body').barrager({
            img: data.msgAvatarUrl, //图片 
            info: data.content, //文字 
            // href: 'http://www.yaseng.org', //链接 
            close: false, //显示关闭按钮 
            speed: 8, //延迟,单位秒,默认8
            bottom: 200, //距离底部高度,单位px,默认随机 
            color: str2hex(data.msgNickName), //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
        });
    }

    /**
     * 签到 展示弹框 修改展示图片
     * @param {接收的消息对象} data 
     */
    function signIn(data) {
        // animate 随机入场动画
        var _in = ['bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'slideInDown', 'slideInLeft', 'slideInRight'];
        var _out = ['bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'slideOutDown', 'slideOutLeft', 'slideOutRight'];
        var rand_in = parseInt(Math.random() * _in.length, 10);
        var rand_out = parseInt(Math.random() * _out.length, 10);

        // 设置弹框信息
        $('#show_info_img').attr("src", data.user.avatarUrl);
        $('#show_info_nickname').html(data.user.nickName);
        $('#show_info_say').html(data.message);

        // 弹框展示
        $('.show_info').show();
        $('.show_info').addClass(_in[rand_in]);
        setTimeout(function () {
            $('.show_info').removeClass(_in[rand_in]);

            // 更改展示的图片
            var img = document.getElementsByClassName('element')[1].getElementsByTagName('img')[0];
            img.setAttribute('src', data.user.avatarUrl);

            setTimeout(function () {
                $('.show_info').addClass(_out[rand_out]);
                setTimeout(function () {
                    $('.show_info').removeClass(_out[rand_out]);
                    $('.show_info').hide();
                }, 1000);
            }, 1500);
        }, 1000);
    }

    /**
     * 字符串转为16进制颜色值
     * 使用个人信息生成个人专属颜色
     * @param {字符串} str 
     */
    function str2hex(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = [];
        for (var i = 0; i < 3; i++) {

            var value = (hash >> (i * 8)) & 0xFF;
            colour.push(value);
        }

        var r = parseInt(colour[0]);
        var g = parseInt(colour[1]);
        var b = parseInt(colour[2]);

        var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        console.log(hex)
        return hex;

    }

})(jQuery);