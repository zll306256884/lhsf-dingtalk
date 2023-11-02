import { API_HOST } from "../../utils/config.js"
module.exports = {
  // 项目累计金额
  API_PROJECT_TO_POST: API_HOST + "/investment/changeManagement/selectProjectCumulativeChange",
  //合同累计金额及变更率
  API_CONTRACT_CUMULATIVE: API_HOST + '/investment/changeManagement/selectContractCumulativeChange'
}