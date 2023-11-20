import { API_HOST } from "../../utils/config.js"

module.exports = {
  //待审批列表
  API_APPROVAL_LIST: API_HOST + "/jflow/audit/selectAuditPending",
  API_TASK_LIST: API_HOST  + "/mission/mainMission/queryListByPage",
  API_QUERY_LIST: API_HOST  +  "/platform/userMatter/queryListByPage",
  API_ALL_WAIT_LIST: API_HOST  +  "/mission/mainMission/queryList",
  // 我的任务
  API_CREATE_TASK: API_HOST  + "/mission/mainMission/create",
  API_READ_TASK: API_HOST  + "/mission/mainMission/read",
  //消息
  API_MESSAGE_POST:API_HOST  + "/message/messageCenter/select",
  API_SELECT_TASK: API_HOST  + "/mission/mainMission/selectDetailById",
  API_MODIFY_TASK: API_HOST  + "/mission/mainMission/modifyById",
  API_FINISH_TASK: API_HOST  + "/mission/mainMission/finish",
  API_REMIND_TASK: API_HOST  + "/mission/mainMission/remind",
  API_DELETE_TASK: API_HOST  + "/mission/mainMission/deleteById",
  API_CANCEL_TASK: API_HOST  +  "/mission/mainMission/cancel",
  API_MESSAGE_READ_TASK: API_HOST  +  "/message/messageCenter/read",
  // 未读消息
  API_UNMESSAGE_TO_POST:API_HOST +'/message/messageCenter/unReadMessageTotal',
  //撤回审批查询信息
  API_JFLOWAUDIT_SELET_INFO: API_HOST  + "/jflow/jflowAuditRecord/selectByKeyId",
  //撤回审批
  API_AUDIT_WITHDRAW: API_HOST  + "/jflow/audit/withdrawAudit",
  //审批通过
  API_JFLOW_ADOPTAUDIT: API_HOST  + "/jflow/audit/adoptAudit",
  //jflow拒绝
  API_JFLOW_REFUSEAUDIT: API_HOST  + "/jflow/audit/refuseAudit",
  //根据id查询流程数据--------公共调用接口（前端调用）
  API_SELECT_DETAIL: API_HOST  + "/jflow/jflowAuditRecord/selectById",
  //设置审批记录已读/未读
  API_Audit_UPDATE: API_HOST  + "/jflow/audit/updateIsRead",
  // 系统公告
  API_NOTICE_MESSAGE:API_HOST + "/message/systemNotice/selectById"
}

