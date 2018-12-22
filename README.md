# 微信上墙 服务端+pc展示

项目主要分3部分
1、websocket服务 -wsServer
2、api服务 -express
3、pc端页面 -src 

# 目标功能

> wsServer (websocket服务 兼容小程序使用ws)
- [x] 启动websocket服务 -- 完成
- [x] 文本消息处理 -- 完成

> express (api服务 数据库使用mysql)
- [x] 签到接口
- [x] 登录接口
- [x] 获取成员列表
- [x] 发送消息

> src (pc端页面 由于特效依赖jQuery 使用gulp创建多页应用)
- [x] fullPage滚动切换页面 -- 完成
- [x] websocket连接 -- 完成
- [x] 文本消息处理 -- 完成
- [x] 弹幕
- [x] 签到墙

# 最终目标

1、用node.js构建一个连接pc和小程序的签到上墙系统。[地址在这里](https://github.com/leesipeng/chat-wall-node)

2、利用mpvue做一个扫码签到、群聊、发送弹幕、抽奖结果查询等功能的小程序。[地址在这里](https://github.com/leesipeng/chat-wall-mpvue)

# 部分截图
![PC](screenshot/pc.jpg)
![手机](screenshot/phone.jpg)

## 有问题

Welcome PR or Issue！

## 项目运行

```
git clone https://github.com/leesipeng/chat-wall-node.git  

cd chat-wall-node

npm install  或 yarn(推荐)

项目依赖数据库 需要安装mysql 使用根目录.sql文件导入 并在配置项设置自己的mysql主机账号密码

本地运行：
1、修改src/appConfig.js 配置为local并根据自己的需要修改配置
2、npm run dev
3、浏览器访问 https://127.0.0.1/page (https://127.0.0.1:443/page)
4、注意：默认使用的是chat.llllll.xyz的证书 本地访问 url会显示不安全


服务器运行：
1、修改src/appConfig.js 配置为online
2、修改online配置(服务器、数据库、域名)
3、修改domain_nginx下的证书为自己的域名证书(阿里云域名可以申请免费的https证书)
4、根据自己需要配置nginx 我的是服务器本地启动 然后nginx匹配域名转发到服务器10000端口
5、npm run build 浏览器访问 https://域名/page

配合小程序项目chat-wall-mpvue：
1、在根目录wxInfo文件中配置小程序appId和appSecret
```


