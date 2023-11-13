import { API_HOST } from "../../utils/config.js"

module.exports = {
  // 地图分布
  API_MAP_PROJECT_LIST: API_HOST +  "/large-screen/projectDistributionMap/queryProjectDistributionList",


  //项目招标进度
  API_BIDDING_PROGRESS: API_HOST + "/tender/biddingProgress/projectBiddingProgress",
  //年度招标进度
  API_TENDER_PROGRESS: API_HOST + "/large-screen/tenderProcess/statisticsTenderProcess",
  //
  API_AMOUNTCONTROL: API_HOST + "/large-screen/amountControl/statisticsAmountControl",
  //招标文件分页
  API_TENDER_DOCUMENT_LIST: API_HOST + "/tender/tenderDocument/page",
  //合同分页
  API_TENDER_CONTRACT_LIST: API_HOST + "/tender/contract/page",

  //年度合同 
  API_ANNUAL_PROJECTCONTRACT: API_HOST + "/tender/contract/projectContract",
  //年度招标文件
  API_ANNUAL_PROJECTDOCUMENT: API_HOST + "/tender/tenderDocument/projectTenderDocument",
}