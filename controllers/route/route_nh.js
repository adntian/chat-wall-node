var nh = require('../module/mod_nh');

module.exports = function (app) {
    //员工增删改查
    // app.post(`/nh/userAdd`, nh.userAdd);
    // app.post(`/nh/userDel`, nh.userDel);
    // app.post(`/nh/userUpdate`, nh.userUpdate);
    app.post(`/nh/userList`, nh.userList);

    //签到
    app.post(`/nh/sign`, nh.sign);
    //登录 授权更新信息
    app.post(`/nh/login`, nh.login);

    //中奖记录
    app.post(`/nh/prizeDraw`, nh.prizeDraw);
    app.post(`/nh/prizeQuery`, nh.prizeQuery);

    //资源查询
    // app.post(`/nh/resourceQuery`, nh.resourceQuery);
};