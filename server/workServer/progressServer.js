import {
  API_HOST
} from "../../utils/config.js"

module.exports = {

  // 获取进度节点
  API_PROGRESS_LIST: API_HOST + "/control/planTask/queryNewPlanTaskList",
  // 获取进度节点（新接口）
  API_PROGRESS_NODE_LIST: API_HOST + "/control/planTask/queryNodeOverList",
  // 获取填报记录信息 -查询计划详情
  API_PROGRESS_DETAIL: API_HOST + "/control/planTask/selectDetailById",
  // 保存填报
  API_SAVE_PROGRESS: API_HOST + "/control/planTask/fillConstructionPlan",
  // 查询 -- 请求进度详情  头部数据
  API_TOP_MESSAGE: API_HOST + "/control/plan/queryPlanByCondition",
  // 删除节点
  API_DETELE_NODE: API_HOST + "/control/plan/batchDeleteByIds",
  // 看板  --   详情信息
  API_BANK_DETAIL: API_HOST + "/control/planTask/selectPlanTaskDetailById",
  // 看板 --  现场实景
  API_BANK_SIT: API_HOST + "/integratedService/projectInfoFile/querySitProgressList",

  // 通过id查询电话id
  API_CALL_CODE: API_HOST + "/platform/user/selectUserDetailById",

  // 查询监控
  API_FILE_INFO: API_HOST + "/integratedService/projectHkVedioFileInfo/queryProjectVedioFileInfo",

    // 获取监控信息
    API_INTER_FACE_INFO: API_HOST + "/integratedService/projectHkVedioFileInfo/interfaceInfo",
    // 获取监控url
    API_INTER_URL: API_HOST + "/integratedService/projectHkVedioFileInfo/queryProjectVedioByProtocolInfo",


}