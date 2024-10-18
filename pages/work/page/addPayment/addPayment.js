const app = getApp();
import { Form } from 'antd-mini/es/Form/form';
import {isEmpty,isEqual} from "../../../../utils/utils"
import config from "../../../../utils/config"
import connector from "../../../../server/workServer/addInvestment"
import ddUtils from "../../../../utils/ddUtils"
import projectService from "../../../../server/workServer/projectServer";
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
    executeUser: [],
    accumulatedPaymentAmountTitle: '',
    payAmountTitle: '',
    remarkTitle: false, // 
    monthTypeOptions: [
      {label: '当月',value: 1},
      {label: '下月',value: 2},
    ],
    loading: false,
    earlyStageLeaderId: '',
    earlyStageLeader: '',
    carryPersonId: '',
    carryLeaderName: '',
    operatePersonId: '',
    operateLeaderName: '',
    projectTypeId: '',
    userId: '',
    projectLeaderListOptions: [],
    payeeList: []
  },
  uploadTenderImageList: null,
  onLoad(option) {

    this.setData({
      userId: app.globalData.userInfo.userId
    })
    this.setData({
      id:option.id,
    })
  
    if(option.id){
      this.getEdit(option.id) 
    }else{
      this.getProjectList()
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
      projectLeaderId: [{ required: true, message: '请选择项目负责人' }],
      affiliateUnit: [{ required: true, message: '请选择所属单位' }],
      contractName: [{ required: true, message: '请选择合同名称' }],
      contractAmount: [{ required: true, message: '请选择合同金额' }],
      cumulativePayment: [{ required: true, message: '请选择累计已付款' }],
      payUnit: [{ required: true, message: '请输入付款单位' }],
      receiverUnit: [{ required: true, message: '请选择收款单位' }],
      payAmount: [{ required: true, message: '请输入本次应付金额' }],
      paymentNode: [{ required: true, message: '请输入支付节点（或形象进度）' }],
      paymentContent: [{ required: true, message: '请输入付款内容' }],
      applicationTime: [{ required: true, message: '请选择申请日期' }],
      countersignLeader_text: [{ required: true, message: '请选择会签分管领导' }],
      monthType: [{ required: true, message: '请选择关联资金计划' }]
    }
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  chooseProjectLeader(data, column){
    console.log(data, column)
    this.setData({
      projectLeaderId: column.personId,
      projectLeader: column.name
    })
    this.form.setFieldValue('projectLeader', column.name)
    this.form.setFieldValue('projectLeaderId', column.personId)
  },
  getProjectLeader(){
    request.doPostRequest({
      url: projectService.API_PROJECT_LEADER,
      data: {projectId: this.data.projectId},
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
      }
    })
  },
  // 获取补充协议
  getSelectSupplementalAgreement:function(e) {
    request.doPostRequest({
      url: config.API_SELECT_SUPPLEMENTAL_AGREEMENT,
      data: {
        contractId:this.data.contractData.contractId,
      },
      success: res => {
        this.data.supplementaryAgreement = res.data
        this.setData({
          supplementaryAgreement:res.data
        })
      }
    }) 
    // 获取在途金额
    request.doPostRequest({
      url: config.API_AmountPaid,
      data: {
        contractId:this.data.contractData.contractId,
      },
      success: res => {
        this.setData({
          accumulatedPaymentAmount: Number(this.data.contractData.payAmount || 0) + Number(this.data.contractData.cumulativePayment || 0),
          supplementaryAgreement: res.data
        })
     
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
      payeeList: []
    });
    this.form.setFieldValue('contractName',data.contractName)
    this.form.setFieldValue('contractAmount',data.contractAmount)
    this.form.setFieldValue('payUnit','')
    this.form.setFieldValue('receiverUnit','')
    // 
    request.doPostRequest({
      url: config.API_SELECT_SUPPLEMENTAL_AGREEMENT,
      data: {
        contractId:data.contractId,
      },
      success: res => {
        this.setData({
          supplementaryAgreement: res.data
        })
      
      }
    }) 
    // 获取在途金额
    request.doPostRequest({
      url: config.API_AmountPaid,
      data: {
        contractId:data.contractId,
      },
      success: res => {
        this.setData({
          accumulatedPaymentAmount: Number(this.data.contractData.payAmount || 0) + Number(res.data.cumulativePayment || 0),
          transitAmount: res.data.transitAmount || 0,
          cumulativePayment:  res.data.cumulativePayment || 0,
        });
        console.log(' this.accumulatedPaymentAmount', this.data.accumulatedPaymentAmount )

        this.form.setFieldValue('cumulativePayment',res.data.cumulativePayment)
        this.form.setFieldValue('accumulatedPaymentAmount',  this.data.accumulatedPaymentAmount )
        this.form.setFieldValue('transitAmount',res.data.transitAmount)
      }
    })

  },
  accumulatedPaymentAmountFn: function (value, e) {
    console.log(value, e);
    this.setData({
      accumulatedPaymentAmount: Number(value) + Number(this.form.getFieldValue('cumulativePayment') || 0)
    })
    this.form.setFieldValue('accumulatedPaymentAmount',  this.data.accumulatedPaymentAmount )
    let aaa = parseInt(value).toString()
    if(aaa.length > 4) {
      this.setData({
        payAmountTitle: '请核对本次应付金额（万元单位）填写是否正确'
      })
    }else{
      this.setData({
        payAmountTitle: ''
      })
    }
    if(this.data.accumulatedPaymentAmount > Number(this.form.getFieldValue('contractAmount') || 0)) {
      this.setData({
        accumulatedPaymentAmountTitle: '累计支付金额超过主合同的合同金额，请注意'
      })
    }else{
      this.setData({
        accumulatedPaymentAmountTitle: ''
      })
    }
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
    earlyStageLeaderId: data.personId,
    earlyStageLeader: data.projectLeaderName,
    carryPersonId: data.carryPersonId,
    carryLeaderName: data.carryLeaderName,
    operatePersonId: data.operatePersonId,
    operateLeaderName: data.operateLeaderName,
    projectTypeId: (data.projectType).toString(),
    'projectTypeData.itemText':(data.projectType).toString() === '1' ? '集团项目（政府投资、地产类项目）' : '子公司项目',
    'projectTypeData.itemValue':(data.projectType).toString(),
  });
  if(this.data.projectTypeId === '1') {
    this.form.setFieldValue('projectType_text', '集团项目（政府投资、地产类项目）')
  } else {
    this.form.setFieldValue('projectType_text', '子公司项目')
  }
  if (this.data.projectTypeId === '1' && this.data.userId !== this.data.earlyStageLeaderId && this.data.userId !== this.data.carryPersonId && this.data.userId !== this.data.operatePersonId) {
    ddUtils.showToast({
      title: '注意：仅项目负责人可发起流程',
      duration: 2000
    });
    return
  }
  this.form.setFieldValue('projectName',data.name)
  this.form.setFieldValue('projectLeader',data.projectLeaderName)
  this.form.setFieldValue('affiliateUnit',data.affiliatedUnitName)
  this.form.setFieldValue('contractName','')
  this.form.setFieldValue('contractId','')
  this.form.setFieldValue('contractAmount','')
  this.form.setFieldValue('cumulativePayment','')
  this.form.setFieldValue('payUnit','')
  this.form.setFieldValue('receiverUnit','')
  this.getProjectLeader()

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
  this.getPayeeList(data)
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

},
// 上传
onSaveUploadImgRef: function (ref) {
  this.uploadImageList = ref;
},
onSaveUploadFileRef: function (ref) {
  this.uploadTenderImageList = ref;
},
 //会签分管领导
  bindChooseExecuteUserTap: function (e) {
 
    if (this.dialogScreenExecuteUserRef) this.dialogScreenExecuteUserRef._showDialog(this.data.executeUser)
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

},
// 
paymentApplication(e){

ddUtils.navigateTo({
  url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${e.currentTarget.dataset.index}&approvalType=1`
});
},
getProjectList(){
  request.doPostRequest({
    url: config.API_PROJECT_NAME,
    success: res => {
      res.data.forEach(e => {
        e.label = e.name
        e.value = e.id
      })
      this.setData({
        projectListOptions: res.data || []
      })
    }
  })
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
        'projectLeaderId':res.data.projectLeaderId
      })
      request.doPostRequest({
        url: config.API_PROJECT_NAME,
        success: result => {
          result.data.forEach(e => {
            e.label = e.name
            e.value = e.id
          })
          this.setData({
            projectListOptions: result.data || []
          })
          this.setData({
            accumulatedPaymentAmount: Number(res.data.payAmount || 0) + Number(res.data.cumulativePayment || 0),
            earlyStageLeaderId: this.data.projectListOptions.find(e => e.id === paramsdata.projectId).personId,
            earlyStageLeader: this.data.projectListOptions.find(e => e.id === paramsdata.projectId).projectLeaderName,
            carryPersonId: this.data.projectListOptions.find(e => e.id === paramsdata.projectId).carryPersonId,
            carryLeaderName: this.data.projectListOptions.find(e => e.id === paramsdata.projectId).carryLeaderName,
            operatePersonId: this.data.projectListOptions.find(e => e.id === paramsdata.projectId).operatePersonId,
            operateLeaderName: this.data.projectListOptions.find(e => e.id === paramsdata.projectId).operateLeaderName,
            projectTypeId: (this.data.projectListOptions.find(e => e.id === paramsdata.projectId).projectType).toString(),
          })
        }
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
      this.form.setFieldValue('accumulatedPaymentAmount',  Number(res.data.payAmount || 0) + Number(res.data.cumulativePayment || 0))
      this.form.setFieldValue('monthType', res.data.monthType || '')
      this.form.setFieldValue('projectLeaderId', res.data.projectLeaderId || '')
        // 获取补充协议
      this.getProjectLeader()
    request.doPostRequest({
      url: config.API_SELECT_SUPPLEMENTAL_AGREEMENT,
      data: {
        contractId:this.data.contractData.contractId,
      },
      success: res => {
        console.log('2323232323', res);
        this.data.supplementaryAgreement = res.data
        this.setData({
          supplementaryAgreement: res.data
        })
      }
    }) 
    //  收款单位
    request.doPostRequest({
      url: config.API_SELECT_BYCONTRACT_ID_WITHUNIT,
      data: {
        contractId: this.data.contractData.contractId,
      },
      success: result => {
        const option = result.data.find((item) => item.unitName === res.data.receiverUnit)
        this.getPayeeList(option)
       }
     });
      const files = res.data.investmentFileList?res.data.investmentFileList.map((item)=>{
        return {
          ...item,
          name:item.fileName,
        }
      }): []
      const files1 = res.data.acceptanceFileList?res.data.acceptanceFileList.map((item)=>{
        return {
          ...item,
          name:item.fileName,
        }
      }):[]
      setTimeout(() => {
        this.uploadImageList._setImageList(files) 
        this.uploadTenderImageList._setImageList(files1)
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
async submit() {
  if (this.data.projectTypeId === '1' && this.data.userId !== this.data.earlyStageLeaderId && this.data.userId !== this.data.carryPersonId && this.data.userId !== this.data.operatePersonId) {
    ddUtils.showToast({
      title: '注意：仅项目负责人可发起流程',
      duration: 2000
    });
    return
  }
  if ( this.form.getFieldValue('contractAmount') < this.form.getFieldValue('accumulatedPaymentAmount') && !this.form.getFieldValue('remark') ) {
      this.setData({
        remarkTitle: true
      })
  }else{
    this.setData({
      remarkTitle: false
    })
    const params = await this.form.submit();
    this.setData({
      loading: true
    })
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
    params.countersignLeader = this.data.countersignLeader,
    params.projectLeader = this.data.projectLeader,
    params.projectLeaderId = this.data.projectLeaderId
    if (this.uploadImageList) {
      let temsFileList=[]
      temsFileList = this.uploadImageList.data.imgList;
      if (ddUtils.showEmptyArrayTips(temsFileList, "请上传合同正式稿及相关附件")){
        this.setData({
          loading: false
        })
        return
      };
      temsFileList.forEach(e => {
        e.fileName = e.name
        e.type= 3
      })
      params.investmentFileList =  temsFileList
    }
    if(this.uploadTenderImageList){
      let temFileLists=[]
      temFileLists = this.uploadTenderImageList.data.imgList;
      if(params.accumulatedPaymentAmount < params.contractAmount*0.75){
        if (ddUtils.showEmptyArrayTips(temFileLists, "请上传验收文件")) {
          this.setData({
            loading: false
          })
          return
        };
      }
      temFileLists.forEach(e => {
        e.fileName = e.name
        e.type= 7
      })
      params.acceptanceFileList =  temFileLists
    }
    if (params.contractAmount === 0 || params.contractAmount === '0') {
      this.isLoading = false
       ddUtils.showToast({
        title: "当前合同金额为0，请至【合同审批流程】中填写已定金额后再进行款项支付!"
       });
       this.setData({
        loading: false
      })
      return
    }
    if (params.accumulatedPaymentAmount > params.contractAmount * 0.85 || params.accumulatedPaymentAmount === params.contractAmount * 0.85) {
      let result = this.data.payeeList.some(item => item.isEvaluate === '0')
      if (result) {
        ddUtils.showToast({
          title: "存在收款单位未进行评价，请评价后再提交审批！"
         });
         this.setData({
          loading: false
        })
        return
      }
    }

    if(params.accumulatedPaymentAmount > params.contractAmount){
      ddUtils.showModal({
        content: "累计支付金额已超过主合同金额,确定提交审批",
        success: res => {
          if (res.confirm) {
            request.doPostRequest({
              url: connector.API_PAY_BUT_POST,
              data: params,
              success: res => {
                ddUtils.showToast({
                  title:"保存成功"
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
          }else{
            this.setData({ loading: false })
          }
        }  
      })
    }else{
      request.doPostRequest({
        url: connector.API_PAY_BUT_POST,
        data: params,
        success: res => {
          ddUtils.showToast({
            title:"保存成功"
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
    }
  }
},
// 暂存
workingStorage(){
  if (this.data.projectTypeId === '1' && this.data.userId !== this.data.earlyStageLeaderId && this.data.userId !== this.data.carryPersonId && this.data.userId !== this.data.operatePersonId) {
    ddUtils.showToast({
      title: '注意：仅项目负责人可发起流程',
      duration: 2000
    });
    return
  }
  this.form.rules = {}
  let params = this.form.getFieldsValue()
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
  params.countersignLeader = this.data.countersignLeader,
  params.projectLeaderId = this.data.projectLeaderId,
  params.projectLeader = this.data.projectLeader
  if (this.uploadImageList) {
    let temFileLists=[]
    temFileLists = this.uploadImageList.data.imgList;
    temFileLists.forEach(e => {
      e.fileName = e.name
      e.type= 3
    })
    params.investmentFileList =  temFileLists
   }
    if(this.uploadTenderImageList){
      let temsFileList=[]
      temsFileList = this.uploadTenderImageList.data.imgList;
      temsFileList.forEach(e => {
        e.fileName = e.name
        e.type= 7
      })
      params.acceptanceFileList =  temsFileList
    }
 
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
getPayeeList(option){
  request.doPostRequest({
    url: projectService.API_SELECT_UNIT_BY_PROJECTID,
    data: {
      projectId: this.data.projectId,
      id: this.data.contractData.contractId,
      ...option
    },
    success: res => {
      this.setData({
        payeeList: res.data? res.data : []
      })
    }
  })
},
viewReviews(e){
   let data = e.target.dataset.row
   request.doPostRequest({
    url: projectService.API_LIST_CURRENT_UNITSCORE,
    data: {
      currentUnitId: data.currentUnitId
    },
    success: res => {
      if (res.data.length === 1) {
        this.JumpIt(res.data[0])
      }else {
        ddUtils.navigateTo({
          url: `/pages/work/page/evaluationList/evaluationList?evaluationList=${JSON.stringify(res.data)}`
        });
      }
    }
  })
},
JumpIt(row) {
  ddUtils.navigateTo({
    url: `/pages/work/page/evaluationDetails/evaluationDetails?id=${row.id}`
  });
 }
});
