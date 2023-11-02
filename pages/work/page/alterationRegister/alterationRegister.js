import {isEmpty} from "../../../../utils/utils"
import config from "../../../../server/workServer/addInvestment"
import API_CONTRACT_TO_MONEY from "../../../../utils/config"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
Page({
  data: {
    navbarData: {
      title: "新增变更",
  },
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
  chooseExecuteUserList: [],
  uploadImgRef:null,/// 上传
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
  onLoad() {},

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
    projectId:data.id || ''
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
  
    for (let item of this.chooseExecuteUserList) {
        str += item.username;
        str += ",";
    }
  
    this.setData({
      countersignLeader_text: isEmpty(str) ? '' : str.substring(0, str.length - 1)
    });
  },
// 上传
onSaveUploadImgRef: function (ref) {
  this.uploadImgRef = ref;
},

//bind form submit
bindFormSubmit: function (e) {
  console.log(e,999999999999999);
  let payAmount = e.detail.value.payAmount
  let paymentNode = e.detail.value.paymentNode
  let paymentContent = e.detail.value.paymentContent
  // if(!this.data.isEdit){
  //   if (ddUtils.showEmptyToastTips(this.data.projectTypeData.itemValue, "请选择项目类型")) return;
  //   if (ddUtils.showEmptyToastTips(this.data.projectData.id, "请选择项目名称")) return;
  //   if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "请选择合同名称")) return;
  //   if (ddUtils.showEmptyToastTips(this.data.slowUnitData.id, "请选择付款单元")) return;
  //   if (ddUtils.showEmptyToastTips(this.data.proceedsData.id, "请选择收款单元")) return;
  //   if (ddUtils.showEmptyToastTips(this.data.slowUnitData.id, "请选择付款单元")) return;
  //   if (ddUtils.showEmptyToastTips(payAmount, "请输入应付金额")) return;
  //   if (ddUtils.showEmptyToastTips(paymentNode, "请输入支付节点（或形象进度）")) return;
  //   if (ddUtils.showEmptyToastTips(paymentContent, "请输入付款内容")) return;
  //   if (ddUtils.showEmptyToastTips(this.data.applicationTime, "请选择申请日期")) return;
  // }
  let investmentFileList = [];
  if (this.uploadImgRef) {
    investmentFileList = this.uploadImgRef._getUploadImgId().imgIdList;
}
if (ddUtils.showEmptyArrayTips(investmentFileList, "合同正式稿及相关附件")) return;
},
// 取消
bindCancelTap: function (e) {
  console.log(12121212);
  ddUtils.navigateBack();
},
});
