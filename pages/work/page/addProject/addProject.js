import { Form } from 'antd-mini/es/Form/form';
import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";

const app = getApp();
Page({
  form: new Form({
    initialValues: {
      
    },
    rules: {
      structureArea: [{ required: true, message: '请输入(最多15位整数2位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,2})?$/ }],
      floorArea: [{ required: true, message: '请输入(最多15位整数2位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,2})?$/ }],
      totalInvestment: [{ required: true, message: '请输入(最多15位整数6位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,6})?$/ }],
      blockNumber: [{required: false, max: 5, message: '请输入(最多5位的整数)',pattern: /^[1-9]\d{0,4}$/}],
      jianAnMoney: [{ required: false, message: '请输入(最多15位整数6位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,6})?$/ }],
      coorX: [{ required: false, message: '请输入(最多10位整数3位小数)',pattern: /^(0|\+?[1-9][0-9]{0,9})(\.\d{1,3})?$/ }],
      coorY: [{ required: false, message: '请输入(最多10位整数3位小数)',pattern: /^(0|\+?[1-9][0-9]{0,9})(\.\d{1,3})?$/ }]
    },
  }),
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
    outPutTime: '',//{date: '', shortDate: ''}
    projectEndTime: '',
    constructionNature: {},//建设性质
    engineeringProperties: {},//工程性质
    //所属单位
    //项目负责人
    projectRedLineList: [],//项目红线图
    projectClassificationOptions: [],
    constructionPhaseOptions: [],
    engineeringPropertiesOptions: [],
    constructionNatureOptions: [],
    projectId: null,
    planConstructionDate: '',
    actualConstruction: '',
    blockNumber123: ''
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
  dialogSuoshuUnit: null,
  dialogScreenExecuteUser: null,
  uploadImgRefList: null,

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
  handleRef(ref) {
    console.log(ref)
    this.form.addItem(ref);
  },
  events: {
    onBack() {
        console.log('onBack')
    },
  },
  onSavePickerEndDateRef(ref){
    this.pickEndDate = ref
  },
  onSaveUploadImgRef: function (ref) {
    this.uploadImgRefList = ref;
    console.log(this.uploadImgRefList)
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
  _onSaveDialogScreenSuoshuUnitRef(ref){
    this.dialogSuoshuUnit = ref
  },
  onSaveDialogScreenExecuteUserRef(ref){
    this.dialogScreenExecuteUser = ref
  },
  _bindChooseProjectEndTime(){
    if(this.pickEndDate) this.pickEndDate._showDialog();
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
  _bindChooseAffiliatedUnit(){
    if(this.dialogSuoshuUnit) this.dialogSuoshuUnit._showDialog()
  },
  _bindChooseProjectLeaderName(){
    if(this.dialogScreenExecuteUser) this.dialogScreenExecuteUser._showDialog()
  },
  bindInputChange(e){
    // console.log('qweqw', e)

    // if(e.detail.value.length > 6){
    //   console.log(1232321, e.detail.value.slice(0,6))
    //   this.setData({
    //     'formData.blockNumber': ''
    //   })
      
    //   console.log(this.data.formData.blockNumber)
    //   // this.setData({
    //   //   'formData.blockNumber': JSON.parse(JSON.stringify(e.value.slice(0,6)))
    //   // })
    // }
  },
  onValuesChange(e){
    console.log(e)
  },
  bindPickerEndDateCallBack(data){
    this.setData({
      projectEndTime: data.startDate
    })
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
      'formData.planConstructionEndTime': data.endDate,
      planConstructionDate:data.startDate+'至'+data.endDate
    })
    let totalDate = new Date(data.endDate.toString().replace(/(-)/g, '/')).getTime() - new Date(data.startDate.toString().replace(/(-)/g, '/')).getTime();
    let totalDateNum = (totalDate / (1 * 24 * 60 * 60 * 1000)) + 1
    this.setData({
      'formData.duration': totalDateNum
    })
  },
  bindIsOutPutRef(item){
    this.setData({
      isOutPut:item
    })
  },
  bindPickerDateCannBack(data){
    console.log(data)
    this.setData({
      outPutTime: data.startDate
    })
  },
  bindPickerActualDateRangeCallBack(data){
    console.log(data)
    this.setData({
      'formData.actualConstructionStartTime': data.startDate,
      'formData.actualConstructionEndTime': data.endDate,
      actualConstruction: data.startDate+'至'+data.endDate
    })
  },
  _bindScreenSuoshuUnitCallBack(data){
    console.log('所属单位', data)
    this.setData({
      'formData.affiliatedUnitName':data.name,
      'formData.affiliatedUnitId':data.id
    })
  },
  bindScreenExecuteUserCallBack(data){
    console.log('项目负责人',data)
    this.setData({
      'formData.projectLeaderName': data[0].username,
      'formData.personId': data[0].userId
    })
  },
  //详情
  getDetail(id){
    const fields = this.form.getFieldsValue()
    console.log(fields);
    this.form.setFieldValue('', )

    request.doPostRequest({
      url: projectService.API_SELECTPROJECT_INFO_BYID,
      data:{id:id},
      success: res => {
        if(res.data.isAccess === 0 || res.data.isAccess === 1){
          this.setData({
            isAccess:{name:this.data.screenFromList.find(e=>e.value === res.data.isAccess).name,value:res.data.isAccess}
          })
        }
        if(res.data.isOutPut){
          this.setData({
            isOutPut:{name:this.data.isOutPutOption.find(e=>e.value === res.data.isOutPut).name,value:res.data.isOutPut}
          })
        }
        this.setData({
          formData: res.data,
          projectClassification:{name:res.data.projectClassification_dictText,value:res.data.projectClassification},
          constructionPhase:{name:res.data.constructionPhase_dictText,value:res.data.constructionPhase},
          outPutTime:res.data.outPutTime,
          constructionNature:{name:res.data.constructionNature_dictText,value:res.data.constructionNature},
          engineeringProperties:{name:res.data.engineeringProperties_dictText,value:res.data.engineeringProperties},
          planConstructionDate:res.data.planConstructionStartTime+'至'+res.data.planConstructionEndTime,
          actualConstruction: res.data.actualConstructionStartTime+'至'+res.data.actualConstructionEndTime
        })
        const paramsdata = res.data
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
        setTimeout(() => {
          this.uploadImgRefList._setImageList(res.data.projectRedLineList?res.data.projectRedLineList:'') 
        }, 0);
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
          constructionPhaseOptions: res.data || [],
          constructionPhase: {name: '前期阶段', value:'0'}
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
  async bindFormSubmit(e){
    const params = await this.form.submit();

    if (ddUtils.showEmptyToastTips(e.detail.value.name, "项目名称不能为空")) return;
    if (ddUtils.showEmptyToastTips(this.data.projectClassification.value, "项目分类不能为空")) return;
    if (ddUtils.showEmptyToastTips(this.data.constructionPhase.value, "建设阶段不能为空")) return;
    if(this.data.constructionPhase.value === '3'){
      if (ddUtils.showEmptyToastTips(this.data.isOutPut.value, "是否投入使用不能为空")) return;
    }
    if(this.data.isOutPut.value === '1'){
      if (ddUtils.showEmptyToastTips(this.data.outPutTime, "投入使用日期不能为空")) return;
    }
    if (ddUtils.showEmptyToastTips(this.data.formData.affiliatedUnitName, "所属单位不能为空")) return;
    if (ddUtils.showEmptyToastTips(this.data.constructionNature.value, "建设性质不能为空")) return;
    if (ddUtils.showEmptyToastTips(this.data.formData.projectLeaderName, "项目负责人不能为空")) return;
    if (ddUtils.showEmptyToastTips(e.detail.value.constructionContent, "建设规模及内容不能为空")) return;

    // if (ddUtils.showEmptyToastTips(e.detail.value.structureArea, "建筑面积不能为空")) return;
    // if (ddUtils.showEmptyToastTips(e.detail.value.floorArea, "占地面积不能为空")) return;
    // if (ddUtils.showEmptyToastTips(this.data.formData.totalInvestment, "总投资金额不能为空")) return;

    let workAuditFile = [];
    if (this.uploadImgRefList) {
      workAuditFile = this.uploadImgRefList._getUploadImgId().imgList;
    }
    console.log(workAuditFile)
    // console.log('projectRedLineList',this.data.projectRedLineList)
    this.setData({
      'formData.projectCode':e.detail.value.projectCode,
      'formData.name':e.detail.value.name,
      'formData.projectProgram':e.detail.value.projectProgram,

      // 'formData.structureArea':e.detail.value.structureArea,
      // 'formData.floorArea':e.detail.value.floorArea,
      'formData.structureArea': params.structureArea,
      'formData.floorArea': params.floorArea,
      
      'formData.proposedLocation':e.detail.value.proposedLocation,
      'formData.proposedLand':e.detail.value.proposedLand,
      // 'formData.blockNumber':e.detail.value.blockNumber,
      'formData.blockNumber':params.blockNumber,

      // 'formData.coorX':e.detail.value.coorX,
      // 'formData.coorY':e.detail.value.coorY,
      'formData.coorX':params.coorX,
      'formData.coorY':params.coorY,

      'formData.constructionContent':e.detail.value.constructionContent,

      // 'formData.totalInvestment':e.detail.value.totalInvestment,
      'formData.totalInvestment':params.totalInvestment,

      // 'formData.jianAnMoney':e.detail.value.jianAnMoney,
      'formData.jianAnMoney':params.jianAnMoney,

      'formData.sourceFunds':e.detail.value.sourceFunds,
      'formData.projectRedLineList': workAuditFile
    })
    
    let data = this.data.formData

    data.isAccess = this.data.isAccess.value
    data.projectClassification = this.data.projectClassification.value
    data.isOutPut = this.data.isOutPut.value
    data.constructionNature = this.data.constructionNature.value
    data.engineeringProperties = this.data.engineeringProperties.value

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
  },
  bindCancelTap(){
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
  }
});
