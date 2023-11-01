import { API_HOST } from "../../utils/config.js"

module.exports = {
  //新增项目
  API_PROJECTINFON_SAVE: API_HOST + "/integratedService/projectInfo/save",
  //获取项目编码
  API_GENERATEPRONUMBER: API_HOST + "/integratedService/projectInfo/generateProNumer",
  //项目详情
  API_SELECTPROJECT_INFO_BYID: API_HOST + "/integratedService/projectInfo/selectProjectInfoById",
  //编辑项目
  API_EDIT_PROJECT: API_HOST + "/integratedService/projectInfo/editProject",
}