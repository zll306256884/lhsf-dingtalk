import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import logService from "../../../../server/workServer/logServer"; //
import projectService from "../../../../server/workServer/projectServer";


const app = getApp();
Page({
  data: {
    navbarData: {
      title: "新增日志"
    },
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
    logContent: '', //日志内容
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
  uploadImgRef: null, // 上传照片
  uploadFileRef: null, // 上传附件

  onLoad(options) {
    console.log(options)
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
  events: {
    onBack() {
      console.log('onBack')
    },
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
  bindChooseLogProjectCallBack: function (data) {
    console.log(data);
    this.setData({
      'logData.name': data.name || {},
      'logData.projectId': data.id || {},
    });
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
      'logData.logDate': data.startDate
    })
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
      'logData.logType': item.value
    })
  },
  // 日志类型  --- end

  // 照片---start
  // 上传
  onSaveUploadImgRef: function (ref) {
    this.uploadImgRef = ref;
  },
  onSaveUploadFileRef: function (ref) {
    this.uploadFileRef = ref;
  },
  // 照片----end


  logAddSubmit(e) {
    console.log('触发了表单', e.detail.value)
    this.setData({
      'logContent': e.detail.value.logContent,
    })
    // console.log(this.data.logData, 'this.data.logData');
    // console.log(this.data.logContent, 'this.data.logContent');
    let param = {
      ...this.data.logData,
      'content': this.data.logContent
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
      },
    })
  },
  // 
  bindCancelTap() {
    ddUtils.navigateBack();
  },
});