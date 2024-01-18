import { API_HOST } from "../../utils/config.js"
module.exports = {
  // 获取补充协议
  API_SELECT_SUPPLEMENTAL_AGREEMENT: API_HOST +'/tender/contract/selectSupplementalAgreement',
   
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
    // 变更详细详情
    API_ALTER_DETAIL_POST:API_HOST+ '/investment/changeManagement/selectById',
    // 款项支付详情
    API_PAY_DETAIL_POST:API_HOST+ '/investment/icMeasurementPaymentEngineeringDetailed/selectById',
    // 竣工结算详情
    API_BE_DETAIL_POST:API_HOST+ '/investment/completionSettlement/selectById',
    // 资金管控
    API_MONEY_POST:API_HOST + '/large-screen/amountControl/statisticsAmountControl',
    // 支付金额
    API_PAY_POST:API_HOST + '/investment/icMeasurementPaymentEngineeringDetailed/projectIcMeasurementPaymentEngineeringDetailed',
    // 变更金额
    API_ALTER_POST:API_HOST + '/investment/changeManagement/projectChangeManagement',
    // 项目资金管控
    API_CONTROL_POST:API_HOST + '/investment/investmentControlFund/investmentControlFund',
    // 项目资金管控支付
    API_ROUTE_POST:API_HOST + '/investment/icMeasurementPaymentEngineeringDetailed/page',
    // 项目资金管控变更
    API_CHANGE_POST:API_HOST + '/investment/changeManagement/page',
    // 变更删除
    API_DELETE_POST:API_HOST + '/platform/userMatter/deleteByArray',
    //资金附件
    API_ASSESSORY_POST:API_HOST + '/investment/investmentFile/queryList',
    //根据合同id查询承包商
    API_SELECT_BYID_WITHUNIT:API_HOST + '/tender/contract/selectByContractIdWithUnit',
    //竣工暂存
    API_TEMPORARY_STORAGE:API_HOST + '/investment/completionSettlement/temporaryStorage',
    //竣工结算新增并审批
    API_COMPLETION_SAVEANDSUBMIT:API_HOST + '/investment/completionSettlement/saveAndSubmit',
    //分管领导
    API_QUERY_USER_BYROLE:API_HOST + '/platform/user/queryUserByRole',
}