import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import ddFile from "../../../../utils/ddFile";
import progressServer from "../../../../server/workServer/progressServer";

Page({
  data: {
    navbarData: {
      title: "进度任务详情"
    },
    taskId: "",
    listData: [],
    // 上传&&下载
    isWebView: false,
    webViewContext: ''
  },
  onLoad(query) {
    console.log('query', query)
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
    this.setData({
      taskId: query.taskId
      // taskId: '1716658765412958208'
    });

  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    console.log(this.data.taskId);
    this.getList()
  },
  // 获取基本信息
  getList: function () {
    // console.log('任务详情接口')
    let param = {
      "taskId": this.data.taskId
    }
    console.log('任务详情接口', param)
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: progressServer.API_BANK_DETAIL,
        showLoading: true,
        data: param,
        success: res => {
          res.data.annexFile = JSON.parse(res.data.annexFile)
          if (res.data.annexFile && res.data.annexFile.length) {
            res.data.annexFile.map((item) => {
              if (item.url.indexOf('.pdf') > -1) {
                item.type = 'pdf'
              }
              if (item.url.indexOf('.ppt') > -1) {
                item.type = 'ppt'
              }
              if (item.url.indexOf('.png') > -1) {
                item.type = 'png'
              }
              if (item.url.indexOf('.jpg') > -1) {
                item.type = 'jpg'
              }
              if (item.url.indexOf('.doc') > -1) {
                item.type = 'doc'
              }
              if (item.url.indexOf('.docx') > -1) {
                item.type = 'docx'
              }
            })
          }
          res.data.responsible = JSON.parse(res.data.responsible)
          console.log('res.data', res.data)
          this.setData({
            listData: res.data
          });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })
  },
  toDownLoad(e) {
    console.log(e.currentTarget.dataset.item)
    let fileName
    let url = e.currentTarget.dataset.item.url
    ddFile.downloadFile(url)
    return
    request.doPostRequest({
      url: config.API_FILE_SETURL,
      data:{
        fileName: url,
      },
      success: result => {
        if(result.code == 1000) {
          fileName = result.data.split('/')
          // 获取钉盘文件信息
          request.doPostRequest({
            url: config.API_FILE_GETURL,
            data: {
              targetPath: result.data,
            },
            success: res => {
            let ddDownFileParams =  ddUtils.urlParams(res.data)
            // 获取钉盘文件信息
            ddUtils.ddDownFile(ddDownFileParams)
            }
          })
        }
      }
    })
    // this.webViewContext = dd.createWebViewContext('web-view-1')
    // this.setData({
    //   isWebView: true
    // })
    // this.webViewContext.postMessage({ tokenStr: app.globalData.userInfo.userToken })
  },
  // 下载接收到的数据
  onMessage: function (e) {
    if (e.detail.hidden) {
      this.setData({
        isWebView: false
      })
    }
    if (e.detail.imgList) {
      this.setData({
        isWebView: false,
        imgList: this.data.imgList.concat(e.detail.imgList)
      })
    }
    console.log('接受消息', e.detail)
  },
  // 电话
  callPerson(e) {
    console.log(e)
    // 1715236940858523649
    var callCode
    console.log('打电话', callCode)

    if (e.target.dataset.form === '任务') {
      let name = this.data.listData.responsible[0].name
      let str = '您即将呼叫' + name + '?'
      ddUtils.showModal({
        // title: '您即将呼叫？',
        title: str,
        content: "请确认",
        success: res => {
          if (res.confirm) {
            callCode = this.data.listData.responsible[0].id
            return new Promise((resolve, reject) => {
              request.doPostRequest({
                url: progressServer.API_CALL_CODE,
                showLoading: true,
                data: {
                  "userId": callCode
                },
                success: res => {
                  console.log('res.data', res.data)
                  dd.callUsers({
                    users: [res.data.dingTalkId],
                    // users: ['01460242357481712'],
                    corpId: 'ding1d9d54bb1a36aca6f5bf40eda33b7ba0',
                    success: () => { },
                    fail: (res) => {
                      console.log(res)
                      ddUtils.showToast({
                        title: 'errorCode：' + res.error + ',' + res.errorMessage
                      });
                    },
                    complete: () => { },
                  });

                },
                fail: res => {
                  reject(res)
                }
              });
            })
          }
        }
      })

    }
    if (e.target.dataset.form === '项目') {
      callCode = this.data.listData.dingTalkId
      let name = this.data.listData.projectLeaderName
      let str = '您即将呼叫' + name + '?'
      ddUtils.showModal({
        // title: '您即将呼叫？',
        title: str,
        content: "请确认",
        success: res => {
          if (res.confirm) {
            dd.callUsers({
              users: [this.data.listData.dingTalkId],
              // users: ['01460242357481712'],
              corpId: 'ding1d9d54bb1a36aca6f5bf40eda33b7ba0',
              success: () => { },
              fail: (res) => {
                console.log(res)
                ddUtils.showToast({
                  title: 'errorCode：' + res.error + ',' + res.errorMessage
                });
              },
              complete: () => { },
            });
          }
        }
      })

    }
  },
  // 点击文件下载
  uploadThis(e) {
    console.log(e.currentTarget.dataset.item)

  }
  // 
});
