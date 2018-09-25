var handler = require("./handler.js");


function router(request, response) {
    var url = request.url;
    var method = request.method;

    // 首页数据
    if (url === '/' || url === '/index') {
        // 接口方式,返回json数据
        handler.getIndexPage(request, response);
    }

    // 首页接口
    else if (url === "/page" && method === "GET") {
        handler.loadIndex(request, response);
    }

    // 静态文件配置
    else if (url.indexOf('/node_modules') > -1 || url.indexOf('/images') > -1 || url.indexOf("/js") > -1) {
        handler.getStatic(request, response);
    }

    // icon图标
    else if (url.indexOf("/favicon.ico") > -1) {
        handler.getIcon(request, response);
    }
    // 图片上传
    else if (url === "/postUpload" && method === "POST") {
        handler.upLoadImg(request, response);
    }

    // add接口
    else if (url === "/add" && method === "POST") {
        handler.addOption(request, response);
    }

    // 删除数据
    else if (url === "/del" && method === "POST") {
        handler.delOption(request, response);
    }

    // 修改数据
    else if (url === "/edit" && method === "POST") {
        handler.editOptin(request, response);
    }

}

module.exports = router;