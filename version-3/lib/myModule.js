var fs = require("fs");
var path = require("path");
var nowPath = path.resolve(__dirname, '..');

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    // database: "nodejs-learning", // 在家
    database: "02nodejs_learning" // 在公司
});
connection.connect();

// 返回全部数据
module.exports.getAllData = function (callback) {
    var sql = "SELECT * FROM heros WHERE isDel = 0";
    connection.query(sql, (err, data) => {
        if (err) callback(err);
        callback(null, data);
    })
}

// 获取一条数据
module.exports.getDataByID = function (id, callback) {
    this.getAllData((err, data) => {
        if (err) return console.log('something happen here!' + __line);
        var heroObj = JSON.parse(data.toString());
        for (let i = 0; i < heroObj.heros.length; i++) {
            if (id === parseInt(heroObj.heros[i])) {
                callback(null, heroObj.heros[i]);
                break;
            }
        }
    })
}

// json新增操作
module.exports.doAdd = function (newObj, callback) {
    var sql = `insert into heros(name,gender,img) values('${newObj.name}','${newObj.gender}','${newObj.img}')`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            if (results.affectedRows == 1) {
                callback();
            } else {
                callback(err);
            }
        }
    });
}

// json删除接口
module.exports.doDel = function (id, callback) {
    var sql = "update heros set isDel = 1 where id =" + id;
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            if (results.affectedRows == 1) {
                callback();
            } else {
                callback(err);
            }
        }
    });
}

// json修改接口
module.exports.doEdit = function (newObj, callback) {
    var sql = "update heros set ? where id = ?";
    connection.query(sql, [newObj, newObj.id], (err, results) => {
        if (err) callback(err);
        else {
            callback();
        }
    });
}