import { Form } from 'antd-mini/es/Form/form';
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";
import { formatTimeToDay } from "../../../../utils/utils";

Page({
  form: new Form({
    initialValues: {
      applicationTime: formatTimeToDay(new Date())+ ' 00:00:00'
    },
    rules: {
      projectName: [{ required: true, message: '请输入' }],
      projectId: [{ required: true, message: '请选择' }],
      contractName: [{ required: true, message: '请输入' }],
      contractNumber: [{ required: true, message: '请输入' }],
      supplementAgreement: [{ required: true, message: '请选择' }],
      masterContract: [{ required: true, message: '请选择' }],
      projectType: [{ required: true, message: '请选择' }],
      contractNeedTender: [{ required: true, message: '请选择' }],
      tenderDocumentId: [{ required: true, message: '请选择' }],
      biddingTypeName: [{ required: true, message: '请选择' }],
      modeContract: [{ required: true, message: '请选择' }],
      contractPeriod: [{ required: true, message: '请输入' }],
      makeSure: [{ required: true, message: '请选择' }],
      contractAmount: [{ required: true, message: '请输入' }],
      developmentOrganizationName: [{ required: true, message: '请选择' }],
      unitPartyName: [{ required: true, message: '请选择' }],
      unitPartyType: [{ required: true, message: '请选择' }],
      contractContent: [{ required: true, message: '请输入' }],
      paymentMethod: [{ required: true, message: '请选择' }],
      countersignLeader_dictText: [{ required: true, message: '请选择' }],
      applicationTime: [{ required: true, message: '请选择' }]
    }
  }),
  data: {
    navbarData:{
      title: "合同签订信息登记"
    },
    radioGroupOptions: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    radioGroupOptionsTwo: [
      { value: 0, label: '待定' },
      { value: 1, label: '已定' },
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
    contractList:[],
    biddingListOptions: [],
    countersignLeader: null,
    projectId: null,
    contractShow: false,
    tenderShow: false,
    contractId: null,
    unitParty: null,
    listIndex: null
  },
  dialogScreenProject: null,
  dialogSScreenExecuteUser: null,
  dialogScreenEcologicalUnit: null,
  dialogScreenConstructUnit: null,
  uploadImgRefList: null,
  dialogScreenConstructUnit2: null,
  pickerDateRef: null,

  onLoad(options) {
    this.getCodeList()
    if(options.id){
      this.setData({
        contractId: options.id
      })
      this.getDetail()
    }
  },
  onReady(){
    
  },
  onSavePickerDateRef(ref){
    this.pickerDateRef = ref
  },
  onSaveUploadContractImgRef: function (ref) {
    this.uploadImgRefList = ref;
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
  chooseProject(){
    if(this.dialogScreenProject) this.dialogScreenProject._showDialog()
  },
  chooseLeader(){
    if(this.dialogSScreenExecuteUser) this.dialogSScreenExecuteUser._showDialog()
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
  changeContractName(data){
    let projectName = this.form.getFieldValue('projectName')
    this.form.setFieldValue('title', projectName+data)
  },
  chooseThirdParty(value,e){
    console.log(value,e);
    this.setData({
      listIndex: e.currentTarget.dataset.index
    })
    if(this.dialogScreenConstructUnit2) this.dialogScreenConstructUnit2._showDialog()
  },
  chooseUnitTypeCallBack(data){
    console.log(data);
    let list = this.data.list
    list[this.data.listIndex].thirdPartyType = data
    list[this.data.listIndex].thirdPartyTypeName = this.data.unitTypeOption.find(e => e.id === data).type_dictText
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
  handleRef(ref) {
    this.form.addItem(ref);
  },
  bindChooseProjectCallBack(data){
    console.log(123)
    console.log(data)
    this.form.setFieldValue('projectName',data.name)
    this.setData({
      projectId: data.id,
    })
    setTimeout(() => {
      this.getQueryCurrentUnitType()
      this.getBiddingData()
      this.getContractList()
    },1000)
  },
  bindScreenEcologicalUnitCallBack(data){
    this.form.setFieldValue('unitPartyName', data.name);
    this.setData({
      unitParty: data.id
    })
  },
  bindScreenExecuteUserCallBack(data){
    this.form.setFieldValue('countersignLeader_dictText', data.map(e => e.username).toString());
    this.setData({
      countersignLeader: data.map(e => e.userId).toString()
    })
  },
  bindScreenConstructUnitCallBack2(data){
    console.log('第三',data);
    let list = this.data.list
    list[this.data.listIndex].thirdParty = data.id
    list[this.data.listIndex].thirdPartyName = data.unitName
    console.log(list);
    this.setData({
      list:list
    })
    console.log(this.form.getFieldsValue());
    
  },
  chooseUnitType(value,e){
    console.log(value,e);
    this.setData({
      listIndex: e.currentTarget.dataset.index
    })
  },
  bindScreenConstructUnitCallBack(data){
    this.form.setFieldValue('developmentOrganizationName', data.unitName);
    this.setData({
      developmentOrganization: data.id,
      ecUnitId: data.ecUnitId
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
    listList.push({ thirdPartyName: '', thirdParty: '', thirdPartyType: '', label1: '第' + this.numberToChinese(number) + '方:', label2: '第' + this.numberToChinese(number) + '方服务类型:' })
    this.setData({
      list: listList
    })
  },
  getBiddingData(){
    request.doPostRequest({
      url: projectService.API_TENDERDOCUMENT_LIST,
      data: {
        pageNum: 1,pageSize: 999,approvalStatus:4,
      },
      success: res => {
        res.data.records.forEach(e => {
          e.label = e.tenderName+'-'+e.createBy_dictText+'-'+e.tenderAmount+'万元'
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
        res.data.forEach(e => {
          e.label = e.type_dictText
          e.value = e.id
        })
        this.setData({
          unitTypeOption: res.data || []
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
    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const chineseUnits = ['', '十', '百', '千']
    if (num === 0) {
      return chineseNums[0]
    }
    let chineseStr = ''
    let unitIndex = 0
    while (num > 0) {
      const digit = num % 10
      if (digit !== 0) {
        // 处理非零数字
        chineseStr = chineseNums[digit] + chineseUnits[unitIndex] + chineseStr
      } else if (chineseStr.charAt(0) !== chineseNums[0]) {
        // 处理连续的零，只保留一个零
        chineseStr = chineseNums[0] + chineseStr
      }
      num = Math.floor(num / 10)
      unitIndex++
    }
    return chineseStr
  },
  deleteThis(e){
    const { index } = e.currentTarget.dataset;
    const list = [...this.data.list];
    list.splice(index, 1);
    list.forEach((e,index) => {
      e.thirdPartyType = e.thirdPartyType.toString()
      e.label1 = '第' + this.numberToChinese(index + 3) + '方:'
      e.label2 = '第' + this.numberToChinese(index + 3) + '方服务类型:'
    })
    this.setData({
      list: JSON.parse(JSON.stringify(list))
    });
  },
  reset(){
    this.form.reset();
    ddUtils.navigateBack();
  },
  staging(){
    this.form.rules = {}
    let params = this.form.getFieldsValue()
    params.vueUrl = 'ApproveContractApprovalDetail,ApproveContractApprovalCreatAndEdit'

    if(this.data.contractId){
      params.id = this.data.contractId
      params.urlParameter = JSON.stringify({id: this.data.contractId})
    }else{
      params.urlParameter = JSON.stringify({})
    }
    console.log('this.data.list',this.data.list);
    params.contractThirdPartyRepList = this.data.list
    params.projectId = this.data.projectId
    params.unitParty = this.data.unitParty
    params.countersignLeader = this.data.countersignLeader
    params.developmentOrganization = this.data.developmentOrganization
    params.ecUnitId = this.data.ecUnitId
    if(params.unitPartyType){
      params.unitPartyTypeName = this.data.unitTypeOption.find(e => e.id === params.unitPartyType).type_dictText
    }
    
    let workAuditFile = [];
    if (this.uploadImgRefList) {
      workAuditFile = this.uploadImgRefList._getUploadImgId().imgList;
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
    const params = await this.form.submit();
    if(this.data.contractId){
      params.id = this.data.contractId
      params.urlParameter = JSON.stringify({id: this.data.contractId})
    }else{
      params.urlParameter = JSON.stringify({})
    }
    if (this.data.list && this.data.list.length) {
      this.data.list.map(e => {
        if (e.thirdPartyName === '' || e.thirdPartyType === '') {
          ddUtils.showToast({title: '第三方和第三方服务类型必填！'})
          throw Error()
        }
      })
    }
    params.contractThirdPartyRepList = this.data.list
    params.projectId = this.data.projectId
    params.countersignLeader = this.data.countersignLeader
    params.vueUrl = 'ApproveContractApprovalDetail,ApproveContractApprovalCreatAndEdit'

    params.unitParty = this.data.unitParty
    params.countersignLeader = this.data.countersignLeader
    params.developmentOrganization = this.data.developmentOrganization
    params.ecUnitId = this.data.ecUnitId
    params.unitPartyTypeName = this.data.unitTypeOption.find(e => e.id === params.unitPartyType).type_dictText
    let workAuditFile = [];
    if (this.uploadImgRefList) {
      workAuditFile = this.uploadImgRefList._getUploadImgId().imgList;
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
        if(paramsdata.projectType){
          paramsdata.projectType = paramsdata.projectType.toString()
        }
        if(paramsdata.paymentMethod){
          paramsdata.paymentMethod = paramsdata.paymentMethod.toString()
        }

        setTimeout(() => {
          this.getQueryCurrentUnitType()
          this.getBiddingData()
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
        let list = paramsdata.contractThirdPartyRepList
        if(list && list.length){
          list.forEach((e, index)=> {
            e.thirdPartyType = e.thirdPartyType.toString()
            e.label1 = '第' + this.numberToChinese(index + 3) + '方:'
            e.label2 = '第' + this.numberToChinese(index + 3) + '方服务类型:'
          });
        }
        
        this.setData({
          unitParty: paramsdata.unitParty,
          countersignLeader: paramsdata.countersignLeader,
          projectId: paramsdata.projectId,
          developmentOrganization: paramsdata.developmentOrganization,
          ecUnitId: paramsdata.ecUnitId,
          unitPartyTypeName: paramsdata.projeunitPartyTypeNamectId,
          contractShow: paramsdata.supplementAgreement===1?true:false,
          tenderShow: paramsdata.contractNeedTender===1?true:false,
          list
        })

        setTimeout(() => {
          this.uploadImgRefList._setImageList(paramsdata.fileList?paramsdata.fileList:[]) 
        }, 0);

        
      }
    })
  }
});
