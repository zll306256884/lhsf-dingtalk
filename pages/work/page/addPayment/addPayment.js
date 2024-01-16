import { Form } from 'antd-mini/es/Form/form';
import {isEmpty,isEqual} from "../../../../utils/utils"
import config from "../../../../utils/config"
import connector from "../../../../server/workServer/addInvestment"
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
      title: "新增支付申请",
    },
    supplementaryAgreement:[],
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
    uploadImageList: null,// 上传
    projectTypeData:{},// 项目类型,
    projectData:{},// 项目名称,
    contractData:{},// 合同名称
    slowUnitData:{},//付款单位
    proceedsData:{},//收款单位
    icMeasurementPaymentId:'',
    transitAmount:'',
    accumulatedPaymentAmount:'', // 累计支付金额
    remark:'', // 备注
    executeUser: []
  },
  onLoad(option) {
    // let date = new Date().toLocaleString()
    // for (var i = 0; i < date.length; i++) {
    //   if (date[i] === '/') {
    //     date = date.replace('/', '-') // 替换之后就变成新数组了
    //   }
    // }
    // this.data.applicationTime = date.substr(0,10)
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
    this.form.rules = {
      projectType_text: [{ required: true, message: '请选择项目类型' }],
      projectName: [{ required: true, message: '请选择项目名称' }],
      projectLeader: [{ required: true, message: '请选择项目负责人' }],
      affiliateUnit: [{ required: true, message: '请选择所属单位' }],
      contractName: [{ required: true, message: '请选择合同名称' }],
      contractAmount: [{ required: true, message: '请选择合同金额' }],
      cumulativePayment: [{ required: true, message: '请选择累计已付款' }],
      payUnit: [{ required: true, message: '请选择付款单位' }],
      receiverUnit: [{ required: true, message: '请选择收款单位' }],
      payAmount: [{ required: true, message: '请输入本次应付金额' }],
      paymentNode: [{ required: true, message: '请输入支付节点（或形象进度）' }],
      paymentContent: [{ required: true, message: '请输入付款内容' }],
      applicationTime: [{ required: true, message: '请选择申请日期' }],
      countersignLeader_text: [{ required: true, message: '请选择会签分管领导' }],
    }
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  // 获取补充协议
  getSelectSupplementalAgreement:function(e) {
    request.doPostRequest({
      url: config.API_SELECT_SUPPLEMENTAL_AGREEMENT,
      data: {
        contractId:this.data.contractData.contractId,
      },
      success: res => {
        console.log(res,2323232323);
        this.supplementaryAgreement = res.data
      }
    }) 
    // 获取在途金额
    request.doPostRequest({
      url: config.API_AmountPaid,
      data: {
        contractId:this.data.contractData.contractId,
      },
      success: res => {
        console.log(res,2323232323);
        this.accumulatedPaymentAmount = Number(this.data.contractData.payAmount || 0) + Number(this.data.contractData.cumulativePayment || 0)
        this.supplementaryAgreement = res.data
      }
    })
  },
    // 获取在途金额
    // transitAmount:function(e) {
    //   request.doPostRequest({
    //     url: config.API_SELECT_SUPPLEMENTAL_AGREEMENT,
    //     data: {
    //       contractId:this.data.contractData.contractId,
    //     },
    //     success: res => {
    //       console.log(res,2323232323);
    //       this.transitAmount = res.data
    //     }
    //   })
    // },
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
    });
    this.form.setFieldValue('contractName',data.contractName)
    this.form.setFieldValue('contractAmount',data.contractAmount)
    this.form.setFieldValue('payUnit','')
    this.form.setFieldValue('receiverUnit','')
    // request.doPostRequest({
    //   url: config.API_CONTRACT_TO_MONEY,
    //   data: {
    //     contractId:data.contractId,
    //   },
    //   success: res => {
    //     console.log(res,2323232323);
    //     this.setData({
    //       cumulativePayment: res.data || 0,
    //     });
    //     this.form.setFieldValue('cumulativePayment',res.data)
    //   }
    // })

    request.doPostRequest({
      url: config.API_SELECT_SUPPLEMENTAL_AGREEMENT,
      data: {
        contractId:data.contractId,
      },
      success: res => {
        console.log(res,'补充协议');
        this.supplementaryAgreement = res.data
      }
    }) 
    // 获取在途金额
    request.doPostRequest({
      url: config.API_AmountPaid,
      data: {
        contractId:data.contractId,
      },
      success: res => {
        console.log(res,232323132132132323);
        this.accumulatedPaymentAmount = Number(this.data.contractData.payAmount || 0) + Number(res.data.cumulativePayment || 0)

        console.log(' this.accumulatedPaymentAmount', this.accumulatedPaymentAmount)

        this.form.setFieldValue('cumulativePayment',res.data.cumulativePayment)
        this.form.setFieldValue('accumulatedPaymentAmount',this.accumulatedPaymentAmount)
        this.form.setFieldValue('transitAmount',res.data.transitAmount)
      }
    })
  },
  accumulatedPaymentAmountFn:function (e) {
    this.accumulatedPaymentAmount = Number(this.form.getFieldValue('payAmount') || 0) + Number(this.form.getFieldValue('cumulativePayment') || 0)
    this.form.setFieldValue('accumulatedPaymentAmount',this.accumulatedPaymentAmount)
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
  });
  this.form.setFieldValue('projectName',data.name)
  this.form.setFieldValue('projectLeader',data.projectLeaderName)
  this.form.setFieldValue('affiliateUnit',data.affiliatedUnitName)
  this.form.setFieldValue('contractName','')
  this.form.setFieldValue('contractId','')
  this.form.setFieldValue('contractAmount','')
  this.form.setFieldValue('cumulativePayment','')
  this.form.setFieldValue('payUnit','')
  this.form.setFieldValue('receiverUnit','')
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
    if(data) {
      this.form.setFieldValue('projectType_text',data.itemText)
    }
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
  if(data) {
    this.form.setFieldValue('payUnit',data.unitName)
  }
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
  this.form.setFieldValue('receiverUnit',data.unitName)
},
// 申请日期
bindChooseApplyDateTap :function(e){
  if (this.dialogScreenApplyDateRef) this.dialogScreenApplyDateRef._showDialog()
},
onSaveDialogScreenApplyDateRef:function(ref){
  this.dialogScreenApplyDateRef = ref
},
bindChooseApplyDateCallBack(data){
  this.form.setFieldValue('applicationTime', data.startDate);
  // this.setData({
  //   applicationTime: data.startDate || '',
  // });
},
// 上传
onSaveUploadImgRef: function (ref) {
  this.uploadImageList = ref;
},
 //会签分管领导
  bindChooseExecuteUserTap: function (e) {
  //   this.setData({
  //     showDialog: true
  // });
    if (this.dialogScreenExecuteUserRef) this.dialogScreenExecuteUserRef._showDialog(this.data.executeUser)
},
 onSaveDialogScreenExecuteUserRef: function (ref) {
  this.dialogScreenExecuteUserRef = ref;
},
bindScreenExecuteUserCallBack: function (list) {
  this.chooseExecuteUserList = list;
  // this.form.setFieldValue('countersignLeader_text', list.map(e => e.username).toString());
  // this.form.setFieldValue('countersignLeader', list.map(e => e.userId).toString());
  // this.setData({
  //   countersignLeader: list.map(e => e.userId).toString()
  // })
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
  this.form.setFieldValue('countersignLeader_text', isEmpty(str) ? '' : str.substring(0, str.length - 1));
  this.form.setFieldValue('countersignLeader', isEmpty(strId) ? '' : strId.substring(0, strId.length - 1));
  this.setData({
    executeUser: list && list.map(e => {
      return { userId: e.userId, username: e.username,disabled:e.disabled };
    })
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
        investmentFileList:res.data.investmentFileList,
        transitAmount:res.data.transitAmount,
        remark:res.data.remark,
      })
      this.form.setFieldValue('projectType_text', res.data.projectType_dictText || '')
      this.form.setFieldValue('projectName', res.data.projectName)
      this.form.setFieldValue('projectId', res.data.projectId)
      this.form.setFieldValue('projectLeader', res.data.projectLeader)
      this.form.setFieldValue('affiliateUnit', res.data.affiliateUnit || '')
      this.form.setFieldValue('contractName', res.data.contractName)
      this.form.setFieldValue('contractId', res.data.contractId)
      this.form.setFieldValue('contractAmount', res.data.contractAmount)
      this.form.setFieldValue('cumulativePayment', res.data.cumulativePayment)
      this.form.setFieldValue('payUnit', res.data.payUnit || '')
      this.form.setFieldValue('receiverUnit', res.data.receiverUnit || '')
      this.form.setFieldValue('icMeasurementPaymentId', res.data.icMeasurementPaymentId || '')
      this.form.setFieldValue('payAmount', res.data.payAmount || '')
      this.form.setFieldValue('paymentNode', res.data.paymentNode || '')
      this.form.setFieldValue('paymentContent', res.data.paymentContent || '')
      this.form.setFieldValue('applicationTime', res.data.applicationTime || '')
      this.form.setFieldValue('countersignLeader_text', res.data.countersignLeader_dictText || '')
      this.form.setFieldValue('transitAmount', res.data.transitAmount || '')
      this.form.setFieldValue('remark', res.data.remark || '')
      this.getSelectSupplementalAgreement()
      const files= res.data.investmentFileList.map((item)=>{
        return {
          ...item,
          name:item.fileName,
        }
      })
      setTimeout(() => {
        this.uploadImageList._setImageList(files) 
      }, 0);

      if(res.data.countersignLeader_dictText && res.data.countersignLeader){
        const nameList = res.data.countersignLeader_dictText.split(',')
        const idList = res.data.countersignLeader.split(',')
        this.setData({
          executeUser: nameList.map((item, index) => { return { username: item, userId: idList[index] } }) || []
        })
      }
    }
  })
},
async submit(){
  const params = await this.form.submit();
  console.log('params--------',params);
  params.projectId = this.data.projectData.id,
  params.contractId = this.data.contractData.contractId,
   params.projectType = this.data.projectTypeData.itemValue
  params.payUnitId= this.data.slowUnitData.id,
 params.receiverUnitId=this.data.proceedsData.id,
 params.id= this.data.id?this.data.id:''
 params.applicationTime=params.applicationTime?params.applicationTime+ ' 00:00:00':'',
params.vueUrl='approveMoneyPaymentDetails',
params.singleUrl = '/pages/work/page/addPaymentDetail/addPaymentDetail',
params.pcUrl = 'https://xmgk.lhbigdata.com/#/investmentManage/contractControl/moneyPaymentDetails'
params.icMeasurementPaymentId=this.data.icMeasurementPaymentId,
params.countersignLeader = this.data.countersignLeader
let temFileList=[]
if (this.uploadImageList) {
  temFileList = this.uploadImageList.data.imgList;
  if (ddUtils.showEmptyArrayTips(temFileList, "请上传合同正式稿及相关附件")) return;
  temFileList.forEach(e => {
    e.fileName = e.name
    e.type= 3
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
request.doPostRequest({
      url: connector.API_PAY_BUT_POST,
      data: params,
      success: res => {
        ddUtils.showToast({
          title:"保存成功"
          })
       ddUtils.navigateBack();
      }
    })
},
// 暂存
workingStorage(){
  this.form.rules = {}
  let params = this.form.getFieldsValue()
  // params.remark = this.data.remark,
  params.projectId = this.data.projectData.id,
  params.contractId = this.data.contractData.contractId,
 params.projectType = this.data.projectTypeData.itemValue
  params.payUnitId= this.data.slowUnitData.id,
 params.receiverUnitId=this.data.proceedsData.id,
 params.id= this.data.id?this.data.id:''
 params.applicationTime=params.applicationTime?params.applicationTime+ ' 00:00:00':'',
params.vueUrl='approveMoneyPaymentDetails',
params.singleUrl = '/pages/work/page/addPaymentDetail/addPaymentDetail',
params.pcUrl = 'https://xmgk.lhbigdata.com/#/investmentManage/contractControl/moneyPaymentDetails'
params.icMeasurementPaymentId=this.data.icMeasurementPaymentId,
params.countersignLeader = this.data.countersignLeader
let temFileList=[]
if (this.uploadImageList) {
  temFileList = this.uploadImageList.data.imgList;
  // if (ddUtils.showEmptyArrayTips(temFileList, "请上传合同正式稿及相关附件")) return;
  temFileList.forEach(e => {
    e.fileName = e.name
    e.type= 3
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
request.doPostRequest({
  url: connector.API_TS_TO_POST,
  data: params,
  success: res => {
    ddUtils.showToast({
      title:"暂存成功"
      })
   ddUtils.navigateBack();
  }
})
}
},
bingFocusChange(){
  this.setData({
    disabled:true
  })
},
//bind form submit
// bindFormSubmit: function (e) {
//   let payAmount = e.detail.value.payAmount
//   let paymentNode = e.detail.value.paymentNode
//   let paymentContent = e.detail.value.paymentContent
//   let btnIndex =e.buttonTarget.dataset.flag
//   /// 暂存
//     let investmentFileList = [], temFileList=[]
   
//     console.log(this.uploadImgRef);
//     if (this.uploadImgRef) {
//       temFileList = this.uploadImgRef.data.imgList;
//     // console.log( investmentFileList);
//     for (let item of temFileList) {
//       investmentFileList.push({
//           type: 3,
//           fileName: item.name,
//           size: item.size,
//           url: item.url,
//       })
//   }
// }

//   if(isEqual(btnIndex,1)){
//     if (ddUtils.showEmptyToastTips(this.data.projectData.id, "项目名称必填")) return;
//     if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "合同名称必填")) return;
//     request.doPostRequest({
//       url: connector.API_TS_TO_POST,
//       data: {
//         projectType:this.data.projectTypeData.itemValue,
//         projectId:this.data.projectData.id,
//         projectName:this.data.projectData.name,
//         projectLeader:this.data.projectLeader,
//         affiliateUnit:this.data.affiliateUnit,
//         contractId:this.data.contractData.contractId,
//         contractName: this.data.contractData.contractName,
//         contractAmount:this.data.contractAmount,
//         cumulativePayment:this.data.cumulativePayment,
//         payUnit:this.data.slowUnitData.unitName,
//         payUnitId:this.data.slowUnitData.id,
//         receiverUnit:this.data.proceedsData.unitName,
//         receiverUnitId:this.data.proceedsData.id,
//         payAmount:payAmount,
//         paymentNode:paymentNode,
//         paymentContent:paymentContent,
//         id:this.data.id?this.data.id:'',
//         icMeasurementPaymentId:this.data.icMeasurementPaymentId,
//         applicationTime:this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':'',
//         countersignLeader_text:this.data.countersignLeader_text,//负责人
//         countersignLeader:this.data.countersignLeader,//,
//         investmentFileList:investmentFileList,
//         vueUrl:'approveMoneyPaymentDetails',
//       },
//       success: res => {
//         ddUtils.showToast({
//           title:"暂存成功"
//        })
//        ddUtils.navigateBack();
//       }
//     })
//   }else{
//     console.log(this.data.countersignLeader_text);
//     console.log(this.data.applicationTime);
//   if(!this.data.isEdit){
//     if (ddUtils.showEmptyToastTips(this.data.projectTypeData.itemValue, "请选择项目类型")) return;
//     if (ddUtils.showEmptyToastTips(this.data.projectData.id, "请选择项目名称")) return;
//     if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "请选择合同名称")) return;
//     if (ddUtils.showEmptyToastTips(this.data.slowUnitData.unitName, "请选择付款单元")) return;
//     if (ddUtils.showEmptyToastTips(this.data.proceedsData.unitName, "请选择收款单元")) return;
//     if (ddUtils.showEmptyToastTips(payAmount, "请输入应付金额")) return;
//     if (ddUtils.showEmptyToastTips(paymentNode, "请输入支付节点（或形象进度）")) return;
//     if (ddUtils.showEmptyToastTips(paymentContent, "请输入付款内容")) return;
//     if (ddUtils.showEmptyToastTips(this.data.applicationTime, "请选择申请日期")) return;
//     if (ddUtils.showEmptyArrayTips(investmentFileList, "请上传")) return;
//   }
//   request.doPostRequest({
//     url: connector.API_PAY_BUT_POST,
//     data: {
//       projectType:this.data.projectTypeData.itemValue,
//       projectId:this.data.projectData.id,
//       projectName:this.data.projectData.name,
//       projectLeader:this.data.projectLeader,
//       affiliateUnit:this.data.affiliateUnit,
//       contractId:this.data.contractData.contractId,
//       contractName: this.data.contractData.contractName,
//       contractAmount:this.data.contractAmount,
//       cumulativePayment:this.data.cumulativePayment,
//       payUnit:this.data.slowUnitData.unitName,
//       payUnitId:this.data.slowUnitData.id,
//       receiverUnit:this.data.proceedsData.unitName,
//       receiverUnitId:this.data.proceedsData.id,
//       payAmount:payAmount,
//       id:this.data.id?this.data.id:'',
//       paymentNode:paymentNode,
//       paymentContent:paymentContent,
//       icMeasurementPaymentId:this.data.icMeasurementPaymentId,
//       applicationTime:this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':'',
//       countersignLeader_text:this.data.countersignLeader_text,//负责人
//       countersignLeader:this.data.countersignLeader,//,
//       investmentFileList:investmentFileList,
//       vueUrl:'approveMoneyPaymentDetails',
//     },
//     success: res => {
//       ddUtils.showToast({
//         title:"提交成功"
//      })
//      ddUtils.navigateBack();
//     }
//   })
// }
//   },

// 取消
bindCancelTap: function (e) {
  ddUtils.navigateBack();
},
});
