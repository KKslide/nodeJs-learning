var http = require("http");
var fs = require("fs");
var router = require("./lib/router.js");

var server = http.createServer();

// 判断有没有data文件夹存放数据
fs.exists("./data", function (exists) {
    if (!exists) { // 文件夹不存在
        fs.mkdir("./data", (err) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                fs.appendFile("./data/data.json", '{"heros":[]}', (err) => {
                    if (err) return console.log(err);
                })
            }
        })
    }
});

server.listen(3001, () => {
    console.log('http:127.0.0.1:3001');
});

server.on('request', (request, response) => {
    // 路由设置
    router(request, response);
});