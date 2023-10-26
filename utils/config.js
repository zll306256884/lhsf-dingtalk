
//  测试配置
const BASE_API_HOST = "http://192.168.6.41";
const API_HOST = BASE_API_HOST + "/prod-api";

// 线上配置
// const BASE_API_HOST = "http://team.wzpm.com.cn";
// const API_HOST = BASE_API_HOST + "/online-api";


const API_IMG_URL = "https://eos-shanghai-2.cmecloud.cn/";



module.exports = {
    API_HOST: API_HOST,
    API_IMG_URL: API_IMG_URL,
    //api接口(注意加注释)
    //登录
    API_LOGIN: API_HOST + "/platform/account/app/appLogin",
     //获取用户信息
     API_GET_USER_INFO: API_HOST + "/platform/user/getUserInfoByToken",
      //项目列表
    API_PROJECT_LIST: API_HOST + "/platform/projectBindingAccount/queryMyProjectList",
}