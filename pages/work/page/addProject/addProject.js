import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";
const app = getApp();
Page({
  data: {
    navbarData:{
      title: "新增项目"
    },
    screenFromList:[
      { name:'否',value:0 },
      { name:'是',value:1 }
    ],
    isOutPutOption: [
      { name:'否',value:'0' },
      { name:'是',value:'1' },
    ],
    formData: {
      projectCode: '',//项目码
      name: '',//名称
      proNumber: '',//项目编号
      projectProgram: '',//简介
      constructionContent:'',
      

      structureArea:'',//建筑面积
      floorArea: '',//占地面积
      proposedLocation:'',//拟建位置
      proposedLand: '',//拟用土地
      blockNumber:'',//座数

      planConstructionStartTime: '',
      planConstructionEndTime: '',
      duration:'',
      actualConstructionStartTime: '',
      actualConstructionEndTime: '',

      totalInvestment:'',//总投资金额
      jianAnMoney:'',//建安费用
      sourceFunds:'',//资金来源
    },
    isAccess: {},//考核
    projectClassification: {},//分类
    constructionPhase: {},//建设阶段
    isOutPut: {},//是否投入
    outPutTime: {},//{date: '', shortDate: ''}
    constructionNature: {},//建设性质
    engineeringProperties: {},//工程性质
    //所属单位
    //项目负责人
    //项目红线图
    projectClassificationOptions: [],
    constructionPhaseOptions: [],
    engineeringPropertiesOptions: [],
    constructionNatureOptions: [],
    projectId: null
  },

  dialogQuesFromRef: null,
  dialogProjectClassification: null,
  dialogConstructionPhase: null,
  dialogEngineeringProperties: null,
  dialogConstructionNature: null,
  dialogIsOutPutRef: null,
  dialogPickerDateRef: null,
  dialogPickerDateRangeRef: null,
  dialogActualDatRangeRef: null,

  onLoad(options) {
    console.log(options)
    this.getCodeList()
    if(options.id){
      this.setData({
        projectId: options.id
      })
      this.getDetail(options.id)
    }else{
      this.getProNumber()
    }
    
    
  },
  events: {
    onBack() {
        console.log('onBack')
    },
  },
  onSaveDialogScreenQuesFromRef(ref) {
    this.dialogQuesFromRef = ref;
  },
  onSaveDialogProjectClassificationFromRef(ref){
    this.dialogProjectClassification = ref
  },
  onSaveDialogEngineeringProperties(ref){
    this.dialogEngineeringProperties = ref
  },
  onSaveDialogConstructionNature(ref){
    this.dialogConstructionNature = ref
  },
  onSaveDialogScreenConstructionPhase(ref){
    this.dialogConstructionPhase = ref
  },
  onSaveDialogScreenIsOutPutRef(ref){
    this.dialogIsOutPutRef = ref
  },
  //
  onSavePickerDateRef(ref){
    this.dialogPickerDateRef = ref;
  },
  onSavePickerDatRangeRef(ref){
    this.dialogPickerDateRangeRef = ref;
  },
  onSavePickerActualDatRangeRef(ref){
    this.dialogActualDatRangeRef = ref
  },
  _bindChooseIsAccessTap(e){
    // if (this.props.chooseQuesTypeDisabled) return;
    if (this.dialogQuesFromRef) this.dialogQuesFromRef._showDialog();
  },
  _bindChooseProjectClassification(e){
    if(this.dialogProjectClassification) this.dialogProjectClassification._showDialog();
  },
  _bindChooSeconstructionPhaseTap(){
    if (this.dialogConstructionPhase) this.dialogConstructionPhase._showDialog();
  },
  _bindChooseIsOutPut(){
    if (this.dialogIsOutPutRef) this.dialogIsOutPutRef._showDialog();
  },
  _bindChooseConstructionNature(){
    if(this.dialogConstructionNature) this.dialogConstructionNature._showDialog();
  },
  _bindChooseEngineeringProperties(){
    if(this.dialogEngineeringProperties) this.dialogEngineeringProperties._showDialog();
  },
  _bindChooseDate(){
    if(this.dialogPickerDateRef) this.dialogPickerDateRef._showDialog();
  },
  _bindChooseOutPutTime(){
    if(this.dialogPickerDateRef) this.dialogPickerDateRef._showDialog();
  },
  _bindChooseIsAccessChange(e){
    if(this.dialogPickerDateRef) this.dialogPickerDateRef._showDialog();
  },
  _bindChoosePlanConstructionDate(){
    if(this.dialogPickerDateRangeRef) this.dialogPickerDateRangeRef._showDialog()
  },
  _bindChooseActualConstruction(){
    if(this.dialogActualDatRangeRef) this.dialogActualDatRangeRef._showDialog()
  },
  bindInputChange(e){

  },

  bindScreenFromCallBack(item){
    this.setData({
      isAccess: item
    })
  },
  bindProjectClassificationCallBack(item){
    this.setData({
      projectClassification:item
    })
  },
  bindScreenEngineeringPropertiesFromCallBack(item){
    this.setData({
      engineeringProperties:item
    })
  },
  bindScreenConstructionNatureFromCallBack(item){
    this.setData({
      constructionNature:item
    })
  },
  bindScreenConstructionPhase(item){
    this.setData({
      constructionPhase:item
    })
  },
  bindPickerDateRangeCallBack(data){
    console.log(data)
    this.setData({
      'formData.planConstructionStartTime': data.startDate,
      'formData.planConstructionEndTime': data.endDate
    })
    this.setData({
      // duration: data.endDate - data.startDate
    })
  },
  bindIsOutPutRef(item){
    this.setData({
      isOutPut:item
    })
  },
  bindPickerDateCannBack(data){
    this.setData({
      outPutTime: data
    })
  },
  bindPickerActualDateRangeCallBack(data){
    console.log(data)
    this.setData({
      'formData.actualConstructionStartTime': data.startDate,
      'formData.actualConstructionEndTime': data.endDate
    })
  },
  //详情
  getDetail(id){
    request.doPostRequest({
      url: projectService.API_SELECTPROJECT_INFO_BYID,
      data:{id:id},
      success: res => {
        this.setData({
          formData: res.data,
          isAccess:{name:this.data.screenFromList.find(e=>e.value === res.data.isAccess).name,value:res.data.isAccess},
          projectClassification:{name:res.data.projectClassification_dictText,value:res.data.projectClassification},
          constructionPhase:{name:res.data.constructionPhase_dictText,value:res.data.constructionPhase},
          isOutPut:{name:this.data.isOutPutOption.find(e=>e.value === res.data.isOutPut).name,value:res.data.isOutPut},
          'outPutTime.shortDate':res.data.outPutTime,

          constructionNature:{name:res.data.constructionNature_dictText,value:res.data.constructionNature},
          engineeringProperties:{name:res.data.engineeringProperties_dictText,value:res.data.engineeringProperties},

        
        })
        console.log(this.data.isAccess)
      }
    })
  },
  //编码
  getProNumber() {
    request.doPostRequest({
      url: projectService.API_GENERATEPRONUMBER,
      success: res => {
        this.setData({
          'formData.proNumber': res.data
        })
      }
    })
  },
  getCodeList(){
    //项目分类
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'project_classification',
      data: { dictCode: 'project_classification'},
      success: res => {
        res.data.forEach(e => {
          e.name = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          projectClassificationOptions: res.data || []
        })
      }
    })
    //建设阶段
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'construction_phase',
      data: { dictCode: 'construction_phase'},
      success: res => {
        res.data.forEach(e => {
          e.name = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          constructionPhaseOptions: res.data || []
        })
      }
    })
    //工程性质
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'engineering_properties',
      data: { dictCode: 'engineering_properties'},
      success: res => {
        res.data.forEach(e => {
          e.name = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          engineeringPropertiesOptions: res.data || []
        })
      }
    })
    //建设性质
    request.doPostRequest({
      url: config.API_SCREEN_STATUS_BY_CODE + 'construction_nature',
      data: { dictCode: 'construction_nature'},
      success: res => {
        res.data.forEach(e => {
          e.name = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          constructionNatureOptions: res.data || []
        })
      }
    })
  },
  bindFormSubmit(e){
    // if (ddUtils.showEmptyToastTips(e.detail.value.name, "项目名称不能为空")) return;
    // if (ddUtils.showEmptyToastTips(this.data.projectClassification.value, "项目分类不能为空")) return;
    // if (ddUtils.showEmptyToastTips(this.data.constructionPhase.value, "建设阶段不能为空")) return;
    // if (ddUtils.showEmptyToastTips(this.data.isOutPut.value, "是否投入使用不能为空")) return;
    // if (ddUtils.showEmptyToastTips(this.data.outPutTime.shortDate, "投入使用日期不能为空")) return;
    // // if (ddUtils.showEmptyToastTips(, "所属单位不能为空")) return;
    // if (ddUtils.showEmptyToastTips(this.data.constructionNature.value, "建设性质不能为空")) return;
    // // if (ddUtils.showEmptyToastTips(, "项目负责人不能为空")) return;
    // if (ddUtils.showEmptyToastTips(e.detail.value.constructionContent, "建设规模及内容不能为空")) return;
    // if (ddUtils.showEmptyToastTips(e.detail.value.structureArea, "建筑面积不能为空")) return;
    // if (ddUtils.showEmptyToastTips(e.detail.value.floorArea, "占地面积不能为空")) return;

    this.setData({
      'formData.projectCode':e.detail.value.projectCode,
      'formData.name':e.detail.value.name,
      'formData.projectProgram':e.detail.value.projectProgram,

      'formData.structureArea':e.detail.value.structureArea,
      'formData.floorArea':e.detail.value.floorArea,
      'formData.proposedLocation':e.detail.value.proposedLocation,
      'formData.proposedLand':e.detail.value.proposedLand,
      'formData.blockNumber':e.detail.value.blockNumber,

      'formData.coorX':e.detail.value.coorX,
      'formData.coorY':e.detail.value.coorY,

      'formData.constructionContent':e.detail.value.constructionContent,

      'formData.totalInvestment':e.detail.value.totalInvestment,
      'formData.jianAnMoney':e.detail.value.jianAnMoney,
      'formData.sourceFunds':e.detail.value.sourceFunds,
    })
    // this.data.formData.projectCode = e.detail.value.projectCode
    // this.data.formData.proNumber = this.data.proNumber
    // this.data.formData.name = e.detail.value.name
    // this.data.formData.projectProgram = e.detail.value.projectProgram


    // let structureArea = e.detail.value.structureArea
    // let floorArea = e.detail.value.floorArea
    // let proposedLocation = e.detail.value.proposedLocation
    // let proposedLand = e.detail.value.proposedLand
    // let blockNumber = e.detail.value.blockNumber
    // let coorX = e.detail.value.coorX
    // let coorY = e.detail.value.coorY
    // let constructionContent = e.detail.value.constructionContent
    // let totalInvestment = e.detail.value.totalInvestment
    // let jianAnMoney = e.detail.value.jianAnMoney
    // let sourceFunds = e.detail.value.sourceFunds

    // let data = {
    //   projectCode,
    //   proNumber,
    //   name,
    //   projectProgram,
    //   isAccess: this.data.isAccess.value,
    //   projectClassification: this.data.projectClassification.value,
    //   constructionPhase: this.data.constructionPhase.value,
    //   isOutPut: this.data.isOutPut.value,
    //   outPutTime: this.data.outPutTime.shortDate,
      
    //   constructionNature: this.data.constructionNature.value,
    //   engineeringProperties: this.data.engineeringProperties.value,
    //   constructionContent,
    //   structureArea,
    //   floorArea,
    //   proposedLocation,
    //   proposedLand,
    //   blockNumber,

    //   planConstructionStartTime:this.data.planConstructionStartTime,
    //   planConstructionEndTime: this.data.planConstructionEndTime,
    //   duration: this.data.duration,
    //   actualConstructionStartTime: this.data.actualConstructionStartTime,
    //   actualConstructionEndTime: this.data.actualConstructionEndTime,

    //   coorX,
    //   coorY,
    //   totalInvestment,
    //   jianAnMoney,
    //   sourceFunds
    // }
    let data = this.data.formData
    console.log(data)
    if(this.data.projectId){
      request.doPostRequest({
        url: projectService.API_EDIT_PROJECT,
        data,
        success: res => {
          ddUtils.showToast({
            title: "编辑成功！"
          });
          ddUtils.navigateBack();
        },
      })
    }else{
      request.doPostRequest({
        url: projectService.API_PROJECTINFON_SAVE,
        data,
        success: res => {
          ddUtils.showToast({
            title: "新增成功！"
          });
          ddUtils.navigateBack();
        },
      })
    }
  }
});
