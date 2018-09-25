var path = require("path");
var router = require("./lib/router.js");
var express = require("express");
var app = express();

// 静态资源托管
app.use('/images', express.static('images'));
app.use('/node_modules', express.static('node_modules'));
app.use('/icon', express.static(path.join(__dirname, 'icon')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.engine('html', require('express-art-template'));

app.listen(3002, () => {
    console.log('http:127.0.0.1:3002');
});

app.use(router);