import {
  API_HOST
} from "../../utils/config.js"

module.exports = {
   //查询列表
   API_SELECT_LIST: API_HOST + "/jflow/audit/selectAuditPending",
  
  // //登录
  // API_LOGIN: API_HOST + "/platform/account/app/appLogin",
  // //获取用户信息
  // API_GET_USER_INFO: API_HOST + "/platform/user/getUserInfoByToken",
  // //项目列表
  // API_PROJECT_LIST: API_HOST + "/platform/projectBindingAccount/queryMyProjectList",
  // //  基本信息
  // API_BASE_INFO: API_HOST + "/platform/user/selectUserDetailById",
  // //  在职项目
  // API_IN_PROJECT: API_HOST + "/integratedService/peopleProject/queryServeProject",
  // // 获取验证码图片 
  // API_VERIFY_CODE: API_HOST + "/common/createVerifyCode",
  // // 修改密码
  // API_EDIE_CODE: API_HOST + "/platform/account/modifyPassword",
}