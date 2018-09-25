var http = require("http");
var router = require("./lib/router.js");

var server = http.createServer();
server.listen(3001, () => {
    console.log('http:127.0.0.1:3001');
});

server.on('request', (request, response) => {
    // 路由设置
    router(request, response);
});