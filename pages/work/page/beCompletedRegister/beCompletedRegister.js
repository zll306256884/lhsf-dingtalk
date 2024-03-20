import { Form } from 'antd-mini/es/Form/form';
import {isEmpty} from "../../../../utils/utils"
import config from "../../../../server/workServer/addInvestment"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import { formatTimeToDay } from "../../../../utils/utils";

Page({
  form: new Form({
    initialValues: {
      applicationTime: formatTimeToDay(new Date())
    },
  }),
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
    contractId:'',
    id:"",
    contractAmount:"",//合同金额
    contractorName:'',//承包商名称
    applicationTime:"",//申请日期
    pricingTrial:'',//送审定价
    adjust:'',
    netAccountAmount:'',// 净核算金额,
    approveTotalPrice:"",//审定总价
    chooseExecuteUserList: [],
    uploadImageList:null,/// 上传,
    investmentFileList:[],
    isEdit: false,
    projectData:{},// 项目名称,
    dialogScreenprojectRef:null, //项目名称
    dialogScreenpcontractRef:null,//合同名称
    dialogScreenApplyDateRef:null,//申请会签批准日期
    contractData:{},//合同名称
    unitList: [],
    executeUser1: [],
    executeUser2: [],
    projectLeaderId: '',
    departmentManager: '',
    countersignLeader: '',
    leaderList: []
  },
  dialogScreenDepartmentManager: null,
  dialogScreenCountersignLeader: null,
  onLoad(option) {
    this.getLeaderList()
    let date = new Date().toLocaleString()
    for (var i = 0; i < date.length; i++) {
      if (date[i] === '/') {
        date = date.replace('/', '-') // 替换之后就变成新数组了
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
     this.form.rules = {
      projectName: [{ required: true, message: '请选择项目名称' }],
      contractName: [{ required: true, message: '请选择合同名称' }],
      contractAmount: [{ required: true, message: '请输入' }],
      contractorName: [{ required: true, message: '请选择承包商名称' }],
      adjust: [{ required: true, message: '请选择核增或核减' }],
      applicationTime: [{ required: true, message: '请选择' }],
      pricingTrial: [{ required: true, message: '请输入送审定价' }],
      netAccountAmount: [{ required: true, message: '请输入净核算金额' }],
      approveTotalPrice: [{ required: true, message: '请输入' }],
      priceRate: [{ required: true, message: '请输入' }],
      departmentManager_dictText: [{ required: true, message: '请输入' }],
      countersignLeader_dictText: [{ required: true, message: '请输入' }]
     }
  },
  getLeaderList(){
    request.doPostRequest({
      url: config.API_QUERY_USER_BYROLE,
      data: { },
      success: res => {
        res.data.forEach(e => {
          e.label = e.username
          e.text = e.username
          e.value = e.id
        })
        this.setData({
          leaderList: res.data || [],
        });
        console.log(res.data)
      }
    })
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  onSaveDialogScreenDepartmentManagerRef(ref){
    this.dialogScreenDepartmentManager = ref
  },
  onSaveDialogScreenCountersignLeaderRef(ref){
    this.dialogScreenCountersignLeader = ref
  },
  chooseManager(){
    if(this.dialogScreenDepartmentManager) this.dialogScreenDepartmentManager._showDialog(this.data.executeUser1)
  },
  chooseLeader(){
    if(this.dialogScreenCountersignLeader) this.dialogScreenCountersignLeader._showDialog(this.data.executeUser2)
  },
  adjustChange(row,e){
    console.log(row,e);
    this.setData({
      adjust: row,
    })
    if(row === 1){
      this.form.setFieldValue('approveTotalPrice', this.form.getFieldValue('pricingTrial') -  this.form.getFieldValue('netAccountAmount'))
    }else{
      this.form.setFieldValue('approveTotalPrice', parseInt(this.form.getFieldValue('pricingTrial')) +  parseInt(this.form.getFieldValue('netAccountAmount')))
    }
    if(!this.form.getFieldValue('contractAmount') || this.form.getFieldValue('contractAmount') == 0) {
      this.form.setFieldValue('priceRate', 0)
    }else {
      this.form.setFieldValue('priceRate', (((Number(this.form.getFieldValue('approveTotalPrice') || 0) - this.form.getFieldValue('contractAmount')) / this.form.getFieldValue('contractAmount'))*100).toFixed(2))
    }
   
  },
  pricingTrialChange(data){
    console.log(data)
    let adjust = this.form.getFieldValue('adjust')
    if(adjust === 1){
      this.form.setFieldValue('approveTotalPrice', this.form.getFieldValue('pricingTrial') -  this.form.getFieldValue('netAccountAmount'))
    }else{
      this.form.setFieldValue('approveTotalPrice', parseInt(this.form.getFieldValue('pricingTrial')) +  parseInt(this.form.getFieldValue('netAccountAmount')))
    }
    if(!this.form.getFieldValue('contractAmount') || this.form.getFieldValue('contractAmount') == 0) {
      this.form.setFieldValue('priceRate', 0)
    }else {
      this.form.setFieldValue('priceRate', (((Number(this.form.getFieldValue('approveTotalPrice') || 0) - this.form.getFieldValue('contractAmount')) / this.form.getFieldValue('contractAmount'))*100).toFixed(2))
    }
    // this.form.setFieldValue('priceRate', (((this.form.getFieldValue('approveTotalPrice') - this.form.getFieldValue('contractAmount')) / this.form.getFieldValue('contractAmount'))*100).toFixed(2))
  },
  netAccountAmountChange(data){
    let adjust = this.form.getFieldValue('adjust')
    if(adjust === 1){
      this.form.setFieldValue('approveTotalPrice', this.form.getFieldValue('pricingTrial') -  this.form.getFieldValue('netAccountAmount'))
    }else{
      this.form.setFieldValue('approveTotalPrice', parseInt(this.form.getFieldValue('pricingTrial')) +  parseInt(this.form.getFieldValue('netAccountAmount')))
    }
    if(!this.form.getFieldValue('contractAmount') || this.form.getFieldValue('contractAmount') == 0) {
      this.form.setFieldValue('priceRate', 0)
    }else {
      this.form.setFieldValue('priceRate', (((Number(this.form.getFieldValue('approveTotalPrice') || 0) - this.form.getFieldValue('contractAmount')) / this.form.getFieldValue('contractAmount'))*100).toFixed(2))
    }
    // this.form.setFieldValue('priceRate', (((this.form.getFieldValue('approveTotalPrice') - this.form.getFieldValue('contractAmount')) / this.form.getFieldValue('contractAmount'))*100).toFixed(2))
  },
  // onFocus(){
  //   this.blur() 
  // },
// 项目名称
bindChooseProjectTap:function (e) {
  console.log(e);
  if (this.data.isEdit) return;
  if (this.dialogScreenprojectRef) this.dialogScreenprojectRef._showDialog(this.data.projectData.id)
},
onSaveDialogScreenprojecteRef: function (ref) {
  this.dialogScreenprojectRef = ref;
},
bindChooseProjectCallBack: function (data) {
  console.log(data)
  this.setData({
    projectData: data || {},
    projectLeader:data.projectLeaderName,
    projectLeaderId: data.personId,
    affiliateUnit:data.affiliatedUnitName,
    projectId:data.id || '',
    'contractData.contractName':'',
    "contractData.contractId":'',
    contractAmount:'',
    contractorName:''
  });
  this.form.setFieldValue('projectName',data.name)
  this.form.setFieldValue('projectId',data.id)
  this.form.setFieldValue('contractName','')
  this.form.setFieldValue('contractAmount','')
  this.form.setFieldValue('contractorName','')

  this.form.setFieldValue('projectLeader',data.projectLeaderName)
  this.form.setFieldValue('affiliateUnit',data.affiliatedUnitName)

  request.doPostRequest({
    url: config.API_PROJECT_TO_POST,
    data: {
      projectId:data.id,
    },
    success: res => {
      this.setData({
        projectChangeAmount: res.data.projectCumulativeChange || 0,
      });
    }
  })
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
    contractorName:data.unitPartyName,
    contractId:data.contractId
  });
  this.form.setFieldValue('contractName',data.contractName)
  this.form.setFieldValue('contractId',data.contractId)
  this.form.setFieldValue('contractAmount',data.contractAmount)

  // 签约价节超率=（审定总价-合同金额）/合同金额
  if(this.form.getFieldValue('approveTotalPrice')){
    this.form.setFieldValue('priceRate', (((this.form.getFieldValue('approveTotalPrice') - data.contractAmount) / data.contractAmount)*100).toFixed(6))
  }

  // this.form.setFieldValue('contractorName',data.unitPartyName)
  request.doPostRequest({
    url: config.API_CONTRACT_CUMULATIVE,
    data: {
      contractId:data.contractId,
      projectId:this.data.projectId
    },
    success: res => {
      this.setData({
        contractCumulativeChange: res.data.contractCumulativeChange || 0,
        contractChangeRate: res.data.contractCumulativeChangeRate || 0,
      });
    }
  })
  request.doPostRequest({
    url: config.API_SELECT_BYID_WITHUNIT,
    data: {
      contractId:data.contractId,
    },
    success: res => {
      res.data.forEach(e => {
        e.label = e.unitName
        e.value = e.unitName
      })
      this.setData({
        unitList: res.data || [],
      });
      console.log(res.data)
    }
  })
},
//技术
bindScreenDepartmentManagerCallBack(data){
  this.form.setFieldValue('departmentManager_dictText', data.map(e => e.username).toString());
  this.setData({
    departmentManager: data.map(e => e.userId).toString()
  })
  this.setData({
    executeUser1: data && data.map(e => {
      return { userId: e.userId, username: e.username,disabled:e.disabled };
    })
  });
},
bindScreenCountersignLeaderCallBack(data){
  this.form.setFieldValue('countersignLeader_dictText', data.map(e => e.username).toString());
  this.setData({
    countersignLeader: data.map(e => e.userId).toString()
  })
  this.setData({
    executeUser2: data && data.map(e => {
      return { userId: e.userId, username: e.username,disabled:e.disabled };
    })
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
  this.form.setFieldValue('applicationTime', data.startDate);
  this.setData({
    applicationTime: data.startDate || '',
  });
},
// 上传
onSaveUploadImgRef: function (ref) {
  this.uploadImageList = ref;
},
// 编辑
getEdit(id){
request.doPostRequest({
  url: config.API_BE_DETAIL_POST,
  data: {
   id:id
  },
  success:res=>{
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
      // adjust:res.data.adjust,
      investmentFileList:res.data.investmentFileList,
      projectLeaderId: res.data.projectLeaderId,
      departmentManager: res.data.departmentManager,
      countersignLeader: res.data.countersignLeader
    })
    this.form.setFieldValue('projectName', res.data.projectName)
    this.form.setFieldValue('contractName', res.data.contractName)
    this.form.setFieldValue('projectId', res.data.projectId)
    this.form.setFieldValue('contractId', res.data.contractId)
    this.form.setFieldValue('contractAmount', res.data.contractAmount)
    this.form.setFieldValue('contractorName', res.data.contractorName)
    this.form.setFieldValue('applicationTime', res.data.applicationTime)
    this.form.setFieldValue('pricingTrial', res.data.pricingTrial)
    this.form.setFieldValue('netAccountAmount', res.data.netAccountAmount)
    this.form.setFieldValue('approveTotalPrice', res.data.approveTotalPrice)
    this.form.setFieldValue('projectLeader', res.data.projectLeader)
    this.form.setFieldValue('affiliateUnit', res.data.affiliateUnit)
    this.form.setFieldValue('adjust', res.data.adjust)
    this.form.setFieldValue('priceRate', res.data.priceRate)
    this.form.setFieldValue('departmentManager_dictText', res.data.departmentManager_dictText)
    this.form.setFieldValue('countersignLeader_dictText', res.data.countersignLeader_dictText)
    const files= res.data.investmentFileList.map((item)=>{
      return {
        ...item,
        name:item.fileName,
      }
    })
    request.doPostRequest({
      url: config.API_SELECT_BYID_WITHUNIT,
      data: {
        contractId:res.data.contractId,
      },
      success: res => {
        res.data.forEach(e => {
          e.label = e.unitName
          e.value = e.unitName
        })
        this.setData({
          unitList: res.data || [],
        });
        console.log(res.data)
      }
    })
    setTimeout(() => {
      this.uploadImageList._setImageList(files) 
    }, 0);
    if(res.data.departmentManager_dictText && res.data.departmentManager){
      const nameList = res.data.departmentManager_dictText.split(',')
      const idList = res.data.departmentManager.split(',')
      this.setData({
        executeUser1: nameList.map((item, index) => { return { username: item, userId: idList[index] } }) || []
      })
    }
    if(res.data.countersignLeader_dictText && res.data.countersignLeader){
      const nameList = res.data.countersignLeader_dictText.split(',')
      const idList = res.data.countersignLeader.split(',')
      this.setData({
        executeUser2: nameList.map((item, index) => { return { username: item, userId: idList[index] } }) || []
      })
    }
    
  }
})
},
async staging(){
  this.form.rules = {}
  let params = this.form.getFieldsValue()
  console.log(params)
  params.projectId = this.data.projectData.id,
  params.contractId = this.data.contractData.contractId,
  params.id= this.data.id?this.data.id:''
  params.applicationTime=this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':''
  params.departmentManager = this.data.departmentManager
  params.countersignLeader = this.data.countersignLeader
  params.projectLeaderId = this.data.projectLeaderId
  params.vueUrl = 'ApproveBeCompletedDetails, ApproveBeCompletedDetails'
  params.singleUrl = '/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail'
  params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/beCompletedDetails'
  if(this.data.id){
    params.urlParameter = JSON.stringify({ id: this.data.id })
  }else{
    params.urlParameter = JSON.stringify({ })
  }

  let temFileList=[]
  if (this.uploadImageList) {
    temFileList = this.uploadImageList.data.imgList;
    // if (ddUtils.showEmptyArrayTips(temFileList, "请上传合同正式稿及相关附件")) return;
    temFileList.forEach(e => {
      e.fileName = e.name
      e.type= 4
    })
    params.investmentFileList =  temFileList
  }
  request.doPostRequest({
    url: config.API_TEMPORARY_STORAGE,
    data: params,
    success: res => {
      ddUtils.showToast({
        title:"暂存成功"
        })
     ddUtils.navigateBack();
    }
  })
},
async submit(){
  const params = await this.form.submit();
  params.projectId = this.data.projectData.id,
  params.contractId = this.data.contractData.contractId,
  params.id= this.data.id?this.data.id:''
  params.applicationTime=this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':''
  params.departmentManager = this.data.departmentManager
  params.countersignLeader = this.data.countersignLeader
  params.projectLeaderId = this.data.projectLeaderId
  let temFileList=[]
  params.vueUrl = 'ApproveBeCompletedDetails, ApproveBeCompletedDetails'
  params.singleUrl = '/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail'
  params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/beCompletedDetails'
  if(this.data.id){
    params.urlParameter = JSON.stringify({ id: this.data.id })
  }else{
    params.urlParameter = JSON.stringify({ })
  }
  if (this.uploadImageList) {
    temFileList = this.uploadImageList.data.imgList;
    if (ddUtils.showEmptyArrayTips(temFileList, "请上传合同正式稿及相关附件")) return;
    temFileList.forEach(e => {
      e.fileName = e.name
      e.type= 4
    })
    // for (let item of temFileList) {
    //   this.data.investmentFileList.push({
    //       type: 4,
    //       fileName: item.name,
    //       size: item.size,
    //       url: item.url,
    //   })
    // }
    params.investmentFileList =  temFileList
  }
  // request.doPostRequest({
  //   url: config.API_JUNGONG_ADD_POST,
  //   data: params,
  //   success: res => {
  //     ddUtils.showToast({
  //       title:"保存成功"
  //       })
  //   ddUtils.navigateBack();
  //   }
  // })
  request.doPostRequest({
    url: config.API_COMPLETION_SAVEANDSUBMIT,
    data: params,
    success: res => {
      ddUtils.showToast({
        title:"提交审批成功"
      })
    ddUtils.navigateBack();
    }
  })
},
//bind form submit
// bindFormSubmit: function (e) {
//   let pricingTrial = e.detail.value.pricingTrial
//   let netAccountAmount = e.detail.value.netAccountAmount
//   let approveTotalPrice = e.detail.value.approveTotalPrice
// //   let investmentFileList = [],temFileList=[]
// //   if (this.uploadImgRef) {
// //     temFileList = this.uploadImgRef._getUploadImgId().imgList;
// // }
// let investmentFileList = [], temFileList=[]
// if (this.uploadImgRef) {
//   temFileList = this.uploadImgRef.data.imgList;
// // console.log( investmentFileList);
// for (let item of temFileList) {
//   investmentFileList.push({
//       type: 4,
//       fileName: item.name,
//       size: item.size,
//       url: item.url,
//   })
// }
// }
// if(!this.data.isEdit){
//     if (ddUtils.showEmptyToastTips(this.data.projectData.id, "项目名称必填")) return;
//     if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "合同名称必填")) return;
//     if (ddUtils.showEmptyToastTips(this.data.applicationTime, "请选择申请日期")) return;
//     if (ddUtils.showEmptyToastTips(pricingTrial, "请输入送审定价")) return;
//     if (ddUtils.showEmptyToastTips(this.data.adjust, "请选择核增或核减")) return;
//     if (ddUtils.showEmptyToastTips(netAccountAmount, "请输入净核算金额")) return;
//     if (ddUtils.showEmptyToastTips(approveTotalPrice, "请选择审定总价")) return;
//   }
//   // if(this.data.adjust=== ''){
//   //   ddUtils.showToast({
//   //     title:"保存成功"
//   //  })
//   // }
//   if (ddUtils.showEmptyArrayTips(investmentFileList, "请上传合同正式稿及相关附件")) return;
// request.doPostRequest({
//   url: config.API_JUNGONG_ADD_POST,
//   data: {
//     projectId:this.data.projectData.id,
//     projectName:this.data.projectData.name,
//     contractId:this.data.contractData.contractId,
//     contractName: this.data.contractData.contractName,
//     contractAmount:this.data.contractAmount,
//     contractorName:this.data.contractorName,
//     investmentFileList:investmentFileList,
//     applicationTime:this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':'',
//   pricingTrial:pricingTrial,
//   id:this.data.id?this.data.id:'',
//   adjust:this.data.adjust,
//   netAccountAmount:netAccountAmount,
//   approveTotalPrice:approveTotalPrice,
//   vueUrl: 'completed'
//   },
//   success: res => {
//     ddUtils.showToast({
//       title:"保存成功"
//    })
//    ddUtils.navigateBack();
//   }
// })
// },
bingFocusChange(){
  this.setData({
    disabled:true
  })
},
// 取消
bindCancelTap: function (e) {
  ddUtils.navigateBack();
},
});
