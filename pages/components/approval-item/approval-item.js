// import {
//   isEqual,
//   isEmptyArray
// } from "../../../../utils/utils"
// import ddUtils from "../../../../utils/ddUtils"
// import userServer from "../../../server/userServer"
import approvalServer from "../../../server/approvalServer/approvalServer"
import request from "../../../utils/request"
import config from "../../../utils/config"
import ddFile from "../../../utils/ddFile";
const app = getApp();

Component({
  mixins: [],
  data: {
    // 已经有的节点
    listData: [],
    // 当前进行的节点
    nextNode: [],
    // 上传&&下载
    isWebView: false,
    webViewContext: ''
  },
  props: {
    projectId: '12019020004',//项目id
    keyId: "1722516061045305346",//keyId
  },
  //组件创建时触发
  onInit() {
  },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) {

  },
  //组件创建完毕时触发
  //此时页面已经渲染，通常在这时请求服务端数据。
  didMount() {
    // console.log('this.is组件路径', this.is);
    // console.log('$page组件所属页面实例', this.$page);
    // console.log('$id 组件 id，在 axml 中也可直接渲染', this.$id);
    this.integrationData()
  },
  //组件更新完毕时触发
  //每次组件数据变更的时候都会调用。
  didUpdate(prevProps, prevData) { },
  //组件删除时触发
  //每当组件实例从页面卸载的时候都会触发此回调。
  didUnmount() {
    console.log('父组件传递过来的projectId', this.props.projectId)
    console.log('keyId', this.props.keyId)
  },
  //组件 js 代码抛出错误时触发
  onError(e) {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取节点
    getList: function () {
      // return
      let param = { "keyId": this.props.keyId }
      console.log('param', param)
      // return
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: approvalServer.API_APPROVAL_LIST,
          showLoading: false,
          data: param,
          success: res => {
            res.data.map((item) => {
              item.annexesUrl = JSON.parse(item.annexesUrl)
              if (item.annexesUrl && item.annexesUrl.length) {
                item.annexesUrl.map((item1) => {
                  if (item1.url.indexOf('.pdf') > -1) {
                    item1.type = 'pdf'
                  }
                  if (item1.url.indexOf('.ppt') > -1) {
                    item1.type = 'ppt'
                  }
                  if (item1.url.indexOf('.png') > -1) {
                    item1.type = 'png'
                  }
                  if (item1.url.indexOf('.jpg') > -1) {
                    item1.type = 'jpg'
                  }
                  if (item1.url.indexOf('.doc') > -1) {
                    item1.type = 'doc'
                  }
                  if (item1.url.indexOf('.docx') > -1) {
                    item1.type = 'docx'
                  }

                })
              }
              // 附言附件
              if(item.forwardAnnexesUrl && item.forwardAnnexesUrl !== '[]') {
                item.forwardAnnexesUrl = JSON.parse(item.forwardAnnexesUrl)
                if (item.forwardAnnexesUrl && item.forwardAnnexesUrl.length) {
                  item.forwardAnnexesUrl.map((item1) => {
                    if (item1.url.indexOf('.pdf') > -1) {
                      item1.type = 'pdf'
                    }
                    if (item1.url.indexOf('.ppt') > -1) {
                      item1.type = 'ppt'
                    }
                    if (item1.url.indexOf('.png') > -1) {
                      item1.type = 'png'
                    }
                    if (item1.url.indexOf('.jpg') > -1) {
                      item1.type = 'jpg'
                    }
                    if (item1.url.indexOf('.doc') > -1) {
                      item1.type = 'doc'
                    }
                    if (item1.url.indexOf('.docx') > -1) {
                      item1.type = 'docx'
                    }

                  })
                }
              }

            })
            // console.log('res.data', res.data)
            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 获取下一个节点
    getNextNode: function () {
      // return
      let param = { "keyId": this.props.keyId }
      console.log('param', param)
      // return
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: approvalServer.API_NEXT_APPROVAL_NODE,
          showLoading: false,
          data: param,
          success: res => {
            // console.log('res.data', res.data)
            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 整合数据
    async integrationData() {
      // 审核类型（1通过2驳回3待审核）
      var data1 = await this.getList()
      let data2 = await this.getNextNode()
      console.log('data1', data1)
      console.log('data2', data2)
      let obj
      if (data2["auditUserNameList"] && data2["auditUserNameList"].length) {
        obj = {
          operatorsName: data2["auditUserNameList"].join(),
          operatorsContent: '进行审核',
          content: '',
          type: 99
        }
        // 下一个审批的数据放在头部
        data1.unshift(obj)
      }
      console.log('obj', obj)
      console.log('data1new', data1)

      this.setData({
        listData: data1
      });
    },
    // toEditPage(e) {
    //   console.log('e', e)
    //   let id = e.target.dataset.planId
    //   let type = e.target.dataset.type
    //   let name = e.target.dataset.name
    //   let projectId = e.target.dataset.projectId
    //   // return
    //   dd.navigateTo({
    //     url: '/pages/work/page/progressEdit/progressEdit?id=' + id + '&type=' + type + '&name=' + name + '&projectId=' + projectId,
    //   })
    // },
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
  },
});