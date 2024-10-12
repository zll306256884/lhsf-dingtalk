import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import progressServer from "../../../../server/workServer/progressServer";
import { Form } from 'antd-mini/es/Form/form';
import { formatTimeToDay } from "../../../../utils/utils";

const app = getApp();


Page({
  data: {
    navbarData: {
      title: "进度填报"
    },
    type: '',//1  延期  0  正常
    projectName: "",
    projectId: "",
    taskId: '', //任务id
    detailData: {//详情数据
      actualEndTime: '',//实际结束时间
      actualBeginTime: '',//实际开始时间
      remark: ""//情况说明,延期情况说明

    },
    showDelayDetail: false
  },
  dialogStartDateRef: null, //实际开始时间 
  dialogEndDateRef: null, //实际结束时间 
  // dialogProjectNameRef: null, //项目名称弹框实例
  // dialogLogTypeRef: null, //日志类型
  // uploadImgRef: null, // 上传照片
  uploadFileRef: null, // 上传附件
  uploadImageList: null, // 上传附件

  onLoad(query) {
    console.log('query', query)
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
    this.setData({
      taskId: query.id,
      type: Number(query.type),
      projectName: query.name,
      projectId: query.projectId,
    });
    console.log(this.data.taskId);
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    this.getDetail()
    console.log('app', app.globalData)
    // this.setData({
    //   projectName: app.globalData.userInfo.projectName,
    //   projectId: app.globalData.userInfo.projectId
    // });
  },
  // 获取数据详情
  getDetail() {
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: progressServer.API_PROGRESS_DETAIL,
        showLoading: false,
        data: {
          "taskId": this.data.taskId
        },
        success: res => {
          console.log('res.data', res.data)
          this.setData({
            detailData: res.data
          });
          if (this.data.detailData.actualBeginTime > this.data.detailData.beginTime || this.data.detailData.actualEndTime > this.data.detailData.endTime) {
            this.setData({
              showDelayDetail: true
            });
          } else {
            this.setData({
              showDelayDetail: false
            });
          }
          // 附件的附着
          setTimeout(() => {
            this.uploadImageList._setImgList(JSON.parse(res.data.annexFile))
          }, 0)
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })

  },
  //实际开始时间  ---start
  _bindStartTime() {
    // console.log(22)
    if (this.dialogStartDateRef) this.dialogStartDateRef._showDialog();
  },
  onSaveStartTimeRef(ref) {
    console.log('实际开始时间')
    this.dialogStartDateRef = ref;
  },
  bindStartTimeBack(data) {
    console.log('实际开始时间', data)
    this.setData({
      'detailData.actualBeginTime': data.startDate
    })
    if (this.data.detailData.actualBeginTime > this.data.detailData.beginTime || this.data.detailData.actualEndTime > this.data.detailData.endTime) {
      this.setData({
        showDelayDetail: true
      });
    } else {
      this.setData({
        showDelayDetail: false
      });
    }
  },
  ///实际开始时间  ---end 
  //实际结束时间  ---start
  _bindEndTime() {
    if (this.dialogEndDateRef) this.dialogEndDateRef._showDialog();
  },
  onSaveEndTimeRef(ref) {
    console.log('实际结束时间期')
    this.dialogEndDateRef = ref;
  },
  bindEndTimenBack(data) {
    console.log('实际结束时间', data)
    this.setData({
      'detailData.actualEndTime': data.startDate
    })

    if (this.data.detailData.actualBeginTime > this.data.detailData.beginTime || this.data.detailData.actualEndTime > this.data.detailData.endTime) {
      this.setData({
        showDelayDetail: true
      });
    } else {
      this.setData({
        showDelayDetail: false
      });
    }
  },
  ///实际结束时间  ---end 




  // 照片---start
  // 上传
  onSaveUploadImgRef: function (ref) {
    this.uploadImgRef = ref;
    console.log('onSaveUploadImgRef', ref)
    // console.log('onSaveUploadImgRef',this.uploadImgRef,ref)
  },
  onSaveUploadFileRef: function (ref) {
    // this.uploadFileRef = ref;
    this.uploadImageList = ref;
    
    console.log('onSaveUploadFileRef', this.uploadImageList, ref)
  },
  // 照片----end


  progressAddSubmit(e) {
    // 
    console.log('触发了表单', e.detail.value)
    console.log('附件的数据', this.uploadImageList._getUploadImgId().imgList)
    let annexFile
    if (this.uploadImageList._getUploadImgId().imgList.length) {
      annexFile = this.uploadImageList._getUploadImgId().imgList
    } else {
      annexFile = [];
    }
    // return
    this.setData({
      'detailData.remark': e.detail.value.remark,
    })
    let param = {
      "actualEndTime": this.data.detailData.actualEndTime,
      "actualStartTime": this.data.detailData.actualBeginTime,
      "annexFile": annexFile,
      //  [{
      //   "name": "",
      //   "size": 0,
      //   "url": ""
      // }],
      "projectId": this.data.projectId,
      "remark": this.data.detailData.remark,
      "taskId": this.data.taskId
    }

    console.log('param', param)

    // 校验
    if (this.data.type === 0) {
      if (!this.data.detailData.actualBeginTime) {
        ddUtils.showToast({
          title: "请选择实际开始时间"
        });
        return
      }
    }
    // debugger
    if (this.data.type === 1) {
      if (!this.data.detailData.remark) {
        ddUtils.showToast({
          title: "请填写延期说明"
        });
        return
      }
      // if (!annexFile.length) {
      //   ddUtils.showToast({
      //     title: "请添加证明材料"
      //   });
      //   return
      // }
    }

    // return
    request.doPostRequest({
      url: progressServer.API_SAVE_PROGRESS,
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
    ddUtils.showModal({
      content: "是否退出编辑？退出后不会保存当前编辑内容?",
      success: res => {
        if (res.confirm) {
          // this.form.reset();
          ddUtils.navigateBack();
        }
      }
    });
  },
  events: {
    onBack() {
      console.log('onBack')
    },
  },
});