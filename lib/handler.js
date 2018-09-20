var path = require("path");
var formidable = require("formidable");
var fs = require("fs");
var myurl = require("url");
// 重新定义一个当前路径
var nowPath = path.resolve(__dirname, '..');
var line = require("./line.js");

var myModule = require("./myModule.js");

// 静态文件配置
module.exports.getStatic = function (request, response) {
    var url = request.url;
    fs.readFile(nowPath + url, (err, data) => {
        if (err) return response.end("发生错误！稍后重试！");
        response.end(data);
    });
}

// 首页
module.exports.getIndexPage = function (request, response) {
    fs.readFile(nowPath + "/views/index.html", (err, data) => {
        if (err) return response.end("发生错误！稍后重试！");
        response.end(data);
    })
}

// 首页接口，读取json数据
module.exports.loadIndex = function (request, response) {
    myModule.getAllData((err, data) => {
        if (err) {
            var obj = {
                "code": 0,
                "msg": "请求错误，请稍后重试",
                "err": err
            }
            response.end(JSON.stringify(obj));
        } else {
            console.log('欧耶 成功了！');
            response.end(data);
        }
    });
}

// icon图标
module.exports.getIcon = function (request, response) {
    var url = request.url;
    fs.readFile(nowPath + url, (err, data) => {
        if (err) return response.end("发生错误！稍后重试！");
        response.end(data.toString());
    });
}

// 图片上传
module.exports.upLoadImg = function (request, response) {
    var form = new formidable.IncomingForm(); // 使用formidable
    form.uploadDir = "./images"; // 创建文件目录
    form.keepExtentsions = true; // 保留扩展名
    form.parse(request, function (err, fields, files) {
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

// 新增
module.exports.addOption = function (request, response) {
    var str = "";
    request.on("data", (chunk) => {
        str = str + chunk;
    });
    request.on("end", () => {
        var obj = myurl.parse("?" + str, true).query;
        myModule.doAdd(obj, (err, data) => {
            if (err) return response.end(JSON.stringify(err));
            response.end(JSON.stringify(data));
        })
    })
}

// 删除
module.exports.delOption = function (request, response) {
    var str = ""
    request.on("data", (chunk) => {
        str += chunk;
    });
    request.on("end", () => {
        var dataID = parseInt(str.split("=")[1]);
        myModule.doDel(dataID, (err, data) => {
            if (err) {
                response.end(err);
            } else {
                response.end(data);
            }
        })
    })
}

// 修改
module.exports.editOptin = function (request, response) {
    var str = "";
    request.on("data", (chunk) => {
        str = str + chunk;
    });
    request.on("end", () => {
        var obj = myurl.parse("?" + str, true).query;
        myModule.doEdit(obj, (err, data) => {
            if (err) {
                response.end(err);
            } else {
                response.end(data);
            }
        })
    });
}