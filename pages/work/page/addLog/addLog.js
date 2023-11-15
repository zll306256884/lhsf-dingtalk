import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import logService from "../../../../server/workServer/logServer"; //
import projectService from "../../../../server/workServer/projectServer";
import { Form } from 'antd-mini/es/Form/form';


const app = getApp();
Page({
  form: new Form({
    initialValues: {
      // applicationTime: formatTimeToDay(new Date())+ ' 00:00:00'
    },
    rules: {
      tenderName: [{ required: true, message: '请输入' }],
      projectId: [{ required: true, message: '请选择' }],
      biddingPerson: [{ required: true, message: '请输入' }],
      tenderingAgencyName: [{ required: true, message: '请选择' }],
      biddingType: [{ required: true, message: '请选择' }],
      projectType: [{ required: true, message: '请选择' }],
      tenderAmount: [{ required: true, message: '请输入' }],
      decisionBasis: [{ required: true, message: '请选择' }],
      biddingContent: [{ required: true, message: '请输入' }],
      countersignLeader_dictText: [{ required: true, message: '请选择' }],
      tenderDocumentList: [{ required: true, message: '请上传' }],
      applicationTime: [{ required: true, message: '请选择' }]
    },
  }),
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
  uploadImgRefList: null, // 上传照片
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

  handleRef(ref) {
    this.form.addItem(ref);
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
    // console.log('图片上传',ref)
    // ref只有刚进入页面的时候  会触发
    this.uploadImgRefList = ref;
    console.log(this.uploadImgRefList)
    // this.uploadImgRef._getUploadImgId().imgList;

  },
  onSaveUploadFileRef: function (ref) {
    this.uploadFileRef = ref;
    console.log('文件上传', ref)
  },
  // 照片----end


  logAddSubmit(e) {
    console.log('触发了表单', e.detail.value)
    this.setData({
      'logContent': e.detail.value.logContent,
    })
    // console.log(this.data.logData, 'this.data.logData');
    // console.log(this.data.logContent, 'this.data.logContent');
    let logPhotoList
    if (this.uploadImgRefList._getUploadImgId().imgList.length) {
      logPhotoList = this.uploadImgRefList._getUploadImgId().imgList
    } else {
      logPhotoList = [];
    }
    this.data.logData.logPhotoList = logPhotoList
    let logFileList
    if (this.uploadFileRef._getUploadImgId().imgList.length) {
      logFileList = this.uploadFileRef._getUploadImgId().imgList
    } else {
      logFileList = [];
    }
    this.data.logData.logFileList = logFileList
    let param = {
      ...this.data.logData,
      'content': this.data.logContent
    }
    console.log('param', param)

    // 校验
    if (!this.data.logData.logDate) {
      ddUtils.showToast({
        title: "日志日期必选"
      });
      return
    }
    if (!this.data.logData.logType.length) {
      ddUtils.showToast({
        title: "日志类型必选"
      });
      return
    }
    if (!this.data.logContent) {
      ddUtils.showToast({
        title: "日志内容必填"
      });
      return
    }
    if (this.data.logData.logTypeName == '重大事件') {
      if (!this.data.logData.name) {
        ddUtils.showToast({
          title: "请选择项目名称"
        });
        return
      }
      if (!this.data.logData.logPhotoList.length) {
        ddUtils.showToast({
          title: "重大事件的时候 图片必填"
        });
        return
      }
    }
    // return
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
});