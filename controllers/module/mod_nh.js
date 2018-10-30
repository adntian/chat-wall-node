const Criteria = require('../../mysql/criteria');
const pool = require('../../mysql/pool').get2018NhConnection;
const DBTools = require('../../mysql/DBTools');
const DB = new DBTools(pool);

//员工查询
exports.userList = (req, res) => {
    var criteria = new Criteria();
    criteria.tableName = 'user';
    DB.find(criteria, function (result) {
        res.json(result);
    });
};

//签到
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

//签到
exports.login = (req, res) => {
    let body = req.body;
    let phone = body.phone;
    var criteria = new Criteria();
    let jObject = {};
    
    criteria.tableName = 'user';
    criteria.condition = 'phone = "' + phone + '"';

    let values = {
        nickName: body.nickName,
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
