var fs = require("fs");
var path = require("path");
var nowPath = path.resolve(__dirname, '..');

// 返回全部数据
module.exports.getAllData = function (callback) {
    var file = path.join(nowPath, "/data/data.json");
    fs.readFile(file, "utf-8", (err, data) => {
        if (err) callback(err);
        callback(null, data);
    });
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
    this.getAllData((err, data) => {
        if (err) {
            callback(err);
        } else {
            var heroObj = JSON.parse(data.toString());
            newObj.id = heroObj.heros.length !== 0 ? parseInt(heroObj.heros[heroObj.heros.length - 1].id) + 1 : 1;
            heroObj.heros.push(newObj);
            fs.writeFile(nowPath + "/data/data.json", JSON.stringify(heroObj, null, ""), (err) => {
                if (err) {
                    var obj = {
                        "code": 0,
                        "msg": "添加失败,请联系客服"
                    }
                    callback(obj);
                } else {
                    var obj = {
                        "code": 1,
                        "msg": "添加成功"
                    }
                    callback(obj);
                }
            })
        }
    })
}

// json删除接口
module.exports.doDel = function (id, callback) {
    this.getAllData((err, data) => {
        if (err) return console.log('something`s wrong here' + __line);
        var heroObj = JSON.parse(data.toString());
        for (let i = 0; i < heroObj.heros.length; i++) {
            if (id === parseInt(heroObj.heros[i].id)) {
                heroObj.heros.splice(i, 1);
                break;
            }
        }
        fs.writeFile(nowPath + "/data/data.json", JSON.stringify(heroObj, null, ""), (err) => {
            if (err) {
                var obj = {
                    "code": 0,
                    "msg": "删除失败,请联系客服",
                    "err": err
                }
                callback(JSON.stringify(obj));
            } else {
                var obj = {
                    "code": 1,
                    "msg": "删除成功"
                }
                callback(JSON.stringify(obj))
            }
        })
    })
}

// json修改接口
module.exports.doEdit = function (newObj, callback) {
    this.getAllData((err, data) => {
        if (err) return console.log('something happen here!' + __line);
        var heroObj = JSON.parse(data.toString());
        for (let i = 0; i < heroObj.heros.length; i++) {
            if (parseInt(newObj.id) === parseInt(heroObj.heros[i].id)) {
                heroObj.heros[i] = newObj;
                break;
            }
        }
        fs.writeFile(nowPath + "/data/data.json", JSON.stringify(heroObj, null, ""), (err) => {
            if (err) {
                var obj = {
                    "code": 0,
                    "msg": "修改失败,请联系客服",
                    "err": err
                }
                callback(JSON.stringify(obj));
            } else {
                var obj = {
                    "code": 1,
                    "msg": "修改成功"
                }
                callback(JSON.stringify(obj))
            }
        })
    })
}