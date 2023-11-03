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
  
}