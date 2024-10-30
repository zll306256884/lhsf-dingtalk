const app = getApp();
import { Form } from 'antd-mini/es/Form/form';
import {isEmpty} from "/utils/utils"
import config from "/server/workServer/addInvestment"
import configApi from "/utils/config"
import ddUtils from "/utils/ddUtils"
import projectService from "/server/workServer/projectServer";
import request from "/utils/request"
import { formatTimeToDay } from "/utils/utils";
import Decimal from 'decimal'
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
    projectData:{},// 项目信息,
    dialogScreenprojectRef:null, //项目
    dialogScreenpcontractRef:null,//合同
    dialogScreenApplyDateRef:null,//申请会签批准日期
    contractData:{},//合同信息
    unitList: [],
    executeUser1: [],
    executeUser2: [],
    projectLeaderId: '',
    departmentManager: '',
    countersignLeader: '',
    leaderList: [],
    loading: false,
    // earlyStageLeaderId: '',
    // earlyStageLeader: '',
    // carryPersonId: '',
    // carryLeaderName: '',
    // operatePersonId: '',
    // operateLeaderName: '',
    projectType: '',
    userId: '',
    projectListOptions: [],
    projectLeaderListOptions:[],
    params: null,
    parameter: {}
  },
  dialogScreenDepartmentManager: null,
  dialogScreenCountersignLeader: null,
  signatoryPersonnelRef :null,
  onLoad(option) {
    this.setData({
      userId: app.globalData.userInfo.userId
    })
    this.getProjectList()
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
    setTimeout(() => {
      if(option.id){
        this.getEdit(option.id) 
      }
    }, 500)
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
      countersignLeader_dictText: [{ required: true, message: '请输入' }],
      projectLeaderId: [{ required: true, message: '请选择项目负责人' }],
     }
  },
  chooseProjectLeader(data, column){
    console.log(data, column)
    this.setData({
      projectLeaderId: column.personId,
      projectLeader:column.name
    })
    this.form.setFieldValue('projectLeader', column.name)
    this.form.setFieldValue('projectLeaderId', column.personId)
  },
  getProjectLeader(projectId){
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: projectService.API_PROJECT_LEADER,
        data: {projectId: this.data.projectId || projectId},
        success: res => {
          res.data.forEach(e => {
            e.label = e.name
            e.value = e.personId
          })
          console.log('项目负责人',res.data)
          this.setData({
            projectLeaderListOptions: res.data || []
          })
          if(res.data && res.data.length === 1){
            this.form.setFieldValue('projectLeaderId', res.data[0].personId)
            this.setData({
              projectLeaderId: res.data[0].personId
            })
          }
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      })
    })
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
  onSaveSignatoryPersonnel: function( ref) {
    this.signatoryPersonnelRef = ref
  },
  bindSignatoryPersonnelCallBack: function(data){
    console.log("Dddd======",data.jflowAuditUser)
    if(data.state==='success'){
      let params = this.data.params
      params.jflowAuditUser = data.jflowAuditUser
      request.doPostRequest({
        url: config.API_COMPLETION_SAVEANDSUBMIT,
        data: params,
        success: res => {
          ddUtils.showToast({
            title:"提交审批成功"
          })
          this.setData({
            loading: false
          })
          ddUtils.navigateBack();
        },
        fail: error => {
          ddUtils.showToast({
            title: error.message
          });
          this.setData({ loading: false })
        }
      })
    } else {
      this.setData({ loading: false })
    }
  },
  adjustChange(row,e){
    console.log(row,e);
    this.setData({
      adjust: row,
    })
    let pricingTrial = Decimal(Number(this.form.getFieldValue('pricingTrial') || 0))
    let netAccountAmount = Decimal(Number(this.form.getFieldValue('netAccountAmount') || 0))
    if(row === 1){
      console.log('1111',Number(this.form.getFieldValue('pricingTrial') || 0), pricingTrial, pricingTrial.sub(netAccountAmount).internal)
      this.form.setFieldValue('approveTotalPrice',  pricingTrial.sub(netAccountAmount).internal)
    }else{
      this.form.setFieldValue('approveTotalPrice', Decimal(Number(this.form.getFieldValue('pricingTrial') || 0)).add(Decimal(Number(this.form.getFieldValue('netAccountAmount') || 0))).internal)

    }
    if(!this.form.getFieldValue('contractAmount') || this.form.getFieldValue('contractAmount') == 0) {
      this.form.setFieldValue('priceRate', 0)
    }else {
      let approveTotalPrice = Decimal(Number(this.form.getFieldValue('approveTotalPrice') || 0))
      let contractAmount = Decimal(Number(this.form.getFieldValue('contractAmount') || 0))

      this.form.setFieldValue('priceRate', ((
        approveTotalPrice.sub(contractAmount)
        ).div(contractAmount).internal
        *100).toFixed(2))
    }
   
  },
  pricingTrialChange(data){
    console.log(data)
    let adjust = this.form.getFieldValue('adjust')
    if(adjust === 1){
      this.form.setFieldValue('approveTotalPrice', Decimal(Number(this.form.getFieldValue('pricingTrial') || 0)).sub(Decimal(Number(this.form.getFieldValue('netAccountAmount') || 0))).internal)
    }else{
      this.form.setFieldValue('approveTotalPrice', Decimal(Number(this.form.getFieldValue('pricingTrial') || 0)).add(Decimal(Number(this.form.getFieldValue('netAccountAmount') || 0))).internal)
    }

    let approveTotalPrice = Decimal(Number(this.form.getFieldValue('approveTotalPrice') || 0))
    let contractAmount = Decimal(Number(this.form.getFieldValue('contractAmount') || 0))

    this.form.setFieldValue('priceRate', ((
      approveTotalPrice.sub(contractAmount)
      ).div(contractAmount).internal
      *100).toFixed(2))
    // this.form.setFieldValue('priceRate', (((this.form.getFieldValue('approveTotalPrice') - this.form.getFieldValue('contractAmount')) / this.form.getFieldValue('contractAmount'))*100).toFixed(2))
  },
  netAccountAmountChange(data){
    let adjust = this.form.getFieldValue('adjust')
    if(adjust === 1){
      this.form.setFieldValue('approveTotalPrice', Decimal(Number(this.form.getFieldValue('pricingTrial') || 0)).sub(Decimal(Number(this.form.getFieldValue('netAccountAmount') || 0))).internal)
    }else{
      this.form.setFieldValue('approveTotalPrice', Decimal(Number(this.form.getFieldValue('pricingTrial') || 0)).add(Decimal(Number(this.form.getFieldValue('netAccountAmount') || 0))).internal)
    }
    let approveTotalPrice = Decimal(Number(this.form.getFieldValue('approveTotalPrice') || 0))
    let contractAmount = Decimal(Number(this.form.getFieldValue('contractAmount') || 0))

    this.form.setFieldValue('priceRate', ((
      approveTotalPrice.sub(contractAmount)
      ).div(contractAmount).internal
      *100).toFixed(2))
    // this.form.setFieldValue('priceRate', (((this.form.getFieldValue('approveTotalPrice') - this.form.getFieldValue('contractAmount')) / this.form.getFieldValue('contractAmount'))*100).toFixed(2))
  },
// 项目名称
bindChooseProjectTap:function (e) {
  console.log(e);
  if (this.data.isEdit) return;
  if (this.dialogScreenprojectRef) this.dialogScreenprojectRef._showDialog(this.data.projectData.id)
},
onSaveDialogScreenprojecteRef: function (ref) {
  this.dialogScreenprojectRef = ref;
},
bindChooseProjectCallBack: async function (data) {
  this.setData({
    projectData: data || {},
    projectLeader:data.projectLeaderName,
    projectLeaderId: data.personId,
    affiliateUnit:data.affiliatedUnitName,
    projectType: data.projectType,
    projectId:data.id || '',
    'contractData.contractName':'',
    "contractData.contractId":'',
    contractAmount:'',
    contractorName:'',
  });
  this.form.setFieldValue('projectName',data.name)
  this.form.setFieldValue('projectId',data.id)
  this.form.setFieldValue('contractName','')
  this.form.setFieldValue('contractAmount','')
  this.form.setFieldValue('contractorName','')

  this.form.setFieldValue('projectLeader',data.projectLeaderName)
  this.form.setFieldValue('affiliateUnit',data.affiliatedUnitName)
  await this.getProjectLeader()
  const isLeader= this.data.projectLeaderListOptions.map(i=>i.value).includes(this.data.userId)
  // && this.data.projectType ==1
  if(!isLeader){
    ddUtils.showToast({
      title: '注意：仅项目负责人可发起流程',
      duration: 2000
    });
    return
  }
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
    if( data.contractAmount == 0) {
      this.form.setFieldValue('priceRate', 0)
    }else {
      let approveTotalPrice = Decimal(Number(this.form.getFieldValue('approveTotalPrice') || 0))
      let contractAmount = Decimal(Number(data.contractAmoun) || 0)

      this.form.setFieldValue('priceRate', ((
        approveTotalPrice.sub(contractAmount)
        ).div(contractAmount).internal
        *100).toFixed(2))
    }
   // this.form.setFieldValue('priceRate', (((Number(this.form.getFieldValue('approveTotalPrice')||0) - data.contractAmount) / data.contractAmount)*100).toFixed(2))
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
getProjectList(){
  request.doPostRequest({
    url: configApi.API_PROJECT_NAME,
    success: res => {
      res.data.forEach(e => {
        e.label = e.name
        e.value = e.id
      })
      console.log(res.data)
      this.setData({
        projectListOptions: res.data || []
      })
    }
  })
},
// 编辑
getEdit(id){
request.doPostRequest({
  url: config.API_BE_DETAIL_POST,
  data: {
   id:id
  },
  success:res=>{
    if(res.data.projectId){
      this.getProjectLeader(res.data.projectId)
    }
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
    this.form.setFieldValue('projectLeaderId', res.data.projectLeaderId)

    this.form.setFieldValue('affiliateUnit', res.data.affiliateUnit)
    this.form.setFieldValue('adjust', res.data.adjust)
    this.form.setFieldValue('priceRate', res.data.priceRate)
    this.form.setFieldValue('departmentManager_dictText', res.data.departmentManager_dictText)
    this.form.setFieldValue('countersignLeader_dictText', res.data.countersignLeader_dictText)
    this.setData({
      'projectData.name':res.data.projectName,
      'projectData.id':res.data.projectId,
      'contractData.contractName':res.data.contractName,
      'contractData.contractId':res.data.contractId,
      projectName:res.data.projectName,
      projectId:res.data.projectId,
      contractAmount:res.data.contractAmount,
      contractorName:res.data.contractorName,
      applicationTime:res.data.applicationTime,
      pricingTrial:res.data.pricingTrial,
      netAccountAmount:res.data.netAccountAmount,
      approveTotalPrice:res.data.approveTotalPrice,
      // adjust:res.data.adjust,
      investmentFileList:res.data.investmentFileList,
      projectLeaderId: res.data.projectLeaderId,
      projectLeader: res.data.projectLeader,
      departmentManager: res.data.departmentManager,
      countersignLeader: res.data.countersignLeader,
    })
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
 const isLeader= this.data.projectLeaderListOptions.map(i=>i.value).includes(this.data.userId)
 if(!isLeader){
    ddUtils.showToast({
      title: '注意：仅项目负责人可发起流程',
      duration: 2000
    });
    return
 }
  this.form.rules = {}
  let params = this.form.getFieldsValue()
  console.log(params)
  params.approvalStatus = 1, // 暂存是未提交1，提交审批传2
  params.projectId = this.data.projectData.id,
  params.contractId = this.data.contractData.contractId,
  params.id= this.data.id?this.data.id:''
  params.applicationTime=this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':''
  params.departmentManager = this.data.departmentManager
  params.countersignLeader = this.data.countersignLeader
  params.projectLeaderId = this.data.projectLeaderId
  params.projectLeader = this.data.projectLeader
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
  const isLeader= this.data.projectLeaderListOptions.map(i=>i.value).includes(this.data.userId)
  if(!isLeader){
     ddUtils.showToast({
       title: '注意：仅项目负责人可发起流程',
       duration: 2000
     });
     return
  }
  const params = await this.form.submit();
  this.setData({
    loading: true
  })
  params.approvalStatus = 2, // 暂存是未提交1，提交审批传2
  params.projectId = this.data.projectData.id,
  params.contractId = this.data.contractData.contractId,
  params.id= this.data.id?this.data.id:''
  params.applicationTime=this.data.applicationTime?this.data.applicationTime+ ' 00:00:00':''
  params.departmentManager = this.data.departmentManager
  params.countersignLeader = this.data.countersignLeader
  params.projectLeaderId = this.data.projectLeaderId
  params.projectLeader = this.data.projectLeader
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
  this.setData({
    params: params,
    parameter: {
      projectType: params.projectType,
      contractAmount: params.contractAmount,
      moduleType: 5,
      projectId: params.projectId
    }
  })
  this.signatoryPersonnelRef._openPopup()
  // request.doPostRequest({
  //   url: config.API_COMPLETION_SAVEANDSUBMIT,
  //   data: params,
  //   success: res => {
  //     ddUtils.showToast({
  //       title:"提交审批成功"
  //     })
  //     this.setData({
  //       loading: false
  //     })
  //     ddUtils.navigateBack();
  //   },
  //   fail: error => {
  //     ddUtils.showToast({
  //       title: error.message
  //     });
  //     this.setData({ loading: false })
  //   }
  // })
},
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
