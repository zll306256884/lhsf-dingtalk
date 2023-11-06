import { API_HOST } from "../../utils/config.js"

module.exports = {
  //待审批列表
  API_APPROVAL_LIST: API_HOST + "/jflow/audit/selectAuditPending",
  API_TASK_LIST: API_HOST  + "/mission/mainMission/queryListByPage",
  API_QUERY_LIST: API_HOST  +  "/platform/userMatter/queryListByPage",
  API_ALL_WAIT_LIST: API_HOST  +  "/mission/mainMission/queryList",
  // 我的任务
  API_CREATE_TASK: API_HOST  + "/mission/mainMission/create",
  API_SELECT_TASK: API_HOST  + "/mission/mainMission/selectDetailById",
  API_MODIFY_TASK: API_HOST  + "/mission/mainMission/modifyById"
}

