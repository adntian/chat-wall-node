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
    var openid = req.body.openid;
    criteria.tableName = 'user';

    // 如果传递openid 根据openid 查询
    if(openid) {
        criteria.condition = 'openid = "' + openid + '"';
    }
    
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
    jObject.openid = decrypt_data.openid;
    jObject.result = true;
    jObject.msg = '解密成功';
    res.json(jObject);
};

//签到 更新签到标志、留言、用户信息
exports.sign = (req, res) => {
    let body = req.body;
    var criteria = new Criteria();
    let jObject = {};
    criteria.tableName = 'user';
    criteria.condition = 'phone = "' + body.phone + '"';

    DB.find(criteria, function (result) {
        // 存在 去签到
        if (result.items.length) {

            let values = {
                sign: 1,
                signMessage: decodeURIComponent(body.signMessage),
                nickName: decodeURIComponent(body.nickName),
                avatarUrl: body.avatarUrl,
                gender: body.gender,
                openid: body.openid,
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
        } else {
            jObject.result = false;
            jObject.msg = '签到失败';
            res.json(jObject);
        }
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
