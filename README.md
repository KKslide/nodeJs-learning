# nodeJs学习demo

版本一、全部写在一个js文件里面的运行方式：
----------
## ```npm run go```

版本二、抽离路由、逻辑处理、数据处理：
----------
## ```node app.js```
    思路：
        1.创建服务器; 
        server.on("Request",(req,res)=>{})
                      ↓
                调用方法设置路由
                路由不是来执行操作，
                而是进行请求的处理分发

        → router.js (路由设置)
            → 判断路由和请求去执行特定操作
        → handler.js (逻辑操作)
            → 执行操作、对静态资源的操作、对数据的操作
        → myModule.js (json数据操作)
            → 数据操作, 增 删 改 查
## 
    


版本三、使用express框架：
----------
## ```node app.js```