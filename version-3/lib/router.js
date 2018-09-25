var handler = require("./handler.js");
var express = require("express");
var fs = require('fs');
var router = express.Router();

// 首页
router.get('/', handler.getIndexPage);
// 首页接口
router.get('/page', handler.loadIndex);
// 图片上传
router.post('/postUpload', handler.upLoadImg);
// add
router.post('/add', handler.addOption);
// delete
router.post('/del', handler.delOption);
// edit
router.post('/edit', handler.editOptin);

module.exports = router;