import { Form } from 'antd-mini/es/Form/form';
import {isEmpty} from "../../../../utils/utils"
import config from "../../../../server/workServer/addInvestment"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import { formatTimeToDay } from "../../../../utils/utils";
Page({
  form: new Form({
    initialValues: {
      countersignDate: formatTimeToDay(new Date())
    },
  }),
  data: {
    navbarData: {
      title: "新增工程联系单",
  },
  sort:'0',
  disabled:false,
  projectId:"",
  proId:'',
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
    // let date = new Date().toLocaleString()
    // for (var i = 0; i < date.length; i++) {
    //   if (date[i] === '/') {
    //     date = date.replace('/', '-') // 注意替换之后就变成新数组了
    //   }
    // }
    // this.data.countersignDate = date.substr(0,10)
    console.log(option,'23232323');
    this.setData({
      id:option.id
    })
    if(option.id){
      this.data.disabled = true
      this.getDetail(option.id) 
    }
    if(option.sort === '1'){
      this.data.navbarData.title = '编辑工程联系单'
     }else{
       this.data.navbarData.title = '新增工程联系单'
     }
     this.form.rules = {
      contactNoticeName: [{ required: true, message: '请输入联系单名称' }],
      projectName: [{ required: true, message: '请选择项目名称' }],
      affiliateUnit: [{ required: true, message: '请选择所属单位' }],
      projectChangeAmount: [{ required: true, message: '请输入项目累计变更' }],
      projectLeader: [{ required: true, message: '请选择项目负责人' }],
      contractName: [{ required: true, message: '请选择合同名称' }],
      contractAmount: [{ required: true, message: '请输入合同金额' }],
      changeAmount: [{ required: true, message: '请输入变更金额' }],
      contractCumulativeChange: [{ required: true, message: '请输入合同累计变更'}],
      contractChangeRate: [{ required: true, message: '请输入合同变更率' }],
      countersignDate: [{ required: true, message: '请选择申请会签日期' }],
      constructionUnitReportDate: [{ required: true, message: '请选择施工单位上报日期' }],
      contactChange: [{ required: true, message: '请输入联系单变更内容' }],
      remark: [{ required: true, message: '请输入备注' }],
    }
  },
  handleRef(ref) {
    console.log(ref);
    this.form.addItem(ref);
  },
// 项目名称
bindChooseProjectTap:function (e) {
  console.log(e);
  if (this.data.isEdit) return;
  if (this.dialogScreenprojectRef) this.dialogScreenprojectRef._showDialog(this.data.projectData.id)
},
handleRef(ref) {
    console.log(ref);
    this.form.addItem(ref);
  },
onSaveDialogScreenprojecteRef: function (ref) {
  console.log(ref);
  this.dialogScreenprojectRef = ref;
},
bindChooseProjectCallBack: function (data) {
  console.log(data,'cmscnsjdcnslcnsn');
  this.setData({
    projectData: data || {},
    projectLeader:data.projectLeaderName,
    affiliateUnit:data.affiliatedUnitName,
    projectId:data.id || '',
    proId:data.id || '',
    // 'contractData.contractName': '',
    // "contractData.contractId":'',
    // contractAmount:'',
    // contractCumulativeChange:'',
    // contractChangeRate:''
  });
  this.form.setFieldValue('projectName',data.name)
  this.form.setFieldValue('projectLeader',data.projectLeaderName)
  this.form.setFieldValue('affiliateUnit',data.affiliatedUnitName)
  this.form.setFieldValue('contractName','')
  this.form.setFieldValue('contractId','')
  this.form.setFieldValue('contractAmount','')
  this.form.setFieldValue('contractCumulativeChange','')
  this.form.setFieldValue('contractChangeRate','')
  request.doPostRequest({
    url: config.API_PROJECT_TO_POST,
    data: {
      projectId:data.id,
    },
    success: res => {
      this.setData({
        projectChangeAmount: res.data.projectCumulativeChange || 0,
      });
      this.form.setFieldValue('projectChangeAmount',res.data.projectCumulativeChange)
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
  this.form.setFieldValue('contractName',data.contractName)
  this.form.setFieldValue('contractAmount',data.contractAmount)
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
      this.form.setFieldValue('contractCumulativeChange',res.data.contractCumulativeChange)
      this.form.setFieldValue('contractChangeRate',res.data.contractCumulativeChangeRate)
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
  this.setData({
    countersignDate: data.startDate || '',
  });
  this.form.setFieldValue('countersignDate', data.startDate);
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
  this.setData({
    changeContentTime: data.startDate || '',
  });
  this.form.setFieldValue('changeContentTime', data.startDate);
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
  this.setData({
    constructionUnitReportDate: data.startDate || '',
  });
  this.form.setFieldValue('constructionUnitReportDate', data.startDate);
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
     this.form.setFieldValue('person_text', isEmpty(str) ? '' : str.substring(0, str.length - 1));
  this.form.setFieldValue('person', isEmpty(strId) ? '' : strId.substring(0, strId.length - 1));
  },
// 上传
onSaveUploadImgRef: function (ref) {
  console.log(ref,232323232323);
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
      this.form.setFieldValue('projectName', res.data.projectName)
      this.form.setFieldValue('projectId', res.data.projectId)
      this.form.setFieldValue('contractName', res.data.contractName)
      this.form.setFieldValue('contractId', res.data.contractId)
      this.form.setFieldValue('contactNoticeName', res.data.contactNoticeName)
      this.form.setFieldValue('projectLeader', res.data.projectLeader)
      this.form.setFieldValue('affiliateUnit', res.data.affiliateUnit)
      this.form.setFieldValue('projectChangeAmount', res.data.projectChangeAmount)
      this.form.setFieldValue('contractAmount', res.data.contractAmount)
      this.form.setFieldValue('changeAmount', res.data.changeAmount)
      this.form.setFieldValue('contractCumulativeChange', res.data.contractCumulativeChange)
      this.form.setFieldValue('contractChangeRate', res.data.contractChangeRate)
      this.form.setFieldValue('countersignDate', res.data.countersignDate)
      this.form.setFieldValue('investmentFileList', res.data.investmentFileList)
      this.form.setFieldValue('constructionUnitReportDate', res.data.constructionUnitReportDate)
      this.form.setFieldValue('contactChange', res.data.contactChange)
      this.form.setFieldValue('remark', res.data.remark)
      this.form.setFieldValue('person_text', res.data.person_dictText)
      this.form.setFieldValue('person', res.data.person)
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
//保存
async submit(){
  const params = await this.form.submit();
  params.projectId = this.data.projectData.id,
  params.contractId = this.data.contractData.contractId
  params.changeContentTime=this.data.changeContentTime?this.data.changeContentTime+ ' 00:00:00':''
  params.constructionUnitReportDate=this.data.constructionUnitReportDate?this.data.constructionUnitReportDate+ ' 00:00:00':''
  params.vueUrl='approveAlterationAccount,editAlterationContent',
  params.singleUrl = '/pages/work/page/alterationRegisterDetail/alterationRegisterDetail'
  params.person = this.data.person
  params.id= this.data.id?this.data.id:''
  let temFileList=[]
  if (this.uploadImgRef) {
    temFileList = this.uploadImgRef.data.imgList;
    if (ddUtils.showEmptyArrayTips(temFileList, "请上传相关附件")) return;
    temFileList.forEach(e => {
      e.fileName = e.name
      e.type= 0
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
  url: config.API_ALTER_ADD_POST,
  data:params,
  success: res => {
    ddUtils.showToast({
      title:"保存成功"
   })
   ddUtils.navigateBack();
  }
})
},
//bind form submit
// bindFormSubmit: function (e) {
//   let changeAmount = e.detail.value.changeAmount
//   let contactChange = e.detail.value.contactChange
//   let contactNoticeName = e.detail.value.contactNoticeName
//   let remark = e.detail.value.remark
// let investmentFileList = [], temFileList=[]
// if (this.uploadImgRef) {
//   temFileList = this.uploadImgRef.data.imgList;
//   console.log(temFileList);
// for (let item of temFileList) {
//   investmentFileList.push({
//       type: 0,
//       fileName: item.name,
//       size: item.size,
//       url: item.url,
//   })
// }
// }
// if(!this.data.isEdit){
//     if (ddUtils.showEmptyToastTips(contactNoticeName, "请输入联系单名称")) return;
//     if (ddUtils.showEmptyToastTips(this.data.projectData.id, "项目名称必填")) return;
//     if (ddUtils.showEmptyToastTips(this.data.contractData.contractId, "合同名称必填")) return;
//     if (ddUtils.showEmptyToastTips(changeAmount, "请输入变更金额")) return;
//     if (ddUtils.showEmptyToastTips(this.data.countersignDate, "请选择申请会签批准日期")) return;
//     // if (ddUtils.showEmptyToastTips(this.data.changeContentTime, "请选择变更内容完成时间")) return;
//     if (ddUtils.showEmptyToastTips(this.data.constructionUnitReportDate, "请选择施工单位上报日期")) return;
//     if (ddUtils.showEmptyToastTips(contactChange, "请输入变更内容")) return;
//   }
//   if (ddUtils.showEmptyArrayTips(investmentFileList, "请上传合同正式稿及相关附件")) return;
// request.doPostRequest({
//   url: config.API_ALTER_ADD_POST,
//   data: {
//     contactNoticeName:contactNoticeName,//联系单名称
//     projectId:this.data.projectData.id,
//     projectName:this.data.projectData.name,
//     projectLeader:this.data.projectLeader,
//     affiliateUnit:this.data.affiliateUnit,
//     projectChangeAmount:this.data.projectChangeAmount,//项目累计变更
//     contractId:this.data.contractData.contractId,
//     contractName: this.data.contractData.contractName,
//     contractAmount:this.data.contractAmount,//合同金额
//     changeAmount:changeAmount,//变更金额
//     contractCumulativeChange:this.data.contractCumulativeChange,//合同累积变更（万元）
//   contractChangeRate:this.data.contractChangeRate, // 合同变更率
//   countersignDate:this.data.countersignDate,//申请会签批准日期
//   changeContentTime:this.data.changeContentTime?this.data.changeContentTime+ ' 00:00:00':'',//变更内容完成时间
//   constructionUnitReportDate:this.data.constructionUnitReportDate+ ' 00:00:00',//施工单位上报日期
//   contactChange:contactChange,//变更内容
//   remark:remark,
//   id:this.data.id?this.data.id:'',
//   investmentFileList:investmentFileList,
//   person:this.data.person,
//   person_text:this.data.person_text,
//   vueUrl: 'approveAlterationAccount,editAlterationContent'
//   },
//   success: res => {
//     ddUtils.showToast({
//       title:"保存成功"
//    })
//    ddUtils.navigateBack();
//   }
// })


// },
// 取消
bindCancelTap: function (e) {
  console.log(12121212);
  ddUtils.navigateBack();
},
});
