const Criteria = require('../../mysql/criteria');
const pool = require('../../mysql/pool').get2018NhConnection;
const DBTools = require('../../mysql/DBTools');
const DB = new DBTools(pool);
const WXBizDataCrypt = require('../tools/WXBizDataCrypt');
const appConfig = require('../../appConfig');
const needle = require('needle');
const wxInfo = require('../../wxInfo');

//员工查询
exports.userList = (req, res) => {
    var criteria = new Criteria();
    criteria.tableName = 'user';
    DB.find(criteria, function (result) {
        res.json(result);
    });
};

//生成第三方session
exports.jscode2session = (req, res) => {
    let jObject = {};
    let code = req.body.code;
    let url = 'https://api.weixin.qq.com/sns/jscode2session';
    let params = {
        grant_type: 'authorization_code',
        appid: wxInfo.appId,
        secret: wxInfo.appSecret,
        js_code: code,
    }
    needle.request('get', url, params, function (err, resp) {
        if (!err && resp.statusCode == 200)
            var data = JSON.parse(resp.body);

            jObject.session_key = data.session_key;
            jObject.openid = data.openid;
            jObject.result = true;
            jObject.msg = '获取session成功';
            res.json(jObject);
    });
};

// 解密手机号信息
exports.encryptPhoneData = (req, res) => {
    let jObject = {};
    let body = req.body;
    let session_key = body.session_key;
    let encryptedData = body.encryptedData;
    let iv = body.iv;
    let appId = appConfig.appId;

    var pc = new WXBizDataCrypt(appId, session_key);
    // decrypt_data为解密后的信息
    var decrypt_data = pc.decryptData(encryptedData, iv);

    jObject.phoneNumber = decrypt_data.phoneNumber;
    jObject.result = true;
    jObject.msg = '解密成功';
    res.json(jObject);
};

//签到 更新签到标志、留言
exports.sign = (req, res) => {
    let body = req.body;
    let phone = body.phone;
    let message = body.message;   // 签到留言
    var criteria = new Criteria();
    let jObject = {};
    criteria.tableName = 'user';
    criteria.condition = 'phone = "' + phone + '"';

    DB.find(criteria, function (result) {
        // 存在 去签到
        if(result.items.length) {
            
            let values = {
                sign: 1,
                message: message,
            };
            DB.update(criteria, values, function (back) {
                
                if (back.success) {
                    jObject.result = true;
                    jObject.msg = '签到成功';
                    jObject.items = result.items;
                } else {
                    jObject.result = false;
                    jObject.msg = '签到失败';
                }
                res.json(jObject);
            });
        }else {
            jObject.result = false;
            jObject.msg = '签到失败';
            res.json(jObject);
        }
    });
};

//加入群聊 更新微信头像等信息
exports.joinRoom = (req, res) => {
    let body = req.body;
    let phone = body.phone;
    var criteria = new Criteria();
    let jObject = {};
    
    criteria.tableName = 'user';
    criteria.condition = 'phone = "' + phone + '"';

    let values = {
        nickName: decodeURIComponent(body.nickName),
        avatarUrl: body.avatarUrl,
        gender: body.gender,
        // wx_openid: body.wx_openid,
    };

    // 根据手机号更新头像等信息
    DB.update(criteria, values, function (back) {

        if (back.success) {
            jObject.result = true;
            jObject.msg = '更新成功';
        } else {
            jObject.result = false;
            jObject.msg = '更新失败';
        }
        res.json(jObject);
    });
};


//中奖纪录查询
exports.prizeQuery = (req, res) => {
    var criteria = new Criteria();
    criteria.tableName = 'prize';
    DB.find(criteria, function (result) {
        /*let typeArr = [];
        let items = {};
        if(result.success){
            for(let i in result.items){
                if (result.items[i].prizelevel != typeArr[i] ){

                }
            }
        }*/
        res.json(result);
    });
};

//中奖纪录入库
exports.prizeDraw = (req, res) => {

};
