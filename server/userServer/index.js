import { API_HOST } from "../../utils/config.js"

module.exports = {
  //登录
  API_LOGIN: API_HOST + "/platform/account/app/appLogin",
  //获取用户信息
  API_GET_USER_INFO: API_HOST + "/platform/user/getUserInfoByToken",
   //项目列表
 API_PROJECT_LIST: API_HOST + "/platform/projectBindingAccount/queryMyProjectList",
  
}