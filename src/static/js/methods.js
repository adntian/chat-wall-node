var apiGetUserList = config__env.apiUrl + '/nh/userList'

// 生成从minNum到maxNum的随机数
function getRandomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
} 
function getUserList(success, fail) {
    axios.post(apiGetUserList)
        .then(function (response) {
            var data = response.data;
            if(data.success) {
                success(data);
            }else {
                fail(data);
            }
            console.log(response);
        })
        .catch(function (error) {
            fail(error);
        });
}
