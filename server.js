var http = require("http");
var fs = require("fs");
var template = require("art-template");
var formidable = require("formidable");
var path = require("path");
var myurl = require("url");
var line = require("./lib/line.js");

// 创建服务器
var server = http.createServer();
server.listen(3000, () => {
    console.log('http:127.0.0.1:3000');
});

// 监听请求
server.on('request', (request, response) => {
    var url = request.url;
    var method = request.method;
    console.log('URL请求:' + url, '请求方式:' + method);
    if (url === '/' || url === '/index') {
        // 接口方式,返回json数据
        fs.readFile(__dirname + "/views/index.html", (err, data) => {
            if (err) return response.end("发生错误！稍后重试！");
            response.end(data);
        })
    }
    // 接口
    if (url === "/page" && method === "GET") {
        var file = path.join(__dirname, "/data/data.json");
        fs.readFile(file, "utf-8", (err, data) => {
            if (err) return false;
            response.end(data);
        })
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
            response.end(data.toString());
        });
    }
    // add 页面
    else if (url === '/add' && method === "GET") {
        fs.readFile(__dirname + '/views/add.html', (err, data) => {
            if (err) return response.end("发生错误！稍后重试！");
            response.end(data);
        });
    }
    // 图片上传
    else if (url === "/postUpload" && method === "POST") {
        var form = new formidable.IncomingForm(); // 使用formidable
        form.uploadDir = "./images"; // 创建文件目录
        form.keepExtentsions = true; // 保留扩展名
        form.parse(request, function (err, fields, files) {
            console.log(fields);
            console.log('--------------------');
            if (err) {
                var obj = {
                    "code": 0,
                    "msg": "上传失败"
                }
                response.end(JSON.stringify(obj));
            } else {
                var obj = {
                    "code": 1,
                    "msg": "上传成功",
                    "path": path.basename(files.img.path)
                }
                response.end(JSON.stringify(obj));
            }
        })
    }
    // 新增数据
    else if (url === "/add" && method === "POST") {
        var str = "";
        request.on("data", (chunk) => {
            str = str + chunk;
        });
        request.on("end", () => {
            // console.log(str);
            console.log('行数：' + __line + '---' + str);
            var obj = myurl.parse("?" + str, true).query;
            console.log(obj);
            fs.readFile(__dirname + "/data/data.json", (err, data) => {
                if (err) return response.end("发生错误！稍后重试！");
                var heroObj = JSON.parse(data.toString());
                obj.id = parseInt(heroObj.heros[heroObj.heros.length - 1].id) + 1;
                heroObj.heros.push(obj);
                fs.writeFile(__dirname + "/data/data.json", JSON.stringify(heroObj, null, ""), (err) => {
                    if (err) {
                        var obj = {
                            "code": 0,
                            "msg": "添加失败,请联系客服"
                        }
                        return response.end(JSON.stringify(obj));
                    } else {
                        var obj = {
                            "code": 1,
                            "msg": "添加成功"
                        }
                        response.end(JSON.stringify(obj))
                    }
                })
            })
        })
    }
    // 删除数据
    else if (url === "/del" && method === "POST") {
        var str = ""
        request.on("data", (chunk) => {
            str += chunk;
        });
        request.on("end", () => {
            var dataID = parseInt(str.split("=")[1]);
            console.log(dataID);
            fs.readFile(__dirname + "/data/data.json", (err, data) => {
                if (err) return response.end("发生错误！稍后重试！");
                var heroObj = JSON.parse(data.toString());
                console.log("删除前-----", heroObj.heros);
                for (var i = 0; i < heroObj.heros.length; i++) {
                    if (parseInt(heroObj.heros[i].id) === dataID) {
                        heroObj.heros.splice(i, 1);
                    }
                }
                console.log("删除后-----", heroObj);
                fs.writeFile(__dirname + "/data/data.json", JSON.stringify(heroObj, null, ""), (err) => {
                    if (err) {
                        var obj = {
                            "code": 0,
                            "msg": "删除失败,请联系客服"
                        }
                        return response.end(JSON.stringify(obj));
                    } else {
                        var obj = {
                            "code": 1,
                            "msg": "删除成功"
                        }
                        response.end(JSON.stringify(obj))
                    }
                })
            })
        })
    }
    // 修改数据
    else if (url === "/edit" && method === "POST") {
        var str = "";
        request.on("data", (chunk) => {
            str = str + chunk;
        });
        request.on("end", () => {
            var obj = myurl.parse("?" + str, true).query;
            console.log("第" + __line + "行, 修改数据：", obj);
            console.log('需要修改的ID为', obj.id);
            var changeID = obj.id;
            fs.readFile(__dirname + "/data/data.json", (err, data) => {
                if (err) return response.end("发生错误！稍后重试！");
                var heroObj = JSON.parse(data.toString());
                for (var i = 0; i < heroObj.heros.length; i++) {
                    if (changeID == heroObj.heros[i].id) {
                        heroObj.heros.splice(i, 1, obj);
                    }
                }
                fs.writeFile(__dirname + "/data/data.json", JSON.stringify(heroObj, null, ""), (err) => {
                    if (err) {
                        var obj = {
                            "code": 0,
                            "msg": "修改失败,请联系客服"
                        }
                        return response.end(JSON.stringify(obj));
                    } else {
                        var obj = {
                            "code": 1,
                            "msg": "修改成功"
                        }
                        response.end(JSON.stringify(obj))
                    }
                })
            })
        })
    }
});