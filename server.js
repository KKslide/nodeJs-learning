var http = require("http");
var fs = require("fs");
var template = require("art-template");
var formidable = require("formidable");
var path = require("path");
var mysql = require("url");

Object.defineProperty(global, '__stack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) { return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function () {
        return __stack[1].getLineNumber();
    }
});

// 创建服务器
var server = http.createServer();
server.listen(3000, () => {
    console.log('http:127.0.0.1:3000');
});

// 监听请求
server.on('request', (request, response) => {
    var url = request.url;
    console.log('URL请求:' + url);
    var method = request.method;
    if (url === '/' || url === '/index') {
        fs.readFile(__dirname + '/data/data.json', (err, data) => {
            if (err) return response.end("发生错误！稍后重试！");
            var html = template(__dirname + "/views/index.html", JSON.parse(data.toString()));
            response.end(html);
        });
    }
    // 静态文件配置
    else if (url.indexOf('/node_modules') > -1 || url.indexOf('/images') > -1) {
        fs.readFile(__dirname + url, (err, data) => {
            if (err) return response.end("发生错误！稍后重试！");
            response.end(data);
        })
    }
    // icon图标
    else if (url.indexOf("/favicon.ico") > -1) {
        fs.readFile(__dirname + url, (err, data) => {
            if (err) return response.end("发生错误！稍后重试！");
            response.end(data);
        });
    }
    // add 页面
    else if (url === '/add') {
        fs.readFile(__dirname + '/views/add.html', (err, data) => {
            if (err) return response.end("发生错误！稍后重试！");
            response.end(data);
        })
    }
});