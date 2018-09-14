
//加载模块
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path')

var server = http.createServer(function (req, res) {

    //1.__dirname是全局变量,可以直接获取。表示当前执行脚本所在的目录。（这里是E:\subject）
    var staticPath = path.join(__dirname, 'act');    //path.join方法，拼接目录地址
    console.log(staticPath);
    //2.staticPath拼接后的目录地址，为了跳到自己项目所在那个目录。（这里是E:\subject\act）

    //3.req.url请求的链接（这里输出的是/index.html）
    var pathObj = url.parse(req.url, true);	        //url.parse方法，解析请求的url，解决链接"\"和"/"的差异问题。
    //4.解析后的req.url是个对象。

    //5.从解析后的对象中获取到pathname(这里pathObj.pathname是/index.html)
    var filePath = path.join(staticPath, pathObj.pathname);   //path.join方法，拼接完整项目目录地址。
    //6.fileContent拼接后的项目目录名字（这里是E:\subject\act\index.html）

    //fs.readFileSync方法，同步读取文件信息														  
    var fileContent = fs.readFileSync(filePath, 'binary');	  //读取拼接完整后的目录中的文件， 'binary'表示二进制方式读取	

    res.write(fileContent, 'binary');
    res.end();
});

server.listen(8080);
