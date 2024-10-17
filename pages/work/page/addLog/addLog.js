import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import logService from "../../../../server/workServer/logServer";
import { Form } from 'antd-mini/es/Form/form';
import { formatTimeToDay } from "../../../../utils/utils";


const app = getApp();
Page({
  form: new Form({
    initialValues: {
      // logTypeName: '普通日志'
      // logDate: formatTimeToDay(new Date())+ ' 00:00:00'
      // applicationTime: formatTimeToDay(new Date())+ ' 00:00:00'
    },
    rules: {
      projectId: [{ required: true, message: '请选择' }],
      // projectIdNext: [{ required: true, message: '请选择' }],
      logDate: [{ required: true, message: '请选择' }],
      logTypeName: [{ required: true, message: '请选择' }],
      logContent: [{ required: true, message: '请输入' }],

      // biddingPerson: [{ required: true, message: '请输入' }],
      // tenderingAgencyName: [{ required: true, message: '请选择' }],
      // biddingType: [{ required: true, message: '请选择' }],
      // projectType: [{ required: true, message: '请选择' }],
      // tenderAmount: [{ required: true, message: '请输入' }],
      // decisionBasis: [{ required: true, message: '请选择' }],
      // biddingContent: [{ required: true, message: '请输入' }],
      // countersignLeader_dictText: [{ required: true, message: '请选择' }],
      // tenderDocumentList: [{ required: true, message: '请上传' }],
      // applicationTime: [{ required: true, message: '请选择' }]
    },
  }),
  data: {
    navbarData: {
      title: "新增日志"
    },
    projectListOptions: [],//项目列表
    id: "",
    projectName: '',//名称
    projectId: "",//项目id
    projectIdNext: "",//项目id
    logDate: '', //日志日期
    logTypeName: '', //日志类型名字
    logType: '', //日志类型id
    logContent: '', //日志内容
    logPhotoList: [], //照片
    logFileList: [], //附件

    logData: {
      id: '',
      name: '', //名称
      projectId: '', //项目id
      logDate: '', //日志日期
      logTypeName: '', //日志类型名字
      logType: '', //日志类型id
      // content: "", //日志内容
      // logTitle: '',
      logPhotoList: [], //照片
      logFileList: [], //附件
    },
    logTypeOptionShow: [ '重大事件', '普通日志'],
    logTypeOption: [{
      name: '普通日志',
      value: '0'
    },
    {
      name: '重大事件',
      value: '1'
    },
    ],
  },
  dialogProjectNameRef: null, //项目名称弹框实例
  dialogLogTypeRef: null, //日志类型
  uploadImgRefList: null, // 上传照片
  // uploadFileRef: null, // 上传附件
  uploadImageList: null, // 上传附件

  onLoad(options) {
    console.log(options)
    this.getProjectList()
    // this.getCodeList()
    // if (options.id) {
    //   this.setData({
    //     projectId: options.id
    //   })
    //   this.getDetail(options.id)
    // } else {
    //   this.getProNumber()
    // }


  },
  onReady() {
    this.form.setFieldValue('logTypeName', '普通日志')
    this.setData({
      logTypeName: '普通日志',
      logType: '0'
    })
  },
  events: {
    onBack() {
      console.log('onBack')
    },
  },

  handleRef(ref) {
    this.form.addItem(ref);
  },
  changeName(data) {
    let name = this.form.getFieldValue('name')
    console.log(data, name, this.form.getFieldValue)
    // this.form.setFieldValue('title', projectName+data)
  },

  // 项目名称----组件start
  _bindChooseLogProject: function (e) {
    console.log(e);
    if (this.data.isEdit) return;
    if (this.dialogProjectNameRef) this.dialogProjectNameRef._showDialog()
  },
  onSaveDialogLogProjectNameRef: function (ref) {
    console.log(ref);
    this.dialogProjectNameRef = ref;
  },
  bindChooseLogProjectCallBack(data) {
    console.log(data);

    this.setData({
      'logData.name': data.name || {},
      projectName: data.name || {},
      projectId: data.id || {},
      projectIdNext: data.id || {},
      'logData.projectId': data.id || {},
    });
    this.form.setFieldValue('projectId', data.id)
    this.form.setFieldValue('projectIdNext', data.id)
    console.log(this.data.logData, 'this.data.logData');
    console.log(this.data.logData.name, 'this.data.logData.name');
  },
  // 项目名称----组件end
  //日志日期  ---start
  _bindLogTime() {
    // console.log(22)
    if (this.dialogPickerDateRef) this.dialogPickerDateRef._showDialog();
  },
  onSavePickerDateRef(ref) {
    console.log('日志日期')
    this.dialogPickerDateRef = ref;
  },
  bindPickerDateCannBack(data) {
    console.log('日志日期', data)
    this.setData({
      // 'logData.logDate': data.startDate
      logDate: data.startDate
    })
    this.form.setFieldValue('logDate', data.startDate);
  },
  //日志日期  ---end 
  //日志类型  ---start
  _bindLogType() {
    if (this.dialogLogTypeRef) this.dialogLogTypeRef._showDialog();
  },
  onSaveDialogLogTypetRef(ref) {
    this.dialogLogTypeRef = ref
  },
  bindLogTypeRef(item) {
    console.log(item, '日志类型')
    this.setData({
      'logData.logTypeName': item.name,
      'logData.logType': item.value,
      logTypeName: item.name,
      logType: item.value
    })
    this.form.setFieldValue('logTypeName', item.name);
    this.form.setFieldValue('logType', item.value);
  },
  // 日志类型  --- end

  // 照片---start
  // 上传
  onSaveUploadImgRef: function (ref) {
    // console.log('图片上传',ref)
    // ref只有刚进入页面的时候  会触发
    this.uploadImgRefList = ref;
    console.log(this.uploadImgRefList)
    // this.uploadImgRef._getUploadImgId().imgList;

  },
  onSaveUploadFileRef: function (ref) {
    // this.uploadFileRef = ref;
    this.uploadImageList = ref;
    console.log('文件上传', ref)
  },
  // 照片----end


  async logAddSubmit() {
    // console.log('触发了表单', e.detail.value)
    console.log(this.form)
    const params = await this.form.submit();
    console.log(params)
    this.setData({
      'logContent': params.logContent,
    })
    // return

    // console.log(this.data.logData, 'this.data.logData');
    // console.log(this.data.logContent, 'this.data.logContent');
    // let logPhotoList
    // if (this.uploadImgRefList._getUploadImgId().imgList.length) {
    //   logPhotoList = this.uploadImgRefList._getUploadImgId().imgList
    // } else {
    //   logPhotoList = [];
    // }
    // this.data.logPhotoList = logPhotoList
    // let logFileList
    // if (this.uploadImageList._getUploadImgId().imgList.length) {
    //   logFileList = this.uploadImageList._getUploadImgId().imgList
    // } else {
    //   logFileList = [];
    // }
    // 照片/附件合并为证明材料
    let logPhotoList
    if (this.uploadImageList._getUploadImgId().imgList.length) {
      logPhotoList = this.uploadImageList._getUploadImgId().imgList
    } else {
      logPhotoList = [];
    }
    this.data.logPhotoList = logPhotoList

    let projectId
    // if (this.data.logTypeName == '重大事件') {
    //   projectId = this.data.projectId
    // } else {
    //   projectId = this.data.projectIdNext
    // }
    let param = {
      id: '',
      name: this.data.projectName, //名称
      projectId: this.data.projectId, //项目id
      logDate: this.data.logDate, //日志日期
      logTypeName: this.data.logTypeName, //日志类型名字
      logType: this.data.logType, //日志类型id
      content: this.data.logContent,//日志内容
      logPhotoList: this.data.logPhotoList, //照片
      // logFileList: this.data.logFileList, //附件
      // ...this.data.logData,

    }
    console.log('param', param)

    // 校验
    // if (!this.data.logData.logDate) {
    //   ddUtils.showToast({
    //     title: "日志日期必选"
    //   });
    //   return
    // }
    // if (!this.data.logData.logType.length) {
    //   ddUtils.showToast({
    //     title: "日志类型必选"
    //   });
    //   return
    // }
    // if (!this.data.logContent) {
    //   ddUtils.showToast({
    //     title: "日志内容必填"
    //   });
    //   return
    // }
    // if (this.data.logTypeName == '重大事件') {
    //   // if (!this.data.logData.name) {
    //   //   ddUtils.showToast({
    //   //     title: "请选择项目名称"
    //   //   });
    //   //   return
    //   // }
    //   if (!this.data.logPhotoList.length) {
    //     ddUtils.showToast({
    //       title: "重大事件的时候 图片必填",

    //     });
    //     return
    //   }
    // }
    // return
      if (!this.data.logPhotoList.length) {
        ddUtils.showToast({
          title: "证明材料必填",
        });
        return
      }
    request.doPostRequest({
      url: logService.API_CREATE_LOG,
      data: param,
      success: res => {
        console.log(res)
        ddUtils.showToast({
          title: "新增成功！"
        });
        ddUtils.navigateBack();
        // setTimeout(function () {


        // }, 1000)
      },
    })
  },
  // 
  bindCancelTap() {
    // ddUtils.navigateBack();
    ddUtils.showModal({
      content: "是否退出编辑？退出后不会保存当前编辑内容",
      success: res => {
        if (res.confirm) {
          // this.form.reset();
          ddUtils.navigateBack();
        }
      }
    });
  },
  getProjectList() {
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
  // 
});