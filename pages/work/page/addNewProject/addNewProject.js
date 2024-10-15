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
      constructionPhase: "0"
    },
    rules: {},
  }),
  data: {
    navbarData:{
      title: "新增项目"
    },
    screenFromList:[
      { label:'否',value:0 },
      { label:'是',value:1 }
    ],
    isOutPutOption: [
      { label:'否',value:'0' },
      { label:'是',value:'1' },
    ],
    proTypeList: [
      { label:'工程项目',value:0 },
      { label:'非工程项目',value:1 }
    ],
    proType:'',
    affiliatedUnitName: '',//所属单位
    projectLeaderName: '',//项目负责人
    carryLeaderName:"",
    operateLeaderName:"",
    personId: '',
    carryPersonId:"",
    operatePersonId:"",
    sourceListName:'',
    projectSourceConfigTreeDtoList:[],
    projectRedLineList: [],//项目红线图
    projectClassificationOptions: [],
    constructionPhaseOptions: [],
    engineeringPropertiesOptions: [],
    constructionNatureOptions: [],
    affiliatedUnitOption: [],
    projectId: null,

    planConstructionDate: '',
    actualConstruction: '',
    actualConstructionStartTime: '',
    actualConstructionEndTime: '',
    duration:'',
    planConstructionStartTime: '',
    planConstructionEndTime: '',
    loading: false
  },
  dialogPickerDateRef: null,
  dialogPickerDateRangeRef: null,
  dialogActualDatRangeRef: null,
  dialogSuoshuUnit: null,
  dialogScreenExecuteUser: null,
  dialogSourceListName:null,
  uploadImageList: null,
  userType:0,
  tipVisible:false,
  onLoad(options) {
    console.log(options)
    this.form.rules = {
      sourceListName:[{required: true, message: '请选择'}],
      projectLeaderName:[{required: true, message: '请选择'}],
      name: [{required: true, message: '请输入'}],
      constructionNature: [{required: true, message: '请选择'}],
      constructionContent: [{required: true, message: '请输入'}],
      structureArea: [{ required: true, message: '请输入(最多15位整数2位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,2})?$/ }],
      floorArea: [{ required: true, message: '请输入(最多15位整数2位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,2})?$/ }],
      totalInvestment: [{ required: true, message: '请输入(最多15位整数6位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,6})?$/ }],
      blockNumber: [{required: false, max: 6, message: '请输入(最多6位的整数)',pattern: /^[1-9]\d{0,5}$/}],
      jianAnMoney: [{ required: false, message: '请输入(最多15位整数6位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,6})?$/ }],
      coorX: [{ required: false, message: '请输入(最多10位整数3位小数)',pattern: /^(0|\+?[1-9][0-9]{0,9})(\.\d{1,3})?$/ }],
      coorY: [{ required: false, message: '请输入(最多10位整数3位小数)',pattern: /^(0|\+?[1-9][0-9]{0,9})(\.\d{1,3})?$/ }],
      projectClassification: [{required: true, message: '请选择'}],
      constructionPhase: [{required: true, message: '请选择'}],
      isOutPut: [{required: true, message: '请选择'}],
      outPutTime: [{required: true, message: '请选择'}],
      affiliatedUnitId: [{required: true, message: '请选择'}],
      proType: [{required: true, message: '请选择'}]
    }
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
    this.form.addItem(ref);
  },
  events: {
    onBack() {
    },
  },
  onSavePickerEndDateRef(ref){
    this.pickEndDate = ref
  },
  onSaveUploadImgRef: function (ref) {
    this.uploadImageList = ref;
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
  onSaveDialogScreenSourceListNameRef(ref){
    this.dialogSourceListName=ref
  },
  _bindChooseProjectEndTime(){
    if(this.pickEndDate) this.pickEndDate._showDialog();
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
  _bindChooseProjectLeaderName(e){
    console.log('e-------------',e);
    this.userType=e.target.dataset.value
    if(this.dialogScreenExecuteUser) this.dialogScreenExecuteUser._showDialog()
  },
  _bindChooseSourceListName(){
    if(this.dialogSourceListName) this.dialogSourceListName._showDialog(this.data.projectSourceConfigTreeDtoList)
  },
  bindInputChange(e){
    // if(e.detail.value.length > 6){
    //   this.setData({
    //     'formData.blockNumber': ''
    //   })
      
    //   // this.setData({
    //   //   'formData.blockNumber': JSON.parse(JSON.stringify(e.value.slice(0,6)))
    //   // })
    // }
  },
  onValueChange(e){
    this.setData({
      proType:e
    })
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
  
  bindPickerDateRangeCallBack(data){
    console.log(data)
    this.setData({
      planConstructionStartTime: data.startDate,
      planConstructionEndTime: data.endDate,
      planConstructionDate: data.startDate+'至'+data.endDate
    })
    let totalDate = new Date(data.endDate.toString().replace(/(-)/g, '/')).getTime() - new Date(data.startDate.toString().replace(/(-)/g, '/')).getTime();
    let totalDateNum = (totalDate / (1 * 24 * 60 * 60 * 1000)) + 1
    this.setData({
      duration: totalDateNum
    })
    this.form.setFieldValue('duration', totalDateNum)
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
      actualConstructionStartTime: data.startDate,
      actualConstructionEndTime: data.endDate,
      actualConstruction: data.startDate+'至'+data.endDate
    })
  },
  _bindScreenSuoshuUnitCallBack(data){
    console.log('所属单位', data)
    this.form.setFieldValue('affiliatedUnitId', data.id)
    this.setData({
      affiliatedUnitName:data.name
    })
  },
  bindScreenSourceListNameCallBack(data){
    console.log('data',data);
    this.setData({
      projectSourceConfigTreeDtoList:data,
      sourceListName: data.map(i=>i.name).join(','),
    })
  },
  bindScreenExecuteUserCallBack(data){
    console.log('项目负责人',data)
    if(this.userType==0){
      this.setData({
        projectLeaderName: data[0].username,
        personId: data[0].userId
      })
    }else if(this.userType==1){
      this.setData({
        carryLeaderName: data[0].username,
        carryPersonId: data[0].userId
      })
    }else if(this.userType==2){
      this.setData({
        operateLeaderName: data[0].username,
        operatePersonId: data[0].userId
      })
    }
    console.log('data------',this.data);
  },
  //详情
  getDetail(id){
    request.doPostRequest({
      url: projectService.API_SELECTPROJECT_INFO_BYID,
      data:{id:id},
      success: res => {
        
        this.setData({
          outPutTime:res.data.outPutTime,
          // planConstructionDate:res.data.planConstructionStartTime+'至'+res.data.planConstructionEndTime,
          // actualConstruction: res.data.actualConstructionStartTime+'至'+res.data.actualConstructionEndTime,
          sourceListName:res.data.projectSourceConfigTreeRepList.map(i=>i.name).join(','),
          projectSourceConfigTreeDtoList:res.data.projectSourceConfigTreeRepList,
          projectSourceConfigTreeRepList:res.data.projectSourceConfigTreeRepList,

          // 前期阶段负责人
          projectLeaderName: res.data.projectLeaderName,
          personId: res.data.personId,
          // 实施阶段负责人
          carryLeaderName: res.data.carryLeaderName,
          carryPersonId: res.data.carryPersonId,
          // 运营阶段负责人
          operateLeaderName: res.data.operateLeaderName,
          operatePersonId: res.data.operatePersonId,

          duration: res.data.duration,
          affiliatedUnitName: res.data.affiliatedUnitName,
          actualConstructionEndTime: res.data.actualConstructionEndTime,
          actualConstructionStartTime: res.data.actualConstructionStartTime,
          planConstructionStartTime: res.data.planConstructionStartTime,
          planConstructionEndTime: res.data.planConstructionEndTime,
          projectEndTime: res.data.projectEndTime
        })
        if(res.data.startDate && res.data.endDate){
          this.setData({
            planConstructionDate: res.data.planConstructionStartTime+'至'+res.data.planConstructionEndTime
          })
        }else{
          this.setData({
            planConstructionDate: ''
          })
        }
        if(res.data.actualConstructionStartTime && res.data.actualConstructionEndTime){
          this.setData({
            actualConstruction: res.data.actualConstructionStartTime+'至'+res.data.actualConstructionEndTime
          })
        }else{
          this.setData({
            actualConstruction: ''
          })
        }
        const paramsdata = res.data
        const fields = this.form.getFieldsValue()
        for (let item in fields) {
          if ({}.hasOwnProperty.call(fields, item)) {
            if(paramsdata[item] !== 0){
              fields[item] = paramsdata[item] || ''
            }
          }
        }
        this.form.setFieldsValue({
          ...fields,
        })
        this.form.setFieldValue('isAccess', paramsdata.isAccess )
        this.form.setFieldValue('proType', paramsdata.proType)
        setTimeout(() => {
          this.uploadImageList._setImageList(res.data.projectRedLineList?res.data.projectRedLineList:'') 
        }, 0);
      }
    })
  },
  //编码
  getProNumber() {
    request.doPostRequest({
      url: projectService.API_GENERATEPRONUMBER,
      success: res => {
        this.form.setFieldValue('proNumber', res.data)
        //   'formData.proNumber': res.data
        // })
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
          e.label = e.itemText
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
          e.label = e.itemText
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
          e.label = e.itemText
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
          e.label = e.itemText
          e.value = e.itemValue
        })
        console.log(res.data)
        this.setData({
          constructionNatureOptions: res.data || []
        })
      }
    })
    //所属单位
    request.doPostRequest({
      url: projectService.API_ORGANIZE_QUERYTOPLIST,
      data:{},
      success: res => {
        console.log('所属单位',res.data)
        res.data.forEach(e => {
          e.label = e.name
          e.value = e.id
        })
        this.setData({
          affiliatedUnitOption: res.data || []
        })
      }
    })
  },
  //暂存
  async stagingForm(){
    this.form.rules = {}
    const params = this.form.getFieldsValue()
    params.affiliatedUnitName = this.data.affiliatedUnitName
    params.actualConstructionEndTime = this.data.actualConstructionEndTime
    params.actualConstructionStartTime = this.data.actualConstructionStartTime
    params.sourceListName= this.data.sourceListName
    params.projectSourceConfigTreeDtoList=this.data.projectSourceConfigTreeDtoList,
    // 前期阶段负责人
    params.projectLeaderName = this.data.projectLeaderName
    params.personId = this.data.personId
    // 实施阶段负责人
    params.carryLeaderName= this.data.carryLeaderName,
    params.carryPersonId=this.data.carryPersonId,
    // 运营阶段负责人
    params.operateLeaderName= this.data.operateLeaderName,
    params.operatePersonId= this.data.operatePersonId,

    params.duration = this.data.duration,
    params.planConstructionStartTime = this.data.planConstructionStartTime,
    params.planConstructionEndTime = this.data.planConstructionEndTime,

    params.outPutTime = this.data.outPutTime
    params.projectEndTime = this.data.projectEndTime
    params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/projectDetails'
    params.singleUrl = '/pages/work/page/projectInfo/projectInfo'
    params.vueUrl = 'ApproveProjectDetail, ApproveCreateProject'

    let workAuditFile = [];
    if (this.uploadImageList) {
      workAuditFile = this.uploadImageList._getUploadImgId().imgList;
    }
    params.projectRedLineList = workAuditFile
    if(this.data.projectId){
      params.id = this.data.projectId
      params.urlParameter = JSON.stringify({ id: this.data.projectId })
    }else{
      params.urlParameter = JSON.stringify({})
    }
console.log(params,'params------------------------------');
    request.doPostRequest({
      url: projectService.API_STORAGE_PROJECT,
      data: params,
      success: res => {
        ddUtils.showToast({
          title: "暂存成功！"
        });
        ddUtils.navigateBack();
      },
    })
  },
  async bindFormSubmit(e){
    if(utils.isEmpty(this.data.projectLeaderName)){
      // this.tipVisible=true
      ddUtils.showToast({
        title: '请输入项目前期负责人'
      });
      return
    }
    if(utils.isEmpty(this.data.sourceListName)){
      // this.tipVisible=true
      ddUtils.showToast({
        title: '请输入项目来源'
      });
      return
    }


    const params = await this.form.submit();
    this.setData({
      loading: true
    })
  
    params.affiliatedUnitName = this.data.affiliatedUnitName
    params.actualConstructionEndTime = this.data.actualConstructionEndTime
    params.actualConstructionStartTime = this.data.actualConstructionStartTime
    params.sourceListName= this.data.sourceListName
    params.projectSourceConfigTreeDtoList=this.data.projectSourceConfigTreeDtoList,


    // 前期阶段负责人
    params.projectLeaderName = this.data.projectLeaderName
    params.personId = this.data.personId
     // 实施阶段负责人
     params.carryLeaderName= this.data.carryLeaderName,
     params.carryPersonId=this.data.carryPersonId,
     // 运营阶段负责人
     params.operateLeaderName= this.data.operateLeaderName,
     params.operatePersonId= this.data.operatePersonId,

    params.duration = this.data.duration,
    params.planConstructionStartTime = this.data.planConstructionStartTime,
    params.planConstructionEndTime = this.data.planConstructionEndTime,

    params.outPutTime = this.data.outPutTime
    params.projectEndTime = this.data.projectEndTime
    
    console.log('新增', params)

    let workAuditFile = [];
    if (this.uploadImageList) {
      workAuditFile = this.uploadImageList._getUploadImgId().imgList;
    }
    params.projectRedLineList = workAuditFile

    params.pcUrl = 'https://xmgk.lhbigdata.com/#/approvalManagement/approve/projectDetails'
    params.singleUrl = '/pages/work/page/projectInfo/projectInfo'
    params.vueUrl = 'ApproveProjectDetail, ApproveCreateProject'
    if(this.data.projectId){
      params.id = this.data.projectId
      params.urlParameter = JSON.stringify({ id: this.data.projectId, chooseid: this.data.projectId, proId: this.data.projectId, fromtype: 'workbench' })
    }else{
      params.urlParameter = JSON.stringify({})
    }
    request.doPostRequest({
      url: projectService.API_PROJECT_COMMITAPPROVAL,
      data: params,
      success: res => {
        this.setData({
          loading: false
        })
        ddUtils.showToast({
          title: "操作成功！"
        });
        ddUtils.navigateBack();
      },
      fail: error => {
        ddUtils.showToast({
          title: error.message
        });
        this.setData({ loading: false })
      }
    })
    // if(this.data.projectId){
    //   params.id = this.data.projectId
    //   request.doPostRequest({
    //     url: projectService.API_EDIT_PROJECT,
    //     data: params,
    //     success: res => {
    //       ddUtils.showToast({
    //         title: "编辑成功！"
    //       });
    //       ddUtils.navigateBack();
    //     },
    //   })
    // }else{
    //   request.doPostRequest({
    //     url: projectService.API_PROJECTINFON_SAVE,
    //     data: params,
    //     success: res => {
    //       ddUtils.showToast({
    //         title: "新增成功！"
    //       });
    //       ddUtils.navigateBack();
    //     },
    //   })
    // }
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
