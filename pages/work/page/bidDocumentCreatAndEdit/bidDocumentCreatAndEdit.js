import { Form } from 'antd-mini/es/Form/form';
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import { formatTimeToDay } from "../../../../utils/utils";
import projectService from "../../../../server/workServer/projectServer";
import { dateRangePicker } from 'dingtalk-jsapi/api/apiObj';

Page({
  form: new Form({
    initialValues: {
      applicationTime: formatTimeToDay(new Date())
    },
    rules: {},
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
    tenderingAgencyName: '',
    countersignLeader: '',
    tenderDocumentList: [],
    otherDocumentList: [],
    basisDocumentList: [],
    projectId: null,
    projectName: '',
    applicationTime: formatTimeToDay(new Date()),
    tenderingAgencyOptions: [],
    executeUser: [],
    projectLeaderId: '',
    isShow: false,
    proType: null, //0工程，1非工程
    loading: false,
    projectLeaderListOptions: []
  },
  dialogSScreenExecuteUser: null,
  dialogSScreen: null,
  uploadTenderImageList: null,
  uploadOtherImgList: null,
  pickerDateRef: null,
  dialogScreenProject: null,
  uploadImageList: null,

  onLoad(options) {
    this.form.rules = {
      tenderName: [{ required: true, message: '请输入' }],
      projectId: [{ required: true, message: '请选择' }],
      biddingPerson: [{ required: true, message: '请输入' }],
      tenderingAgency: [{required: true, message: '请选择'}],
      biddingType: [{ required: true, message: '请选择' }],
      projectType: [{ required: true, message: '请选择' }],
      tenderAmount: [{ required: true, message: '请输入(最多15位整数6位小数)',pattern: /^(0|\+?[1-9][0-9]{0,14})(\.\d{1,6})?$/   }],
      decisionBasis: [{ required: true, message: '请选择' }],
      biddingContent: [{ required: true, message: '请输入' }],
      countersignLeader_dictText: [{ required: true, message: '请选择' }],
      tenderDocumentList: [{required: true,message: '请上传'}],
      applicationTime: [{ required: true, message: '请选择' }],
      projectLeaderId: [{ required: true, message: '请选择' }],
      meetingTime:[{ required: true, message: '请选择' }]
    }
    console.log(options)
    if(options.id){
      this.setData({
        tenderId: options.id,
        navbarData: { title: '编辑招标文件'}
      })
      this.getDetail(options.id)
    }
    this.getCodeList()
    this.getProjectList()
    this.getEcological()
  },
  handleRef(ref) {
    console.log(ref)
    this.form.addItem(ref);
  },
  onSaveDialogScreenprojecteRef(ref){
    this.dialogScreenProject = ref
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
  onSaveUploadOtherImgRef(ref){
    this.uploadOtherImgList = ref
  },
  onSaveUploadBasisImgRef(ref){
    this.uploadImageList = ref
  },
  chooseProject(){
    if(this.dialogScreenProject) this.dialogScreenProject._showDialog()
  },
  chooseTime(e){
    // e.preventDefault()
    if(this.pickerDateRef) this.pickerDateRef._showDialog()
  },
  chooseLeader(){
    if(this.dialogSScreenExecuteUser) this.dialogSScreenExecuteUser._showDialog(this.data.executeUser)
  },
  chooseTenderingAgency(){
    if(this.dialogSScreen) this.dialogSScreen._showDialog()
  },
  bindScreenExecuteUserCallBack(data){
    console.log(data)
    this.form.setFieldValue('countersignLeader_dictText', data.map(e => e.username).toString());
    
    // this.form.setFieldValue('countersignLeader', data.map(e => e.userId).toString());
    // this.form.getFieldValue('countersignLeader')
    this.setData({
      countersignLeader: data.map(e => e.userId).toString()
      // countersignLeader_dictText: data.map(e => e.username).toString()
    })
    this.setData({
      executeUser: data && data.map(e => {
        return { userId: e.userId, username: e.username,disabled:e.disabled };
      })
    });
  },
  bindScreenQuesFromCallBack(data){
    console.log("单位", data)
    // this.form.setFieldValue('tenderingAgencyName', data.name);
    
    this.setData({
      // tenderingAgency: data.id,
      tenderingAgencyName: data.name,
    })
    this.form.setFieldValue('tenderingAgency', data.id);
  },
  chooseMeetingTime(){
    if(this.pickerDateRef) this.pickerDateRef._showDialog()
  },
  bindPickerDateCannBack(data){
    this.setData({
      // applicationTime: data.startDate
      meetingTime: data.startDate
    })
    // this.form.setFieldValue('applicationTime', data.startDate);
    this.form.setFieldValue('meetingTime', data.startDate);
  },
  changeTenderName(data){
    console.log(data);
    // let projectName = this.form.getFieldValue('projectName')
    // this.form.setFieldValue('title', this.data.projectName+data)
    if( this.data.proType === 0){
      this.form.setFieldValue('title', this.data.projectName+'-'+data)
    }else{
      this.form.setFieldValue('title', '')
    }
  },
  bindChooseProjectCallBack(data){
    console.log(data)
    this.form.setFieldValue('projectId',data.id)
    // this.form.setFieldValue('projectLeader', data.projectLeaderName);
    this.form.setFieldValue('affiliateUnit', data.affiliatedUnitName);
    // this.form.setFieldValue('projectLeaderId', data.personId);
    this.setData({
      projectId: data.id,
      projectName: data.name,
      // projectLeaderId: data.personId,
      proType: data.proType
    })
    let tenderName = this.form.getFieldValue('tenderName') || ''
    if( data.proType === 0){
      this.form.setFieldValue('title', data.name+'-'+tenderName)
    }else{
      this.form.setFieldValue('title', '')
    }
    this.getProjectLeader()
  },
  chooseProjectLeader(data, column){
    console.log(data, column)
    this.setData({
      projectLeaderId: column.personId
    })
    this.form.setFieldValue('projectLeader', column.name)
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
        if(paramsdata.title){
          paramsdata.title = paramsdata.title.replace('招标文件会签：', '')
        }
        if(paramsdata.biddingType){
          paramsdata.biddingType = paramsdata.biddingType.toString()
        }
        if(paramsdata.projectType){
          paramsdata.projectType = paramsdata.projectType.toString()
        }
        if(paramsdata.decisionBasis){
          paramsdata.decisionBasis = paramsdata.decisionBasis.toString()
        }
        
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
          tenderingAgencyName: paramsdata.tenderingAgencyName,
          countersignLeader: paramsdata.countersignLeader,
          projectName: paramsdata.projectName,
          applicationTime: paramsdata.startDate,
          projectLeaderId: paramsdata.projectLeaderId
        })
        if(res.data.tenderDocumentList && res.data.tenderDocumentList.length){
          res.data.tenderDocumentList.forEach(e => {
            e.name = e.fileName
          })
        }
        if(res.data.otherDocumentList && res.data.otherDocumentList.length){
          res.data.otherDocumentList.forEach(e => {
            e.name = e.fileName
          })
        }
        if(res.data.basisDocumentList && res.data.basisDocumentList.length){
          res.data.basisDocumentList.forEach(e => {
            e.name = e.fileName
          })
        }
        setTimeout(() => {
          this.uploadTenderImageList._setImageList(res.data.tenderDocumentList?res.data.tenderDocumentList:'') 
          this.uploadOtherImgList._setImageList(res.data.otherDocumentList?res.data.otherDocumentList:'') 
          this.uploadImageList._setImageList(res.data.uploadImageList?res.data.uploadImageList:'') 
        }, 0);

        if(paramsdata.countersignLeader_dictText && paramsdata.countersignLeader){
          const nameList = paramsdata.countersignLeader_dictText.split(',')
          const idList = paramsdata.countersignLeader.split(',')
          this.setData({
            executeUser: nameList.map((item, index) => { return { username: item, userId: idList[index] } }) || []
          })
        }
        
        
      }
    })
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
    if (this.uploadImageList) {
      let list = this.uploadImageList._getUploadImgId().imgList
      list.forEach(e => {
        e.fileName = e.name
        e.type= 4
      })
      this.setData({
        basisDocumentList: list
      })
    }
    params.fileList = [...this.data.tenderDocumentList, ...this.data.otherDocumentList]
    params.basisDocumentList = this.data.basisDocumentList
    params.title = params.title.replace('招标文件会签：', '')
    params.projectLeaderId = this.data.projectLeaderId
    params.projectLeader = this.data.projectLeaderListOptions.find(e => e.personId === this.data.projectLeaderId).name
    params.vueUrl = 'ApproveBidDocumentDetail,ApproveBidDocumentCreatAndEdit'
    params.singleUrl = '/pages/work/page/bidDocumentDetail/bidDocumentDetail'
    params.pcUrl = 'https://xmgk.lhbigdata.com/#/biddingManage/bidDocument/bidDocument/detail'
    params.projectName = this.data.projectName
    params.tenderingAgencyName = this.data.tenderingAgencyName
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
    this.setData({loading: true})
    if(this.data.tenderId){
      params.id = this.data.tenderId
      params.urlParameter = JSON.stringify({id: this.data.tenderId})
    }else{
      params.urlParameter = JSON.stringify({})
    }
    params.projectLeaderId = this.data.projectLeaderId
    params.projectLeader = this.data.projectLeaderListOptions.find(e => e.personId === this.data.projectLeaderId).name
    params.title = params.title.replace('招标文件会签：', '')
    params.vueUrl = 'ApproveBidDocumentDetail,ApproveBidDocumentCreatAndEdit'
    params.singleUrl = '/pages/work/page/bidDocumentDetail/bidDocumentDetail'
    params.pcUrl = 'https://xmgk.lhbigdata.com/#/biddingManage/bidDocument/bidDocument/detail'
    params.projectName = this.data.projectName
    // params.urlParameter = JSON.stringify({}),
    params.tenderingAgencyName = this.data.tenderingAgencyName
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
    if (this.uploadImageList) {
      let list = this.uploadImageList._getUploadImgId().imgList
      list.forEach(e => {
        e.fileName = e.name
        e.type = 4
      })
      this.setData({
        basisDocumentList: list
      })
    }
    if(ddUtils.showEmptyArrayTips(this.data.basisDocumentList,"请上传决策依据证明文件！")) return
    params.fileList = [...this.data.tenderDocumentList, ...this.data.otherDocumentList]
    console.log(params)
    params.basisDocumentList = this.data.basisDocumentList
    request.doPostRequest({
      url: projectService.API_SAVEANDSUBMIT,
      data: params,
      success: res => {
        this.setData({loading: false})
        console.log(res.data)
        ddUtils.showToast({
          title: "保存成功！"
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
  },
  tenderAmountOnChange: function (value, e) {
    console.log(value, e);
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
      url: config.API_SCREEN_STATUS_BY_CODE + 'item_classification',
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
  },
  getEcological(){
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
          tenderingAgencyOptions: res.data.records || []
        })
      }
    })
  }
});
