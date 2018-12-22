const https = require('https');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const config = require('./src/static/js/appConfig');

const app = express();
const options = {
    key: fs.readFileSync('./domain_nginx/chat.llllll.xyz.key'),
    cert: fs.readFileSync('./domain_nginx/chat.llllll.xyz.crt')
}


app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static('build'));
require("./controllers/route/route")(app);


const server = new https.createServer(options, app);

// websocket
require("./websocket.js")(server);

//
// Start the server.
//
server.listen(config.port, () => {
    console.log(config.environment + '环境启动 端口：' + config.port)
    console.log(`访问地址：${config.apiUrl}/page`)
});