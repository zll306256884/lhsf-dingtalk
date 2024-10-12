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
  //暂存
  API_STORAGE_PROJECT: API_HOST + "/integratedService/projectInfo/storageSave",
  //所属单位
  API_ORGANIZE_QUERYTOPLIST: API_HOST + "/platform/organize/queryTopList",
  //新增项目提交审批
  API_PROJECT_COMMITAPPROVAL: API_HOST + "/integratedService/projectInfo/commitProjectApproval",
  //删除项目
  API_PROJECT_DELETEPROJECT: API_HOST + "/integratedService/projectInfo/deleteProjectById",
  
  

  ////根据审核状态/单位类型/单位名称分页查询生态伙伴单位信息
  API_GET_UNIT_BIDING: API_HOST + "/platform/ecologicalUnit/pageQueryUnitByTypeAndName",

  //招标文件暂存
  API_TENDERDOCUMENT_TEMPORARYSTORAGE: API_HOST + "/tender/tenderDocument/temporaryStorage",
  //招标文件保存并提交审批
  API_SAVEANDSUBMIT: API_HOST + "/tender/tenderDocument/saveAndSubmit",
  //招标文件详情
  API_TENDER_DETAIL: API_HOST + "/tender/tenderDocument/selectById",
  //招标文件删除
  API_TENDER_DELETE: API_HOST + "/tender/tenderDocument/deleteByKeyIds",
  

  ////根据项目Id查看参建方类型
  API_CURRENTUNIT_TYPE: API_HOST + "/integratedService/currentUnitType/queryCurrentUnitType",

  //查询所有的合同
  API_CONTRACT_LIST: API_HOST + "/tender/contract/selectList",

  //招标文件
  API_TENDERDOCUMENT_LIST: API_HOST + "/tender/tenderDocument/page",

  //合同暂存
  API_CONTRACT_TEMPORARY_STORAGE: API_HOST + "/tender/contract/temporaryStorage",

  //合同审批-合同保存并提交审批
  API_CONTRACT_SAVEANDSUBMIT: API_HOST + "/tender/contract/saveAndSubmit",

  //合同详情
  API_CONTRACT_DETAIL: API_HOST + "/tender/contract/selectById",

  ////根据项目id/单位类型/单位名称分页模糊查询参建方信息
  API_CURRENTUNIT: API_HOST + "/integratedService/currentUnit/queryPageCurrentUnit",
  //合同删除
  API_CONTRACT_DELETE: API_HOST + "/tender/contract/deleteByKeyIds",
  //合同分页 (和流程中心公用,项目里需要传项目id)
  API_CONTRACT_PAGE: API_HOST + "/tender/contract/page",
  //查询项目负责人员信息
  API_PROJECT_LEADER: API_HOST + "/integratedService/personManagementInfo/queryProjectLeaderInfo",
}