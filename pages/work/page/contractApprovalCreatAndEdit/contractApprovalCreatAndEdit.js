import { Form } from 'antd-mini/es/Form/form';
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";
import { formatTimeToDay } from "../../../../utils/utils";

const validateMessages = {
  required: '请输入',
  string: {
    min: '最少${min}个字符',
    max: '最多${max}个字符'
  },
  pattern: {
    mismatch: '${label}需要满足${pattern}',
  },
};
Page({
  form: new Form({
    validateMessages,
    initialValues: {
      applicationTime: formatTimeToDay(new Date()),
      unitPartyMode: 2,
      developmentOrganizationModeList: ['2']
    },
    rules: {}
  }),
  data: {
    navbarData:{
      title: "新增合同"
    },
    radioGroupOptions: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    radioGroupOptionss: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    radioGroupOptionsTwo: [
      { value: 0, label: '待定' },
      { value: 1, label: '已定(含暂定合同价)' },
    ],
    radioGroupOptionsData: [
      { value: 1, label: '天' },
      { value: 2, label: '月' },
      { value: 3, label: '截止日期' },
    ],
    unitPartyModeOptions: [
      { value: 0, label: '' },
      // { value: 1, label: '政府单位(含市属企业)' },
      { value: 2, label: '单位' },
      { value: 3, label: '个人' },
    ],
    unitPartyModeOptions2: [
      // { value: '1', label: '政府单位(含市属企业)', text: '政府单位(含市属企业)'},
      { value: '2', label: '单位', text: '单位' },
      { value: '3', label: '个人', text:'个人' },
    ],
    list:[
      // {thirdPartyName: '', thirdParty: '', thirdPartyType: '', label1: '第' + '3' + '方:', label2: '第' + 3 + '方服务类型:' },
      // {thirdPartyName: '', thirdParty: '', thirdPartyType: '', label1: '第' + '4' + '方:', label2: '第' + 4 + '方服务类型:' },
    ],
    projectTypeOptions: [],
    modeContractOptions: [
      {label:'直接',value: '1'},
      {label:'其他',value: '2'}
    ],
    paymentMethodOptions: [],
    unitTypeOption: [],
    unitTypeOptionLis: [],
    contractList:[],
    biddingListOptions: [],
    countersignLeader: null,
    projectId: null,
    projectName:'',
    contractShow: false,
    tenderShow: false,
    showOther: false,
    contractId: null,
    unitPartyName: null,
    listIndex: null,
    projectListOptions: [],
    developmentOrganizationOptions: [],
    unitPartyOptions: [],
    executeUser: [],
    contractPeriodType: null,
    unitPartyMode: 2,//乙方单位
    developmentOrganizationModeList: ['2'],
    developmentOrganizationListName: '',
    contractType: null,
    proType: null, //0工程，1非工程
    projectLeaderId: '',
    loading: false,
    selectedList: [],
    isShow: false,
    isShow2: false
  },
  dialogScreenProject: null,
  dialogSScreenExecuteUser: null,
  dialogScreenEcologicalUnit: null,
  dialogScreenConstructUnit: null,
  dialogScreenConstructUnit2: null,
  uploadImageList: null,
  pickerDateRef: null,
  pickerEndDateRef: null,

  onLoad(options) {
    this.form.rules = {
      projectId: [{ required: true, message: '请输入' }],
      contractName: [{ required: true, message: '请输入' }],
      contractNumber: [{ required: true, message: '请输入' }],
      supplementAgreement: [{ required: true, message: '请选择' }],
      masterContract: [{ required: true, message: '请选择' }],
      projectType: [{ required: true, message: '请选择' }],
      contractNeedTender: [{ required: true, message: '请选择' }],
      // tenderDocumentId: [{ required: true, message: '请选择' }],
      // biddingTypeName: [{ required: true, message: '请选择' }],
      modeContract: [{ required: true, message: '请选择' }],
      contractPeriod: [{ required: true, max: 5, message: '请输入(最多5位的整数)',pattern: /^[1-9]\d{0,4}$/ }],
      contractPeriodMonth: [{ required: true, max: 5, message: '请输入(最多5位的整数)',pattern: /^[1-9]\d{0,4}$/ }],
      contractEndTime: [{ required: true, message: '请选择' }],
      makeSure: [{ required: true, message: '请选择' }],
      contractAmount: [{ required: true,message: '请输入(最多15位整数6位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,6})?$/ }],
      amountPaid: [{ required: true,message: '请输入(最多15位整数6位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,6})?$/ }],
      developmentOrganization: [{ required: true, message: '请选择' }],
      unitPartyMode: [{ required: true, message: '请选择' }],
      unitPartyName: [{ required: true, message: '请选择' }],
      unitPartyType: [{ required: true, message: '请选择' }],
      unitPartyPerson: [{ required: true, message: '请选择' }],
      unitPartyNumber: [{ required: true, message: '请选择' }],
      unitParty: [{ required: true, message: '请选择' }],
      contractContent: [{ required: true, message: '请输入' }],
      paymentMethod: [{ required: true, message: '请选择' }],
      countersignLeader_dictText: [{ required: true, message: '请选择' }],
      applicationTime: [{ required: true, message: '请选择' }],
      developmentOrganizationName: [{ required: true, message: '请选择' }],
      developmentOrganizationPerson: [{ required: true, message: '请选择' }],
      developmentOrganizationNumber: [{ required: true, message: '请选择' }],
      developmentOrganizationModeList: [{ required: true, message: '请选择' }],
      contractPeriodType: [{ required: true, message: '请选择' }]
    }
    this.getCodeList()
    if(options.id){
      this.setData({
        contractId: options.id,
        navbarData: {title: '编辑合同'}
      })
      this.getDetail()
    }else{
      this.setData({
        list: []
      })
    }
    this.getProjectList()
    if(options.contractType){
      this.setData({
        contractType:options.contractType
      })
    }
  },
  onReady(){
    
  },
  onSavePickerDateRef(ref){
    this.pickerDateRef = ref
  },
  onSavePickerEndDateRef(ref){
    this.pickerEndDateRef = ref
  },
  onSaveUploadContractImgRef: function (ref) {
    this.uploadImageList = ref;
  },
  onSaveDialogScreenprojecteRef(ref){
    this.dialogScreenProject = ref
  },
  onSaveDialogScreenExecuteUserRef(ref){
    this.dialogSScreenExecuteUser = ref
  },
  onSaveDialogScreenEcologicalUnitRef(ref){
    this.dialogScreenEcologicalUnit = ref
  },
  onSaveDialogScreenConstructUnitRef(ref){
    this.dialogScreenConstructUnit = ref
  },
  onSaveDialogScreenConstructUnitRef2(ref){
    this.dialogScreenConstructUnit2 = ref
  },
  chooseTime(){
    my.hideKeyboard();
    if(this.pickerDateRef) this.pickerDateRef._showDialog()
  },
  chooseEndTime(){
    if(this.pickerEndDateRef) this.pickerEndDateRef._showDialog()
  },
  chooseProject(){
    if(this.dialogScreenProject) this.dialogScreenProject._showDialog()
  },
  chooseLeader(){
    if(this.dialogSScreenExecuteUser) this.dialogSScreenExecuteUser._showDialog(this.data.executeUser)
  },
  chooseEcologicalUnit(){
    if(this.dialogScreenEcologicalUnit) this.dialogScreenEcologicalUnit._showDialog()
  },
  chooseUnit(){
    if(this.dialogScreenConstructUnit) this.dialogScreenConstructUnit._showDialog()
  },
  bindPickerDateCannBack(data){
    this.form.setFieldValue('applicationTime', data.startDate);
  },
  bindPickerEndDateCannBack(data){
    this.form.setFieldValue('contractEndTime', data.startDate)
  },
  changeContractName(data){
    // let projectName = this.form.getFieldValue('projectName')
    if(this.data.proType === 0){
      this.form.setFieldValue('title', this.data.projectName+'-'+data)
    }else{
      this.form.setFieldValue('title', '')
    }
  },
  chooseThirdParty(value,e){
    console.log(value,e);
    this.setData({
      listIndex: value.currentTarget.dataset.index
    })
    if(this.dialogScreenConstructUnit2) this.dialogScreenConstructUnit2._showDialog()
  },
  chooseUnitTypeCallBack(data){
    console.log(data);
    let list = this.data.list
    list[this.data.listIndex].thirdPartyType = data
    // list[this.data.listIndex].thirdPartyTypeName = this.data.unitTypeOptionList.find(e => e.id === data).label
    console.log('list', list);
    this.setData({
      list
    })
  },
  supplementAgreementChange(data){
    // console.log('是否补充',data)
    this.setData({
      contractShow: data===1?true:false
    })
  },
  contractNeedTenderChange(data){
    this.setData({
      tenderShow: data===1?true:false
    })
  },
  modeContractChange(data){
    console.log(data)
    this.setData({
      showOther: data==='2'?true:false
    })
  },
  contractPeriodTypeChange(data){
    this.setData({
      contractPeriodType: data
    })
  },
  unitPartyModeChange(value, column, e){
    console.log("乙方选择",value, column, e)
    this.setData({
      unitPartyMode: value
    })
  },
  contractAmountChange(value){
    console.log('合同金额', value)
    let aaa = parseInt(value).toString()
    if(aaa.length > 4){
      this.setData({
        isShow: true
      })
    }else{
      this.setData({
        isShow: false
      })
    }
  },
  amountPaidChange(value){
    let aaa = parseInt(value).toString()
    if(aaa.length > 4){
      this.setData({
        isShow2: true
      })
    }else{
      this.setData({
        isShow2: false
      })
    }
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  bindChooseProjectCallBack(data){
    // this.form.setFieldValue('projectName',data.name)
    this.form.setFieldValue('projectId', data.id)
    this.form.setFieldValue('projectLeader', data.projectLeaderName);
    this.form.setFieldValue('affiliateUnit', data.affiliatedUnitName);
    this.form.setFieldValue('projectLeaderId', data.personId);
    this.setData({
      projectId: data.id,
      projectName: data.name,
      proType: data.proType,
      projectLeaderId: data.personId
    })
    let contractName = this.form.getFieldValue('contractName') || ''
    if( data.proType === 0){
      this.form.setFieldValue('title', data.name+'-'+contractName)
    }else{
      this.form.setFieldValue('title', '')
    }
    
    setTimeout(() => {
      this.getQueryCurrentUnitType()
      this.getBiddingData(data.id)
      this.getContractList()
      this.getEcological()
    },1000)
  },
  bindScreenEcologicalUnitCallBack(data){
    this.form.setFieldValue('unitPartyName', data.name);
    this.form.setFieldValue('unitParty', data.id);
    this.setData({
      unitParty: data.id,
      unitPartyName: data.name
    })
  },
  bindScreenExecuteUserCallBack(data){
    this.form.setFieldValue('countersignLeader_dictText', data.map(e => e.username).toString());
    this.setData({
      countersignLeader: data.map(e => e.userId).toString()
    })
    this.setData({
      executeUser: data && data.map(e => {
        return { userId: e.userId, username: e.username,disabled:e.disabled };
      })
    });
  },
  bindScreenConstructUnitCallBack2(data){
    console.log('第三',data);
    let list = this.data.list
    list[this.data.listIndex].thirdParty = data.id
    list[this.data.listIndex].thirdPartyName = data.name
    console.log(list);
    this.setData({
      list:list
    })
    console.log(this.form.getFieldsValue());
    
  },
  developmentOrganizationModeChange(value){
    console.log('甲方',value)
    this.form.setFieldValue('developmentOrganizationModeList', value);
    this.setData({
      developmentOrganizationModeList: value
    })
  },
  chooseUnitType(value,e){
    console.log(value,e);
    this.setData({
      listIndex: e.currentTarget.dataset.index
    })
  },
  contractThirdModeChange(value){
    let list = this.data.list
    list[this.data.listIndex].contractThirdMode = value
    this.setData({
      list:list
    })
  },
  thirdPartyNameChange(value){
    let list = this.data.list
    list[this.data.listIndex].thirdPartyName = value
    this.setData({
      list:list
    })
  },
  contractThirdPersonInput(value){
    let list = this.data.list
    list[this.data.listIndex].contractThirdPerson = value
    this.setData({
      list:list
    })
  },
  contractThirdNumberInput(value){
    let list = this.data.list
    list[this.data.listIndex].contractThirdNumber = value
    this.setData({
      list:list
    })
  },
  //建设单位（甲方）
  bindScreenConstructUnitCallBack(data){
    this.form.setFieldValue('developmentOrganization', data.id);
    this.form.setFieldValue('developmentOrganizationListName',data.map(e => e.unitName).join())
    let list = data.map(e => {
      return {
        developmentOrganizationName: e.unitName,
        developmentOrganization: e.id,
        ecUnitId: e.ecUnitId
      }
    })
    this.setData({
      // developmentOrganizationName: data.unitName,
      // developmentOrganization: data.id,
      // ecUnitId: data.ecUnitId,
      developmentOrganizationList: list,
      developmentOrganizationListName: data.map(e => e.unitName).join(),
      selectedList: data.map(e => e.id)
    })
  },
  chooseTenderDocument(data){
    let text = this.data.biddingListOptions.find(e =>e.id === data).biddingType_dictText
    this.form.setFieldValue('biddingTypeName', text);
  },
  addUnit(){
    let length = this.data.list.length
    let number = length + 3
    let listList = this.data.list
    listList.push({
      contractThirdMode: '',
      thirdPartyNum: length + 1,
      contractThirdNumber: '',
      contractThirdPerson: '',
      thirdPartyName: '',
      thirdParty: '',
      thirdPartyType: '',
      label1: this.numberToChinese(number) + '方单位:',
      label2: this.numberToChinese(number) + '方服务类型:',
    })
    this.setData({
      list: listList
    })
    console.log(this.data.list)
  },
  getBiddingData(projectId){
    request.doPostRequest({
      url: projectService.API_TENDERDOCUMENT_LIST,
      data: {
        pageNum: 1,pageSize: 999,approvalStatus:4,projectId
      },
      success: res => {
        res.data.records.forEach(e => {
          // e.label = e.tenderName+'-'+e.createBy_dictText+'-'+(e.tenderAmount?e.tenderAmount:0)+'万元'
          e.label = e.tenderName
          e.value = e.id
        })
        this.setData({
          biddingListOptions: res.data.records || []
        })
      }
    })
  },
  async getContractList() {
    request.doPostRequest({
      url: projectService.API_CONTRACT_LIST,
      data: {
        projectId: this.data.projectId
      },
      success: res => {
        res.data.forEach(e => {
          e.label = e.contractName
          e.value = e.id
        })
        this.setData({
          contractList: res.data || []
        })
      }
    })
  },
  //乙方单位服务类型
  async getQueryCurrentUnitType() {
    request.doPostRequest({
      url: projectService.API_CURRENTUNIT_TYPE,
      data: {
        proId: this.data.projectId
      },
      success: res => {
        const optionsList = res.data.map(e => {return { label: e.type_dictText, value: e.type, id:e.id}})
        const list = res.data.map(e => {return { label: e.type_dictText, value: e.type, id:e.id}})
        this.setData({
          unitTypeOption: optionsList || [],
          unitTypeOptionList: list || []
        })
      }
    })
  },
  getCodeList(){
    //项目类型
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'contract_project_type',
      success: res => {
        res.data.forEach(e => {
          e.label = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          projectTypeOptions: res.data || []
        })
      }
    })
    //付款方式
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'payment_method',
      success: res => {
        res.data.forEach(e => {
          e.label = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          paymentMethodOptions: res.data || []
        })
      }
    })
  },
  numberToChinese(num) {
    // const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    // const chineseUnits = ['', '十', '百', '千']
    // if (num === 0) {
    //   return chineseNums[0]
    // }
    // let chineseStr = ''
    // let unitIndex = 0
    // while (num > 0) {
    //   const digit = num % 10
    //   if (digit !== 0) {
    //     // 处理非零数字
    //     chineseStr = chineseNums[digit] + chineseUnits[unitIndex] + chineseStr
    //   } else if (chineseStr.charAt(0) !== chineseNums[0]) {
    //     // 处理连续的零，只保留一个零
    //     chineseStr = chineseNums[0] + chineseStr
    //   }
    //   num = Math.floor(num / 10)
    //   unitIndex++
    // }
    // return chineseStr
    const arr = ['', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛']
    let chineseStr = ''
    chineseStr = arr[num]
    return chineseStr
  },
  deleteThis(e){
    const { index } = e.currentTarget.dataset;
    const list = [...this.data.list];
    list.splice(index, 1);
    list.forEach((e,index) => {
      e.thirdPartyType = e.thirdPartyType.toString()
      e.label1 = this.numberToChinese(index + 3) + '方单位:'
      e.label2 = this.numberToChinese(index + 3) + '方服务类型:'
    })
    this.setData({
      list: JSON.parse(JSON.stringify(list))
    });
  },
  reset(){
    ddUtils.showModal({
      title:'请确认',
      content: "是否退出编辑，退出后不会保存当前编辑内容",
      success: res => {
        if (res.confirm) {
          this.form.reset();
          ddUtils.navigateBack();
        }
      }
    });
  },
  staging(){
    this.form.rules = {}
    let params = this.form.getFieldsValue()
    console.log("获取表单值：", params)
    // params.vueUrl = 'ApproveContractApprovalDetail,ApproveContractApprovalCreatAndEdit'
    params.singleUrl = '/pages/work/page/contractApprovalDetail/contractApprovalDetail'
    // params.pcUrl = 'https://xmgk.lhbigdata.com/#/biddingManage/contractApproval/contractApproval/detail'

    if(params.supplementAgreement === 1){
      params.vueUrl = 'ApproveSupplementContractApprovalDetail,ApproveContractApprovalCreatAndEdit'
      params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/supplementContractApprovalDetail'
    }else{
      params.vueUrl = 'ApproveContractApprovalDetail,ApproveContractApprovalCreatAndEdit'
      params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/contractApprovalDetail'
    }

    if(this.data.contractId){
      params.id = this.data.contractId
      params.urlParameter = JSON.stringify({id: this.data.contractId})
    }else{
      params.urlParameter = JSON.stringify({})
    }
    console.log('this.data.list',this.data.list);
    if(this.data.contractType === 1){
      params.title = params.title.replace('合同审批流程：', '')
    }else{
      params.title = params.title.replace('直接添加合同：', '')
    }
    
    params.projectLeaderId = this.data.projectLeaderId
    params.contractType = this.data.contractType
    params.contractThirdPartyRepList = this.data.list
    params.projectName = this.data.projectName
    params.unitPartyName = this.data.unitPartyName
    params.countersignLeader = this.data.countersignLeader
    params.developmentOrganizationName  = this.data.developmentOrganizationName 
    params.developmentOrganizationModeList = params.developmentOrganizationModeList || this.data.developmentOrganizationModeList
    params.developmentOrganizationList = this.data.developmentOrganizationList
    params.ecUnitId = this.data.ecUnitId
    console.log(params)
    // if(params.unitPartyType){
    //   params.unitPartyTypeName = this.data.unitTypeOptionList.find(e => e.value === params.unitPartyType).label
    // }
    
    let workAuditFile = [];
    if (this.uploadImageList) {
      workAuditFile = this.uploadImageList._getUploadImgId().imgList;
    }
    // if(ddUtils.showEmptyArrayTips(workAuditFile,"请上传合同正式稿及相关附件！")) return
    
    workAuditFile.forEach(e => {
      e.fileName = e.name
      e.type = 3
    })
    params.fileList = workAuditFile

    request.doPostRequest({
      url: projectService.API_CONTRACT_TEMPORARY_STORAGE,
      data: params,
      success: res => {
        ddUtils.showToast({
          title: "暂存成功！"
        });
        ddUtils.navigateBack();
      }
    })
  },
  async submit(){
    console.log(this.data.list)
    this.setData({ loading: true })
    const params = await this.form.submit();
    if(this.data.contractId){
      params.id = this.data.contractId
      params.urlParameter = JSON.stringify({id: this.data.contractId})
    }else{
      params.urlParameter = JSON.stringify({})
    }
    if (this.data.list && this.data.list.length) {
      this.data.list.map(e => {
        if(e.contractThirdMode === 2){
          if (e.thirdPartyName === '' || e.thirdPartyType === '') {
            ddUtils.showToast({title: '选择单位时，单位信息必填'})
            throw Error()
          }
        }else if(e.contractThirdMode === 3){
          if (e.contractThirdPerson === '' || e.contractThirdNumber === '') {
            ddUtils.showToast({title: '选择个人时，个人信息必填！'})
            throw Error()
          }
        }
      })
    }
    if(this.data.contractType === 1){
      params.title = params.title.replace('合同审批流程：', '')
    }else{
      params.title = params.title.replace('直接添加合同：', '')
    }
    params.projectLeaderId = this.data.projectLeaderId
    params.contractType = this.data.contractType
    params.contractThirdPartyRepList = this.data.list
    params.projectName = this.data.projectName
    params.countersignLeader = this.data.countersignLeader
    // params.vueUrl = 'ApproveContractApprovalDetail,ApproveContractApprovalCreatAndEdit'
    params.singleUrl = '/pages/work/page/contractApprovalDetail/contractApprovalDetail'
    // params.pcUrl = 'https://xmgk.lhbigdata.com/#/biddingManage/contractApproval/contractApproval/detail'

    if(params.supplementAgreement === 1){
      params.vueUrl = 'ApproveSupplementContractApprovalDetail,ApproveContractApprovalCreatAndEdit'
      params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/supplementContractApprovalDetail'
    }else{
      params.vueUrl = 'ApproveContractApprovalDetail,ApproveContractApprovalCreatAndEdit'
      params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/contractApprovalDetail'
    }

    params.unitPartyName  = this.data.unitPartyName 
    params.countersignLeader = this.data.countersignLeader
    params.developmentOrganizationName  = this.data.developmentOrganizationName 
    params.developmentOrganizationList = this.data.developmentOrganizationList
    params.ecUnitId = this.data.ecUnitId
    // params.unitPartyTypeName = this.data.unitTypeOptionList.find(e => e.value === params.unitPartyType).label
    let workAuditFile = [];
    if (this.uploadImageList) {
      workAuditFile = this.uploadImageList._getUploadImgId().imgList;
    }
    if(ddUtils.showEmptyArrayTips(workAuditFile,"请上传合同正式稿及相关附件！")) return
    
    workAuditFile.forEach(e => {
      e.fileName = e.name
      e.type = 3
    })
    params.fileList = workAuditFile

    request.doPostRequest({
      url: projectService.API_CONTRACT_SAVEANDSUBMIT,
      data: params,
      success: res => {
        console.log(res.data)
        this.setData({ loading: false })
        ddUtils.showToast({
          title: "保存成功！"
        });
        ddUtils.navigateBack();
      }
    })
  },
  getDetail(){
    request.doPostRequest({
      url: projectService.API_CONTRACT_DETAIL,
      data: {id: this.data.contractId},
      success: res => {
        const paramsdata = res.data
        //查项目状态
        if(paramsdata.projectId){
          request.doPostRequest({
            url: projectService.API_SELECTPROJECT_INFO_BYID,
            data: {id: paramsdata.projectId},
            success: res => {
              this.setData({
                proType: res.data.proType
              })
            }
          })
        }

        if(paramsdata.projectType){
          paramsdata.projectType = paramsdata.projectType.toString()
        }
        if(paramsdata.paymentMethod){
          paramsdata.paymentMethod = paramsdata.paymentMethod.toString()
        }

        setTimeout(() => {
          this.getQueryCurrentUnitType()
          this.getBiddingData(paramsdata.projectId)
          this.getContractList()
          this.form.setFieldValue('biddingTypeName',paramsdata.biddingType_dictText)
          this.form.setFieldValue('tenderDocumentId',paramsdata.tenderDocumentId)
          this.form.setFieldValue('masterContract',paramsdata.masterContract)
        },1000)

        const fields = this.form.getFieldsValue()
        console.log(fields);
        for (let item in fields) {
          if ({}.hasOwnProperty.call(fields, item)) {
            fields[item] = paramsdata[item] || ''
          }
        }
        this.form.setFieldsValue({
          ...fields,
        })
        this.form.setFieldValue('contractNeedTender', paramsdata.contractNeedTender)
        this.form.setFieldValue('supplementAgreement', paramsdata.supplementAgreement)
        this.form.setFieldValue('makeSure', paramsdata.makeSure)
        this.form.setFieldValue('contractNumber', paramsdata.contractNumber)
        this.form.setFieldValue('contractAmount', paramsdata.contractAmount)

        if(paramsdata.contractType === 1){
          this.form.setFieldValue('title',paramsdata.title.replace('合同审批流程：',''))
        }else{
          this.form.setFieldValue('title',paramsdata.title.replace('直接添加合同：',''))
        }
        
        

        console.log(this.form.getFieldsValue())
        let list = paramsdata.contractThirdPartyRepList
        if(list && list.length){
          list.forEach((e, index)=> {
            e.thirdPartyType = e.thirdPartyType.toString()
            e.label1 = this.numberToChinese(index + 3) + '方单位:'
            e.label2 = this.numberToChinese(index + 3) + '方服务类型:'
          });
        }
        
        this.setData({
          contractType: paramsdata.contractType,
          unitPartyName: paramsdata.unitPartyName,
          countersignLeader: paramsdata.countersignLeader,
          projectId: paramsdata.projectId,
          projectName: paramsdata.projectName,
          developmentOrganizationName: paramsdata.developmentOrganizationName,
          ecUnitId: paramsdata.ecUnitId,
          unitPartyTypeName: paramsdata.unitPartyTypeName,
          contractShow: paramsdata.supplementAgreement===1?true:false,
          tenderShow: paramsdata.contractNeedTender===1?true:false,
          projectLeaderId: paramsdata.projectLeaderId,
          unitPartyMode: paramsdata.unitPartyMode,
          developmentOrganizationModeList: paramsdata.developmentOrganizationModeList,
          contractPeriodType: paramsdata.contractPeriodType,
          developmentOrganizationList: paramsdata.developmentOrganizationList,
          developmentOrganizationListName: paramsdata.developmentOrganizationList.map(e => e.developmentOrganizationName).join(),
          selectedList:paramsdata.developmentOrganizationList.map(e => e.developmentOrganization).join(),
          list
        })
        if(paramsdata.fileList && paramsdata.fileList){
          paramsdata.fileList.forEach(e => {
            e.name = e.fileName
          })
        }
        setTimeout(() => {
          this.uploadImageList._setImageList(paramsdata.fileList?paramsdata.fileList:[]) 

          this.form.setFieldValue('developmentOrganizationPerson', paramsdata.developmentOrganizationPerson)
          this.form.setFieldValue('developmentOrganizationNumber', paramsdata.developmentOrganizationNumber)

          this.form.setFieldValue('contractThirdPerson', paramsdata.contractThirdPerson)
          this.form.setFieldValue('contractThirdNumber', paramsdata.contractThirdNumber)
          this.form.setFieldValue('unitParty', paramsdata.unitParty)
          this.form.setFieldValue('unitPartyType', paramsdata.unitPartyType)

          this.form.setFieldValue('contractPeriodMonth', paramsdata.contractPeriodMonth)
          this.form.setFieldValue('contractPeriod', paramsdata.contractPeriod)
          this.form.setFieldValue('contractEndTime', paramsdata.contractEndTime)
          this.form.setFieldValue('developmentOrganizationListName', paramsdata.developmentOrganizationList.map(e => e.developmentOrganizationName).join(),)

        }, 0);

        
        if(paramsdata.countersignLeader_dictText && paramsdata.countersignLeader){
          const nameList = paramsdata.countersignLeader_dictText.split(',')
          const idList = paramsdata.countersignLeader.split(',')
          this.setData({
            executeUser: nameList.map((item, index) => { return { username: item, userId: idList[index] } }) || []
          })
        }

        this.getEcological()
      }
    })
  },
  getProjectList(){
    request.doPostRequest({
      url: config.API_PROJECT_NAME,
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
  getEcological(){
    request.doPostRequest({
      url: projectService.API_CURRENTUNIT,
      data: {
        pageSize: 9999,
        pageNum: 1,
        unitTypeId: '1710172427167727616',
        proId: this.data.projectId
      },
      success: res => {
        res.data.records.forEach(e => {
          e.label = e.unitName
          e.value = e.id
        })
        this.setData({
          developmentOrganizationOptions: res.data.records || []
        })
      }
    })
    
    request.doPostRequest({
      url: projectService.API_GET_UNIT_BIDING,
      data: {
        pageSize: 9999,
        pageNum: 1,
        auditStatus: 3
      },
      success: res => {
        res.data.records.forEach(e => {
          e.label = e.name
          e.value = e.id
        })
        this.setData({
          unitPartyOptions: res.data.records || []
        })
      }
    })
  }
});
