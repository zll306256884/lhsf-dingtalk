import {isEmpty} from "../../../../utils/utils"
import config from "../../../../utils/config"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
Page({
  data: {
    navbarData: {
      title: "新增支付申请",
  },
  // showDialog:false,
    projectId:"",
    screenExecuteUser: "",
    contractAmount:'',//合同金额
    totalPayment:'',//累计已付款
    payAmount:'',//本次应付金额
    paymentNode:'',//支付节点（或形象进度）
    paymentContent:'',//付款内容
    applicationTime:"",
    countersignLeader_text: "",//会签分管领导
    dialogScreenExecuteUserRef: null,
    dialogScreenShiGongUnitRef: null,
    chooseExecuteUserList: [],
    screenShiGongUnitData: {},
    isEdit: false,
    projectLeader:'',//负责人
    affiliateUnit:'',//所属单位,
    dialogScreenprojectTypeRef:null, //项目类型
    dialogScreenprojectRef:null, //项目名称
    dialogScreenpcontractRef:null,
    dialogScreenpslowUnitRef:null,
    dialogScreenpProceedsUnitRef:null,
    dialogScreenApplyDateRef:null, // 申请日期
    uploadImgRef: null,// 上传
    projectTypeData:{},// 项目类型,
    projectData:{},// 项目名称,
    contractData:{},// 合同名称
    slowUnitData:{},//付款单位
    proceedsData:{}//收款单位
  },
  onLoad() {},

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
      url: config.API_CONTRACT_TO_MONEY,
      data: {
        contractId:data.contractId,
      },
      success: res => {
        this.setData({
          totalPayment: res.data || 0,
        });
      }
    })
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
  console.log(data);
  this.setData({
    projectData: data || {},
    projectLeader:data.projectLeaderName,
    affiliateUnit:data.affiliatedUnitName,
    projectId:data.id || ''
  });
  console.log(this.data.projectData,'this.data.projectData');
},
//项目类型
  bindChooseProjectTypeTap: function (e) {
    console.log(e);
    if (this.data.isEdit) return;
    if (this.dialogScreenprojectTypeRef) this.dialogScreenprojectTypeRef._showDialog(this.data.projectTypeData.itemValue)
  },
  onSaveDialogScreenprojectTypeRef: function (ref) {
    console.log(ref);
    this.dialogScreenprojectTypeRef = ref;
},
  bindChooseProjectTypeCallBack: function (data) {
    this.setData({
      projectTypeData: data || {}
    });
},
// 付款单位
bindChooseSlowUnitTap:function(e){
  if (this.data.isEdit) return;
  if (this.dialogScreenpslowUnitRef) this.dialogScreenpslowUnitRef._showDialog(this.data.slowUnitData.id)
},
onSaveDialogScreenslowunitRef:function (ref){
  console.log(ref);
  this.dialogScreenpslowUnitRef = ref;
},
bindChooseSlowUnitCallBack:function(data){
  this.setData({
    slowUnitData: data || {},
  });
},
//收款单位
bindChooseProceedsUnitTap:function(e){
  if (this.data.isEdit) return;
  if (this.dialogScreenpProceedsUnitRef) this.dialogScreenpProceedsUnitRef._showDialog(this.data.proceedsData.id)
},
onSaveDialogScreenproceedsunitRef:function (ref){
  console.log(ref);
  this.dialogScreenpProceedsUnitRef = ref;
},
bindChooseProceedsUnitCallBack:function(data){
  this.setData({
    proceedsData: data || {},
  });
},
// 申请日期
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
    applicationTime: data.startDate || {},
  });
},
// 上传
onSaveUploadImgRef: function (ref) {
  this.uploadImgRef = ref;
},
 //会签分管领导
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
//所属单位
_bindChooseShiGongUnitTap: function (e) {
  console.log(e);
  if (this.dialogScreenShiGongUnitRef) this.dialogScreenShiGongUnitRef._showDialog();
},

_onSaveDialogScreenShiGongUnitRef: function (ref) {
  console.log(ref);
  this.dialogScreenShiGongUnitRef = ref;
},
_bindScreenShiGongUnitCallBack: function (data) {
  console.log(data);
  this.setData({
      screenShiGongUnitData: data
  });

  // this._getLastSubmitInfo();
},

//bind form submit
bindFormSubmit: function (e) {
  console.log(e,999999999999999);
  let payAmount = e.detail.value.payAmount
  let paymentNode = e.detail.value.paymentNode
  let paymentContent = e.detail.value.paymentContent
  if(!this.data.isEdit){
    if (ddUtils.showEmptyToastTips(this.data.projectTypeData.itemValue, "请选择项目类型")) return;
    if (ddUtils.showEmptyToastTips(this.data.projectData.id, "请选择项目名称")) return;
    if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "请选择合同名称")) return;
    if (ddUtils.showEmptyToastTips(this.data.slowUnitData.id, "请选择付款单元")) return;
    if (ddUtils.showEmptyToastTips(this.data.proceedsData.id, "请选择收款单元")) return;
    if (ddUtils.showEmptyToastTips(this.data.slowUnitData.id, "请选择付款单元")) return;
    if (ddUtils.showEmptyToastTips(payAmount, "请输入应付金额")) return;
    if (ddUtils.showEmptyToastTips(paymentNode, "请输入支付节点（或形象进度）")) return;
    if (ddUtils.showEmptyToastTips(paymentContent, "请输入付款内容")) return;
    if (ddUtils.showEmptyToastTips(this.data.applicationTime, "请选择申请日期")) return;

  }
  let investmentFileList = [];
  if (this.uploadImgRef) {
    investmentFileList = this.uploadImgRef._getUploadImgId().imgIdList;
}
if (ddUtils.showEmptyArrayTips(investmentFileList, "请上传")) return;
},
// 取消
bindCancelTap: function (e) {
  console.log(12121212);
  ddUtils.navigateBack();
},
});
