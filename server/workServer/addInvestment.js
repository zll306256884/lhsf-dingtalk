import { API_HOST } from "../../utils/config.js"
module.exports = {
  // 项目累计金额
  API_PROJECT_TO_POST: API_HOST + "/investment/changeManagement/selectProjectCumulativeChange",
  //合同累计金额及变更率
  API_CONTRACT_CUMULATIVE: API_HOST + '/investment/changeManagement/selectContractCumulativeChange',
   //新增支付暂存
   API_TS_TO_POST: API_HOST + '/investment/icMeasurementPaymentEngineeringDetailed/temporaryStorage',
   // 新增支付提交审批
   API_PAY_BUT_POST : API_HOST + '/investment/icMeasurementPaymentEngineeringDetailed/saveAndSubmit',
   // 变更新增
   API_ALTER_ADD_POST: API_HOST+ '/investment/changeManagement/saveAndUpdate',
   API_JUNGONG_ADD_POST:API_HOST+ '/investment/completionSettlement/add',
   // 项目资金计划头部详情
   API_PROJECT_DETAILS_POST:API_HOST+ '/investment/monthAnnualFundPlan/selectById',
   // 年资金使用计划月计划详细详情
   API_PROJECT_DELS_POST:API_HOST+ '/investment/monthAnnualFundPlanDetail/selectById',
}