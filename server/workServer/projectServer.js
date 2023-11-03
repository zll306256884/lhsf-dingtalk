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

  ////根据审核状态/单位类型/单位名称分页查询生态伙伴单位信息
  API_GET_UNIT_BIDING: API_HOST + "/platform/ecologicalUnit/pageQueryUnitByTypeAndName",

  //招标文件暂存
  API_TENDERDOCUMENT_TEMPORARYSTORAGE: API_HOST + "/tender/tenderDocument/temporaryStorage",
  //招标文件保存并提交审批
  API_SAVEANDSUBMIT: API_HOST + "/tender/tenderDocument/saveAndSubmit",
  //招标文件详情
  API_TENDER_DETAIL: API_HOST + "/tender/tenderDocument/selectById",
}