import { API_HOST } from "../../utils/config.js"

module.exports = {
  //待审批列表
  API_APPROVAL_LIST: API_HOST + "/jflow/audit/selectAuditPending",
  API_TASK_LIST: API_HOST  + "/mission/mainMission/queryListByPage",
  API_QUERY_LIST: API_HOST  +  "/platform/userMatter/queryListByPage",
  API_ALL_WAIT_LIST: API_HOST  +  "/mission/mainMission/queryList",
  // 我的任务
  API_CREATE_TASK: API_HOST  + "/mission/mainMission/create",
  //消息
  API_MESSAGE_POST:API_HOST  + "/message/messageCenter/select",
}

