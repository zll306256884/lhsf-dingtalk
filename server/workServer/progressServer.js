import {
  API_HOST
} from "../../utils/config.js"

module.exports = {

  // 获取进度节点
  API_PROGRESS_LIST: API_HOST + "/control/planTask/queryNewPlanTaskList",
  // 获取填报记录信息 -查询计划详情
  API_PROGRESS_DETAIL: API_HOST + "/control/planTask/selectDetailById",
  // 保存填报
  API_SAVE_PROGRESS: API_HOST + "/control/planTask/fillConstructionPlan",
  // 查询 -- 请求进度详情  头部数据
  API_TOP_MESSAGE: API_HOST + "/control/plan/queryPlanByCondition",
  // 看板  --   详情信息
  API_BANK_DETAIL: API_HOST + "/control/planTask/selectPlanTaskDetailById",
  // 看板 --  现场实景
  API_BANK_SIT: API_HOST + "/integratedService/projectInfoFile/querySitProgressList",

  // 进度列表 --获取项目接口
}