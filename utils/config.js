
//  测试配置
const BASE_API_HOST = "http://192.168.6.41";
const API_HOST = BASE_API_HOST + "/prod-api";

// 线上配置
// const BASE_API_HOST = "http://team.wzpm.com.cn";
// const API_HOST = BASE_API_HOST + "/online-api";


const API_IMG_URL = "https://eos-shanghai-2.cmecloud.cn/";



module.exports = {
    API_HOST: API_HOST,
    API_IMG_URL: API_IMG_URL,
    //查询oa组织下人员列表
    API_OA_COMPANY_STAFF_LIST: API_HOST + "/platform/organize/queryStaffList",
    //所属单位
    API_SHO_SHU_DAN_WEI_LIST: API_HOST +'/platform/organize/queryTopList',
    // 项目类型
    API_PROJECT_TYPE :API_HOST +'/platform/sysDictItem/queryListByCode?dictCode=investment_project_type',
     // 项目名称
     API_PROJECT_NAME :API_HOST +'/integratedService/projectInfo/queryRoleProjectList',
      // 合同名称
      API_CONTRACT_NAME :API_HOST +'/tender/contractLedger/list',
        // 合同下累计金额
        API_CONTRACT_TO_MONEY :API_HOST +'/investment/icMeasurementPayment/payment'
}