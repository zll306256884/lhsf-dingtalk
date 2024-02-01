
//  测试配置
const BASE_API_HOST = "http://192.168.6.41";
const API_HOST = BASE_API_HOST + "/prod-api";

// const BASE_API_HOST = "http://36.140.119.18:443";

// 线上配置
// const BASE_API_HOST = "https://xmgk.lhbigdata.com";
// const API_HOST = BASE_API_HOST + "/prod-api";


const API_IMG_URL = "https://eos-shanghai-2.cmecloud.cn/";



module.exports = {
    API_HOST: API_HOST,
    API_IMG_URL: API_IMG_URL,
    BASE_API_HOST: BASE_API_HOST,
    //查询oa组织下人员列表
    API_OA_COMPANY_STAFF_LIST: API_HOST + "/platform/organize/queryStaffList",
    // 筛选模糊查询oa组织下人员列表
     API_OA_COMPANY_NAME:API_HOST + "/platform/organize/queryStaffListByName",
    //所属单位
    API_SHO_SHU_DAN_WEI_LIST: API_HOST +'/platform/organize/queryTopList',
    // 项目类型
    API_PROJECT_TYPE :API_HOST +'/platform/sysDictItem/queryListByCode?dictCode=investment_project_type',
     // 项目名称
     API_PROJECT_NAME :API_HOST +'/integratedService/projectInfo/queryRoleProjectList',
      // 启用中-项目名称
      API_INIT_PROJECT_NAME :API_HOST +'/control/plan/queryEnableProejctInfo',
      // 合同名称
      API_CONTRACT_NAME :API_HOST +'/tender/contractLedger/list',
      // 合同下累计金额
      API_CONTRACT_TO_MONEY :API_HOST +'/investment/icMeasurementPayment/payment',
   
    // 获取补充协议
    API_SELECT_SUPPLEMENTAL_AGREEMENT :API_HOST +'/tender/contract/selectSupplementalAgreement',
   
    // 获取在途资金
    API_AmountPaid :API_HOST +'/investment/icMeasurementPaymentEngineeringDetailed/amountPaid',
    
    // 款项类型
    API_FUKUAN_TYPE :API_HOST +'/integratedService/currentUnit/queryAllCurrentUnit',
    // 款项类型
    API_SELECT_BYCONTRACT_ID_WITHUNIT :API_HOST +'/tender/contract/selectByContractIdWithUnit',
    //数据字典列表
    API_SCREEN_STATUS_BY_CODE: API_HOST + "/platform/sysDictItem/queryListByCode?dictCode=",
    //上传获取签名
    API_GET_SIGN: API_HOST + "/file/file/getSign",
    //获取菜单权限
    API_MENU_LIST: API_HOST + "/platform/account/getPermissionByToken",

    //oss文件下载到钉盘
    API_FILE_SETURL: API_HOST + "/platform/ddInfo/uploadFileOss",
    //文件下载钉盘地址获取
    API_FILE_GETURL: API_HOST + "/platform/ddInfo/uploadFileDingTalk",
    //根据分管领导平台角色查询用户
    API_QUERY_USER_BY_ROLR: API_HOST + "/platform/user/queryUserByRole",
}