const https = require('https');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const config = require('./appConfig');

const app = express();
const options = {
    key: fs.readFileSync('./chat.llllll.xyz_nginx/chat.llllll.xyz.key'),
    cert: fs.readFileSync('./chat.llllll.xyz_nginx/chat.llllll.xyz.crt')
}
const server = new https.createServer(options, app);

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static('build'));
require("./controllers/route/route")(app);

// websocket
require("./websocket.js")(server);

//
// Start the server.
//
server.listen(config.port, () => console.log(config.environment + '环境启动 端口：' + config.port));