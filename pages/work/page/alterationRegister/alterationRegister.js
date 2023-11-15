import {isEmpty} from "../../../../utils/utils"
import config from "../../../../server/workServer/addInvestment"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
Page({
  data: {
    navbarData: {
      title: "新增变更",
  },
  disabled:false,
  projectId:"",
  contactNoticeName:"",//联系单名称
  projectLeader:'',//负责人
  affiliateUnit:'',//所属单位,
  projectChangeAmount:'',//项目累计变更
  contractAmount:"",//合同金额
  changeAmount:"",//变更金额
  contractCumulativeChange:"",//合同累积变更（万元）
  contractChangeRate:"", // 合同变更率
  countersignDate:"",// 申请会签批准日期
  constructionUnitReportDate:"",//施工单位上报日期
  changeContentTime:"",//变更内容完成时间
  contactChange:"",//联系单变更内容
  remark:"",//备注
  person:'',
  person_text:'',
  chooseExecuteUserList: [],
  investmentFileList:[],
  id:'',
    isEdit: false,
    projectData:{},// 项目名称,
    dialogScreenprojectRef:null, //项目名称
    dialogScreenpcontractRef:null,//合同名称
    dialogScreenApplyDateRef:null,//申请会签批准日期
    dialogScreenChangeDateRef:null,
    dialogScreenBuildDateRef:null,
    dialogScreenExecuteUserRef:null,
    contractData:{},//合同名称
  },
  uploadImgRef:null,/// 上传
  onLoad(option) {
    let date = new Date().toLocaleString()
    for (var i = 0; i < date.length; i++) {
      if (date[i] === '/') {
        date = date.replace('/', '-') // 注意替换之后就变成新数组了
      }
    }
    this.data.countersignDate = date.substr(0,10)
    console.log(option,'23232323');
    this.setData({
      id:option.id
    })
    if(option.id){
      this.data.disabled = true
      this.getDetail(option.id) 
    }
  },

// 项目名称
bindChooseProjectTap:function (e) {
  console.log(e);
  if (this.data.isEdit) return;
  if (this.dialogScreenprojectRef) this.dialogScreenprojectRef._showDialog(this.data.projectData.id)
},
onSaveDialogScreenprojecteRef: function (ref) {
  console.log(ref);
  this.dialogScreenprojectRef = ref;
},
bindChooseProjectCallBack: function (data) {
  this.setData({
    projectData: data || {},
    projectLeader:data.projectLeaderName,
    affiliateUnit:data.affiliatedUnitName,
    projectId:data.id || '',
    'contractData.contractName': '',
    contractAmount:'',
    contractCumulativeChange:'',
    contractChangeRate:''
  });
  request.doPostRequest({
    url: config.API_PROJECT_TO_POST,
    data: {
      projectId:data.id,
    },
    success: res => {
      console.log();
      this.setData({
        projectChangeAmount: res.data.projectCumulativeChange || 0,
      });
    }
  })
  console.log(this.data.projectData,'this.data.projectData');
},
 // 合同名称
 bindChooseContractNameTap:function(e){
  if (this.data.isEdit) return;
  if (this.dialogScreenpcontractRef) this.dialogScreenpcontractRef._showDialog(this.data.contractData.contractId)
},
onSaveDialogScreencontractRef:function (ref) {
  console.log(ref);
  this.dialogScreenpcontractRef = ref;
},
bindChooseContractCallBack: function (data) {
  console.log(data,"data");
  this.setData({
    contractData: data || {},
    contractAmount:data.contractAmount
  });
  request.doPostRequest({
    url: config.API_CONTRACT_CUMULATIVE,
    data: {
      contractId:data.contractId,
      projectId:this.data.projectId
    },
    success: res => {
      console.log(res);
      this.setData({
        contractCumulativeChange: res.data.contractCumulativeChange || 0,
        contractChangeRate: res.data.contractCumulativeChangeRate || 0,
      });
    }
  })
},

// 申请会签批准日期
bindChooseApplyDateTap :function(e){
  console.log(e);
  if (this.dialogScreenApplyDateRef) this.dialogScreenApplyDateRef._showDialog()
},
onSaveDialogScreenApplyDateRef:function(ref){
  this.dialogScreenApplyDateRef = ref
},
bindChooseApplyDateCallBack(data){
  console.log(data,333333333333333);
  this.setData({
    countersignDate: data.startDate || '',
  });
},
// 变更内容完成时间
bindChooseChangeDateTap :function(e){
  console.log(e);
  if (this.dialogScreenChangeDateRef) this.dialogScreenChangeDateRef._showDialog()
},
onSaveDialogScreenChangeDateRef:function(ref){
  this.dialogScreenChangeDateRef = ref
},
bindChooseChangeDateCallBack(data){
  console.log(data,333333333333333);
  this.setData({
    changeContentTime: data.startDate || '',
  });
},

// 施工单位上报日期
bindChooseBuildDateTap :function(e){
  console.log(e);
  if (this.dialogScreenBuildDateRef) this.dialogScreenBuildDateRef._showDialog()
},
onSaveDialogScreenBuildDateRef:function(ref){
  this.dialogScreenBuildDateRef = ref
},
bindChooseBuildDateCallBack(data){
  console.log(data,333333333333333);
  this.setData({
    constructionUnitReportDate: data.startDate || '',
  });
},
  //抄送人
  bindChooseExecuteUserTap: function (e) {
    //   this.setData({
    //     showDialog: true
    // });
      console.log(e);
      if (this.dialogScreenExecuteUserRef) this.dialogScreenExecuteUserRef._showDialog()
  },
   onSaveDialogScreenExecuteUserRef: function (ref) {
     console.log(ref);
    this.dialogScreenExecuteUserRef = ref;
  },
  bindScreenExecuteUserCallBack: function (list) {
    console.log(list);
    this.chooseExecuteUserList = list;
  
    let str = "";
    let strId = ""
    for (let item of this.chooseExecuteUserList) {
        str += item.username;
        strId +=item.userId
        str += ",";
        strId += ","
    }
    this.setData({
      person_text: isEmpty(str) ? '' : str.substring(0, str.length - 1),
      person: isEmpty(strId) ? '' : strId.substring(0, strId.length - 1)

    });
  },
// 上传
onSaveUploadImgRef: function (ref) {
  this.uploadImgRef = ref;
},
// 编辑 
getDetail(id){
  request.doPostRequest({
    url: config.API_ALTER_DETAIL_POST,
    data: {
     id:id
    },
    success: res => {
      console.log(res,3333333333333333);
      this.setData({
        contactNoticeName:res.data.contactNoticeName,
        'projectData.name':res.data.projectName,
        'projectData.id':res.data.projectId,
        projectLeader:res.data.projectLeader,
        affiliateUnit:res.data.affiliateUnit,
        projectChangeAmount:res.data.projectChangeAmount,
        'contractData.contractName':res.data.contractName,
        'contractData.contractId':res.data.contractId,
        contractAmount:res.data.contractAmount,
        changeAmount:res.data.changeAmount,
        contractCumulativeChange:res.data.contractCumulativeChange,
        contractChangeRate:res.data.contractChangeRate,
        countersignDate:res.data.countersignDate,
        changeContentTime:res.data.changeContentTime,
        investmentFileList:res.data.investmentFileList,
        constructionUnitReportDate:res.data.constructionUnitReportDate,
        contactChange:res.data.contactChange,
        remark:res.data.remark,
        person_text:res.data.person_dictText,
        person:res.data.person
      });
      setTimeout(() => {
        this.uploadImgRef._setImageList(res.data.investmentFileList?res.data.investmentFileList:'') 
      }, 0);
    }
  })
},
//bind form submit
bindFormSubmit: function (e) {
  console.log(this.data.contactNoticeName);
  console.log(e,999999999999999);
  let changeAmount = e.detail.value.changeAmount
  let contactChange = e.detail.value.contactChange
  let contactNoticeName = e.detail.value.contactNoticeName
  let remark = e.detail.value.remark
//   let investmentFileList = [],temFileList=[]
//   if (this.uploadImgRef) {
//     temFileList = this.uploadImgRef._getUploadImgId().imgList;
// }
let investmentFileList = [], temFileList=[]
if (this.uploadImgRef) {
  temFileList = this.uploadImgRef.data.imgList;
for (let item of temFileList) {
  investmentFileList.push({
      type: 0,
      fileName: item.name,
      size: item.size,
      url: item.url,
  })
}
}

if(!this.data.isEdit){
    if (ddUtils.showEmptyToastTips(contactNoticeName, "请输入联系单名称")) return;
    if (ddUtils.showEmptyToastTips(this.data.projectData.id, "项目名称必填")) return;
    if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "合同名称必填")) return;
    if (ddUtils.showEmptyToastTips(changeAmount, "请输入变更金额")) return;
    if (ddUtils.showEmptyToastTips(this.data.countersignDate, "请选择申请会签批准日期")) return;
    // if (ddUtils.showEmptyToastTips(this.data.changeContentTime, "请选择变更内容完成时间")) return;
    if (ddUtils.showEmptyToastTips(this.data.constructionUnitReportDate, "请选择施工单位上报日期")) return;
    if (ddUtils.showEmptyToastTips(contactChange, "请输入变更内容")) return;
  }
  if (ddUtils.showEmptyArrayTips(investmentFileList, "请上传合同正式稿及相关附件")) return;
request.doPostRequest({
  url: config.API_ALTER_ADD_POST,
  data: {
    contactNoticeName:contactNoticeName,//联系单名称
    projectId:this.data.projectData.id,
    projectName:this.data.projectData.name,
    projectLeader:this.data.projectLeader,
    affiliateUnit:this.data.affiliateUnit,
    projectChangeAmount:this.data.projectChangeAmount,//项目累计变更
    contractId:this.data.contractData.contractId,
    contractName: this.data.contractData.contractName,
    contractAmount:this.data.contractAmount,//合同金额
    changeAmount:changeAmount,//变更金额
    contractCumulativeChange:this.data.contractCumulativeChange,//合同累积变更（万元）
  contractChangeRate:this.data.contractChangeRate, // 合同变更率
  countersignDate:this.data.countersignDate,//申请会签批准日期
  changeContentTime:this.data.changeContentTime?this.data.changeContentTime+ ' 00:00:00':'',//变更内容完成时间
  constructionUnitReportDate:this.data.constructionUnitReportDate+ ' 00:00:00',//施工单位上报日期
  contactChange:contactChange,//变更内容
  remark:remark,
  id:this.data.id?this.data.id:'',
  investmentFileList:this.data.id?this.data.investmentFileList:investmentFileList,
  person:this.data.person,
  person_text:this.data.person_text,
  vueUrl: 'approveAlterationAccount,editAlterationContent'
  },
  success: res => {
    ddUtils.showToast({
      title:"保存成功"
   })
   ddUtils.navigateBack();
  }
})


},
// 取消
bindCancelTap: function (e) {
  console.log(12121212);
  ddUtils.navigateBack();
},
});
