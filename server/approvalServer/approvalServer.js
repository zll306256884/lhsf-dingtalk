import {
  API_HOST
} from "../../utils/config.js"

module.exports = {
  //查询列表
  API_SELECT_LIST: API_HOST + "/jflow/audit/selectAuditPending",
  // 获取审批节点
  API_APPROVAL_LIST: API_HOST + "/jflow/jflowAuditRecord/selAllByKeyId",
  // 获取下一个审批节点
  API_NEXT_APPROVAL_NODE: API_HOST + "/jflow/jflowAuditRecord/selectFlowInfoByKeyId",
   // 设置为  已读
   API_UPLATE_READ: API_HOST + "/jflow/audit/updateIsRead",
}