import { Form } from 'antd-mini/es/Form/form';
import {isEmpty} from "../../../../utils/utils"
import config from "../../../../server/workServer/addInvestment"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
Page({
  form: new Form(),
  data: {
    navbarData: {
      title: "竣工结算登记",
  },
  disabled:false,
  sort:'0',
  radioGroupOptions: [
    { value: 1, label: '核减' },
    { value: 2, label: '核增' },
  ],
  projectId:"",
  id:"",
  checked:false,
  contractAmount:"",//合同金额
  contractorName:'',//承包商名称
  applicationTime:"",//申请日期
  pricingTrial:'',//送审定价
  adjust:'',
  netAccountAmount:'',// 净核算金额,
  approveTotalPrice:"",//审定总价
  chooseExecuteUserList: [],
  uploadImgRef:null,/// 上传,
  investmentFileList:[],
    isEdit: false,
    projectData:{},// 项目名称,
    dialogScreenprojectRef:null, //项目名称
    dialogScreenpcontractRef:null,//合同名称
    dialogScreenApplyDateRef:null,//申请会签批准日期
    contractData:{},//合同名称
  },
  onLoad(option) {
    let date = new Date().toLocaleString()
          for (var i = 0; i < date.length; i++) {
            if (date[i] === '/') {
              date = date.replace('/', '-') // 注意替换之后就变成新数组了
            }
          }
          this.data.applicationTime = date.substr(0,10)
    this.setData({
      id:option.id
    })
    if(option.id){
      this.getEdit(option.id) 
    }
    if(option.sort === '1'){
       this.data.disabled = true
      this.data.navbarData.title = '编辑竣工结算登记'
     }else{
       this.data.navbarData.title = '新增竣工结算登记'
     }
  },
  handleRef(ref) {
    console.log(ref);
    this.form.addItem(ref);
  },
  onChange(row){
    this.setData({
      adjust: row,
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
  this.setData({
    projectData: data || {},
    projectLeader:data.projectLeaderName,
    affiliateUnit:data.affiliatedUnitName,
    projectId:data.id || '',
    'contractData.contractName':'',
    "contractData.contractId":'',
    contractAmount:'',
    contractorName:''
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
    contractAmount:data.contractAmount,
    contractorName:data.unitPartyName
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
    applicationTime: data.startDate || '',
  });
},
// 上传
onSaveUploadImgRef: function (ref) {
  this.uploadImgRef = ref;
},
// 编辑
getEdit(id){
request.doPostRequest({
  url: config.API_BE_DETAIL_POST,
  data: {
   id:id
  },
  success:res=>{
    console.log(res);
    this.setData({
      'projectData.name':res.data.projectName,
      'projectData.id':res.data.projectId,
      'contractData.contractName':res.data.contractName,
      'contractData.contractId':res.data.contractId,
      contractAmount:res.data.contractAmount,
      contractorName:res.data.contractorName,
      applicationTime:res.data.applicationTime,
      pricingTrial:res.data.pricingTrial,
      netAccountAmount:res.data.netAccountAmount,
      approveTotalPrice:res.data.approveTotalPrice,
      adjust:res.data.adjust,
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
  let pricingTrial = e.detail.value.pricingTrial
  let netAccountAmount = e.detail.value.netAccountAmount
  let approveTotalPrice = e.detail.value.approveTotalPrice
//   let investmentFileList = [],temFileList=[]
//   if (this.uploadImgRef) {
//     temFileList = this.uploadImgRef._getUploadImgId().imgList;
// }
let investmentFileList = [], temFileList=[]
if (this.uploadImgRef) {
  temFileList = this.uploadImgRef.data.imgList;
// console.log( investmentFileList);
for (let item of temFileList) {
  investmentFileList.push({
      type: 4,
      fileName: item.name,
      size: item.size,
      url: item.url,
  })
}
}
if(!this.data.isEdit){
    if (ddUtils.showEmptyToastTips(this.data.projectData.id, "项目名称必填")) return;
    if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "合同名称必填")) return;
    if (ddUtils.showEmptyToastTips(this.data.applicationTime, "请选择申请日期")) return;
    if (ddUtils.showEmptyToastTips(pricingTrial, "请输入送审定价")) return;
    if (ddUtils.showEmptyToastTips(this.data.adjust, "请选择核增或核减")) return;
    if (ddUtils.showEmptyToastTips(netAccountAmount, "请输入净核算金额")) return;
    if (ddUtils.showEmptyToastTips(approveTotalPrice, "请选择审定总价")) return;
  }
  // if(this.data.adjust=== ''){
  //   ddUtils.showToast({
  //     title:"保存成功"
  //  })
  // }
  if (ddUtils.showEmptyArrayTips(investmentFileList, "请上传合同正式稿及相关附件")) return;
request.doPostRequest({
  url: config.API_JUNGONG_ADD_POST,
  data: {
    projectId:this.data.projectData.id,
    projectName:this.data.projectData.name,
    contractId:this.data.contractData.contractId,
    contractName: this.data.contractData.contractName,
    contractAmount:this.data.contractAmount,
    contractorName:this.data.contractorName,
    investmentFileList:investmentFileList,
    applicationTime:this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':'',
  pricingTrial:pricingTrial,
  id:this.data.id?this.data.id:'',
  adjust:this.data.adjust,
  netAccountAmount:netAccountAmount,
  approveTotalPrice:approveTotalPrice,
  vueUrl: 'completed'
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
