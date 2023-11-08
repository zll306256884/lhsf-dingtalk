import { Form } from 'antd-mini/es/Form/form';
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import { formatTimeToDay } from "../../../../utils/utils";
import projectService from "../../../../server/workServer/projectServer";

Page({
  form: new Form({
    initialValues: {
      applicationTime: formatTimeToDay(new Date())+ ' 00:00:00'
    },
    rules: {
      tenderName: [{ required: true, message: '请输入' }],
      projectId: [{ required: true, message: '请选择' }],
      biddingPerson: [{ required: true, message: '请输入' }],
      tenderingAgencyName: [{required: true, message: '请选择'}],
      biddingType: [{ required: true, message: '请选择' }],
      projectType: [{ required: true, message: '请选择' }],
      tenderAmount: [{ required: true, message: '请输入' }],
      decisionBasis: [{ required: true, message: '请选择' }],
      biddingContent: [{ required: true, message: '请输入' }],
      countersignLeader_dictText: [{ required: true, message: '请选择' }],
      tenderDocumentList: [{required: true,message: '请上传'}],
      applicationTime: [{ required: true, message: '请选择' }]
    },
  }),
  data: {
    navbarData:{
      title: "新增招标文件"
    },
    biddingTypeOptions: [],
    projectTypeOptions: [],
    decisionBasisOptions: [],
    projectListOptions: [],
    ecologicalListOptions: [],
    tenderingAgency: '',
    countersignLeader: '',
    tenderDocumentList: [],
    otherDocumentList: []
  },
  dialogSScreenExecuteUser: null,
  dialogSScreen: null,
  uploadTenderImageList: null,
  uploadOtherImgList: null,
  pickerDateRef: null,

  onLoad(options) {
    console.log(options)
    if(options.id){
      this.setData({
        tenderId: options.id
      })
      this.getDetail(options.id)
    }
    this.getCodeList()
    this.getProjectList()
  },
  handleRef(ref) {
    console.log(ref)
    this.form.addItem(ref);
  },
  onSavePickerDateRef(ref){
    this.pickerDateRef = ref
  },
  onSaveDialogScreenExecuteUserRef(ref){
    this.dialogSScreenExecuteUser = ref
  },
  onSaveDialogScreenQuesFromRef(ref){
    this.dialogSScreen = ref
  },
  onSaveUploadTenderImgRef(ref){
    this.uploadTenderImageList = ref
  },
  onSaveUploaOtherImgRef(ref){
    this.uploadOtherImgList = ref
  },
  chooseTime(){
    if(this.pickerDateRef) this.pickerDateRef._showDialog()
  },
  chooseLeader(){
    if(this.dialogSScreenExecuteUser) this.dialogSScreenExecuteUser._showDialog()
  },
  chooseTenderingAgency(){
    if(this.dialogSScreen) this.dialogSScreen._showDialog()
  },
  bindScreenExecuteUserCallBack(data){
    console.log(data)
    this.form.setFieldValue('countersignLeader_dictText', data.map(e => e.username).toString());
    // this.form.setFieldValue('countersignLeader', data.map(e => e.userId).toString());
    this.setData({
      countersignLeader: data.map(e => e.userId).toString()
    })
  },
  bindScreenQuesFromCallBack(data){
    console.log("单位", data)
    this.form.setFieldValue('tenderingAgencyName', data.name);
    this.setData({
      tenderingAgency: data.id
    })
    // this.form.setFieldValue('tenderingAgency', data.id);
  },
  bindPickerDateCannBack(data){
    this.form.setFieldValue('applicationTime', data.startDate);
  },
  changeTenderName(data){
    console.log(data);
    let id = this.form.getFieldValue('projectId')
    console.log(id);
    let projectName = this.data.projectListOptions.find(e => e.id === id).name
    console.log(projectName);
    this.form.setFieldValue('title', projectName+data)
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
  getDetail(){
    request.doPostRequest({
      url: projectService.API_TENDER_DETAIL,
      data: {id: this.data.tenderId},
      success: res => {
        console.log(res.data)
        const paramsdata = res.data
        paramsdata.biddingType = paramsdata.biddingType.toString()
        paramsdata.projectType = paramsdata.projectType.toString()
        paramsdata.decisionBasis = paramsdata.decisionBasis.toString()
        const fields = this.form.getFieldsValue()
        for (let item in fields) {
          if ({}.hasOwnProperty.call(fields, item)) {
            fields[item] = paramsdata[item]?paramsdata[item]: ''
          }
        }
        console.log(fields)
        this.form.setFieldsValue({
          ...fields,
        })
        this.setData({
          tenderingAgency: paramsdata.tenderingAgency,
          countersignLeader: paramsdata.countersignLeader
        })
        setTimeout(() => {
          this.uploadTenderImageList._setImageList(res.data.tenderDocumentList?res.data.tenderDocumentList:'') 
          this.uploadOtherImgList._setImageList(res.data.otherDocumentList?res.data.otherDocumentList:'') 
        }, 0);
      }
    })
  },
  //暂存
  staging(){
    this.form.rules = {}
    let params = this.form.getFieldsValue()
    console.log(params)
    if(this.data.tenderId){
      params.id = this.data.tenderId
      params.urlParameter = JSON.stringify({id: this.data.tenderId})
    }else{
      params.urlParameter = JSON.stringify({})
    }
    if (this.uploadTenderImageList) {
      let list = this.uploadTenderImageList._getUploadImgId().imgList
      list.forEach(e => {
        e.fileName = e.name
        e.type= 1
      })
      this.setData({
        tenderDocumentList: list
      }) 
    }
    if (this.uploadOtherImgList) {
      let list = this.uploadOtherImgList._getUploadImgId().imgList
      list.forEach(e => {
        e.fileName = e.name
        e.type= 2
      })
      this.setData({
        otherDocumentList: list
      })
    }
    params.fileList = [...this.data.tenderDocumentList, ...this.data.otherDocumentList]

    params.vueUrl = 'ApproveBidDocumentDetail,ApproveBidDocumentCreatAndEdit'
    params.projectName = this.data.projectListOptions.find(e => e.id === params.projectId).name
    
    params.tenderingAgency = this.data.tenderingAgency
    params.countersignLeader = this.data.countersignLeader
    request.doPostRequest({
      url: projectService.API_TENDERDOCUMENT_TEMPORARYSTORAGE,
      data: params,
      success: res => {
        console.log(res.data)
        ddUtils.showToast({
          title: "暂存成功！"
        });
        ddUtils.navigateBack();
      }
    })
  },

  async submit() {
    console.log(this.form)
    // this.form.addItem(ref)
    const params = await this.form.submit();
    if(this.data.tenderId){
      params.id = this.data.tenderId
      params.urlParameter = JSON.stringify({id: this.data.tenderId})
    }else{
      params.urlParameter = JSON.stringify({})
    }
    params.vueUrl = 'ApproveBidDocumentDetail,ApproveBidDocumentCreatAndEdit'
    params.projectName = this.data.projectListOptions.find(e => e.id === params.projectId).name
    // params.urlParameter = JSON.stringify({}),
    params.tenderingAgency = this.data.tenderingAgency
    params.countersignLeader = this.data.countersignLeader
    // params.applicationTime = "2023-11-01 00:00:00"
    // params.fileList = []
    console.log(params);
    if (this.uploadTenderImageList) {
      let list = this.uploadTenderImageList._getUploadImgId().imgList
      list.forEach(e => {
        e.fileName = e.name
        e.type= 1
      })
      this.setData({
        tenderDocumentList: list
      }) 
    }
    if(ddUtils.showEmptyArrayTips(this.data.tenderDocumentList,"请上传招标文件会签附件！")) return
    if (this.uploadOtherImgList) {
      let list = this.uploadOtherImgList._getUploadImgId().imgList
      list.forEach(e => {
        e.fileName = e.name
        e.type= 2
      })
      this.setData({
        otherDocumentList: list
      })
    }
    params.fileList = [...this.data.tenderDocumentList, ...this.data.otherDocumentList]
    console.log(params)
    
    request.doPostRequest({
      url: projectService.API_SAVEANDSUBMIT,
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
  getCodeList(){
    //招标方式
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'bidding_type',
      success: res => {
        res.data.forEach(e => {
          e.label = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          biddingTypeOptions: res.data || []
        })
      }
    })
    //项目类别
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
    //决策依据
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'decision_basis',
      success: res => {
        res.data.forEach(e => {
          e.label = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          decisionBasisOptions: res.data || []
        })
      }
    })
  }
});
