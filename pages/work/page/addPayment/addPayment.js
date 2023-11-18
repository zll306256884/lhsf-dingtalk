import {isEmpty,isEqual} from "../../../../utils/utils"
import config from "../../../../utils/config"
import connector from "../../../../server/workServer/addInvestment"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
Page({
  data: {
    navbarData: {
      title: "新增支付申请",
  },
    sort:'0',
    disabled:false,
  // showDialog:false,
    projectId:"",
    screenExecuteUser: "",
    contractAmount:'',//合同金额
    cumulativePayment:'',//累计已付款
    payAmount:'',//本次应付金额
    paymentNode:'',//支付节点（或形象进度）
    paymentContent:'',//付款内容
    applicationTime:"",
    countersignLeader_text: "",//会签分管领导
    countersignLeader:"",
    dialogScreenExecuteUserRef: null,
    dialogScreenShiGongUnitRef: null,
    chooseExecuteUserList: [],
    investmentFileList:[],
    screenShiGongUnitData: {},
    isEdit: false,
    id:'',
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
    proceedsData:{},//收款单位
    icMeasurementPaymentId:''
  },
  onLoad(option) {
    console.log(option,'23232323');
    this.setData({
      id:option.id,
    })
    if(option.id){
      this.getEdit(option.id) 
    }
    if(option.sort === '1'){
      this.data.disabled = true
     this.data.navbarData.title = '编辑支付申请'
    }else{
      this.data.navbarData.title = '新增支付申请'
    }
  },
  // 合同名称
  bindChooseContractNameTap:function(e){
    if (this.data.isEdit) return;
    if (this.dialogScreenpcontractRef) this.dialogScreenpcontractRef._showDialog(this.data.contractData.contractId)
  },
  onSaveDialogScreencontractRef:function (ref) {
    this.dialogScreenpcontractRef = ref;
  },
  bindChooseContractCallBack: function (data) {
    this.setData({
      contractData: data || {},
      contractAmount:data.contractAmount,
      'slowUnitData.unitName':'',
      'proceedsData.unitName':'',
    });
    request.doPostRequest({
      url: config.API_CONTRACT_TO_MONEY,
      data: {
        contractId:data.contractId,
      },
      success: res => {
        this.setData({
          cumulativePayment: res.data || 0,
        });
      }
    })
  },
// 项目名称
bindChooseProjectTap:function (e) {
  if (this.data.isEdit) return;
  if (this.dialogScreenprojectRef) this.dialogScreenprojectRef._showDialog(this.data.projectData.id)
},
onSaveDialogScreenprojecteRef: function (ref) {
  this.dialogScreenprojectRef = ref;
},
bindChooseProjectCallBack: function (data) {
  this.setData({
    projectData: data || {},
    projectLeader:data.projectLeaderName,
    affiliateUnit:data.affiliatedUnitName,
    projectId:data.id || '',
    'contractData.contractName': '',
    "contractData.contractId":'',
    contractAmount:'',
    cumulativePayment:'',
    'slowUnitData.unitName':'',
    'proceedsData.unitName':'',
  });
},
//项目类型
  bindChooseProjectTypeTap: function (e) {
    if (this.data.isEdit) return;
    if (this.dialogScreenprojectTypeRef) this.dialogScreenprojectTypeRef._showDialog(this.data.projectTypeData.itemValue)
  },
  onSaveDialogScreenprojectTypeRef: function (ref) {
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
  this.dialogScreenpProceedsUnitRef = ref;
},
bindChooseProceedsUnitCallBack:function(data){
  this.setData({
    proceedsData: data || {},
  });
},
// 申请日期
bindChooseApplyDateTap :function(e){
  if (this.dialogScreenApplyDateRef) this.dialogScreenApplyDateRef._showDialog()
},
onSaveDialogScreenApplyDateRef:function(ref){
  this.dialogScreenApplyDateRef = ref
},
bindChooseApplyDateCallBack(data){
  this.setData({
    applicationTime: data.startDate || '',
  });
},
// 上传
onSaveUploadImgRef: function (ref) {
  console.log(ref,'qwqwqwqwqwqwqw');
  this.uploadImgRef = ref;
  console.log(this.uploadImgRef);
},
 //会签分管领导
  bindChooseExecuteUserTap: function (e) {
  //   this.setData({
  //     showDialog: true
  // });
    if (this.dialogScreenExecuteUserRef) this.dialogScreenExecuteUserRef._showDialog()
},
 onSaveDialogScreenExecuteUserRef: function (ref) {
  this.dialogScreenExecuteUserRef = ref;
},
bindScreenExecuteUserCallBack: function (list) {
  this.chooseExecuteUserList = list;

  let str = "";
  let strId = ""
  for (let item of this.chooseExecuteUserList) {
      str += item.username;
      str += ",";
      strId += item.userId;
      strId += ','
  }

  this.setData({
    countersignLeader_text: isEmpty(str) ? '' : str.substring(0, str.length - 1),
    countersignLeader: isEmpty(strId) ? '' : strId.substring(0, strId.length - 1)

  });
},
//所属单位
_bindChooseShiGongUnitTap: function (e) {
  if (this.dialogScreenShiGongUnitRef) this.dialogScreenShiGongUnitRef._showDialog();
},

_onSaveDialogScreenShiGongUnitRef: function (ref) {
  this.dialogScreenShiGongUnitRef = ref;
},
_bindScreenShiGongUnitCallBack: function (data) {
  this.setData({
      screenShiGongUnitData: data
  });

  // this._getLastSubmitInfo();
},
// 编辑
getEdit(id){
  request.doPostRequest({
    url: connector.API_PAY_DETAIL_POST,
    data: {
     id:id
    },
    success: res => {
      console.log(res);
      this.setData({
        'projectTypeData.itemText':res.data.projectType_dictText,
        'projectTypeData.itemValue':res.data.projectType,
        'projectData.name':res.data.projectName,
        'projectData.id':res.data.projectId,
        projectId:res.data.projectId,
        projectLeader:res.data.projectLeader,
        affiliateUnit:res.data.affiliateUnit,
        'contractData.contractName':res.data.contractName,
        'contractData.contractId':res.data.contractId,
        contractAmount:res.data.contractAmount,
        cumulativePayment:res.data.cumulativePayment,
        // 'slowUnitData.id':res.data.payUnitId,
        'slowUnitData.unitName':res.data.payUnit,
        'proceedsData.unitName':res.data.receiverUnit,
        icMeasurementPaymentId:res.data.icMeasurementPaymentId,
        payAmount:res.data.payAmount,
        paymentNode:res.data.paymentNode,
        paymentContent:res.data.paymentContent,
        applicationTime:res.data.applicationTime,
        countersignLeader:res.data.countersignLeader,
        countersignLeader_text:res.data.countersignLeader_dictText,
        investmentFileList:res.data.investmentFileList
      })
      const files= res.data.investmentFileList.map((item)=>{
        return {
          ...item,
          name:item.fileName,
        }
      })
      setTimeout(() => {
        this.uploadImgRef._setImageList(files) 
      }, 0);
    }
  })
},
//bind form submit
bindFormSubmit: function (e) {
  let payAmount = e.detail.value.payAmount
  let paymentNode = e.detail.value.paymentNode
  let paymentContent = e.detail.value.paymentContent
  let btnIndex =e.buttonTarget.dataset.flag
  /// 暂存
    let investmentFileList = [], temFileList=[]
   
    console.log(this.uploadImgRef);
    if (this.uploadImgRef) {
      temFileList = this.uploadImgRef.data.imgList;
    // console.log( investmentFileList);
    for (let item of temFileList) {
      investmentFileList.push({
          type: 3,
          fileName: item.name,
          size: item.size,
          url: item.url,
      })
  }
}

  if(isEqual(btnIndex,1)){
    if (ddUtils.showEmptyToastTips(this.data.projectData.id, "项目名称必填")) return;
    if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "合同名称必填")) return;
    request.doPostRequest({
      url: connector.API_TS_TO_POST,
      data: {
        projectType:this.data.projectTypeData.itemValue,
        projectId:this.data.projectData.id,
        projectName:this.data.projectData.name,
        projectLeader:this.data.projectLeader,
        affiliateUnit:this.data.affiliateUnit,
        contractId:this.data.contractData.contractId,
        contractName: this.data.contractData.contractName,
        contractAmount:this.data.contractAmount,
        cumulativePayment:this.data.cumulativePayment,
        payUnit:this.data.slowUnitData.unitName,
        payUnitId:this.data.slowUnitData.id,
        receiverUnit:this.data.proceedsData.unitName,
        receiverUnitId:this.data.proceedsData.id,
        payAmount:payAmount,
        paymentNode:paymentNode,
        paymentContent:paymentContent,
        id:this.data.id?this.data.id:'',
        icMeasurementPaymentId:this.data.icMeasurementPaymentId,
        applicationTime:this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':'',
        countersignLeader_text:this.data.countersignLeader_text,//负责人
        countersignLeader:this.data.countersignLeader,//,
        investmentFileList:investmentFileList,
        vueUrl:'approveMoneyPaymentDetails',
      },
      success: res => {
        ddUtils.showToast({
          title:"暂存成功"
       })
       ddUtils.navigateBack();
      }
    })
  }else{
    console.log(this.data.countersignLeader_text);
    console.log(this.data.applicationTime);
  if(!this.data.isEdit){
    if (ddUtils.showEmptyToastTips(this.data.projectTypeData.itemValue, "请选择项目类型")) return;
    if (ddUtils.showEmptyToastTips(this.data.projectData.id, "请选择项目名称")) return;
    if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "请选择合同名称")) return;
    if (ddUtils.showEmptyToastTips(this.data.slowUnitData.unitName, "请选择付款单元")) return;
    if (ddUtils.showEmptyToastTips(this.data.proceedsData.unitName, "请选择收款单元")) return;
    if (ddUtils.showEmptyToastTips(payAmount, "请输入应付金额")) return;
    if (ddUtils.showEmptyToastTips(paymentNode, "请输入支付节点（或形象进度）")) return;
    if (ddUtils.showEmptyToastTips(paymentContent, "请输入付款内容")) return;
    if (ddUtils.showEmptyToastTips(this.data.applicationTime, "请选择申请日期")) return;
    if (ddUtils.showEmptyArrayTips(investmentFileList, "请上传")) return;
  }
  // if (ddUtils.showEmptyArrayTips(this.data.countersignLeader_text, "请选择会签分管领导")) return;
  request.doPostRequest({
    url: connector.API_PAY_BUT_POST,
    data: {
      projectType:this.data.projectTypeData.itemValue,
      projectId:this.data.projectData.id,
      projectName:this.data.projectData.name,
      projectLeader:this.data.projectLeader,
      affiliateUnit:this.data.affiliateUnit,
      contractId:this.data.contractData.contractId,
      contractName: this.data.contractData.contractName,
      contractAmount:this.data.contractAmount,
      cumulativePayment:this.data.cumulativePayment,
      payUnit:this.data.slowUnitData.unitName,
      payUnitId:this.data.slowUnitData.id,
      receiverUnit:this.data.proceedsData.unitName,
      receiverUnitId:this.data.proceedsData.id,
      payAmount:payAmount,
      id:this.data.id?this.data.id:'',
      paymentNode:paymentNode,
      paymentContent:paymentContent,
      icMeasurementPaymentId:this.data.icMeasurementPaymentId,
      applicationTime:this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':'',
      countersignLeader_text:this.data.countersignLeader_text,//负责人
      countersignLeader:this.data.countersignLeader,//,
      investmentFileList:investmentFileList,
      vueUrl:'approveMoneyPaymentDetails',
    },
    success: res => {
      ddUtils.showToast({
        title:"提交成功"
     })
     ddUtils.navigateBack();
    }
  })
//   let investmentFileList = [];
//   if (this.uploadImgRef) {
//     investmentFileList = this.uploadImgRef._getUploadImgId().imgIdList;
// }

}
  },

// 取消
bindCancelTap: function (e) {
  ddUtils.navigateBack();
},
});
