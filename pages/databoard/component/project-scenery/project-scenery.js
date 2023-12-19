// import utils from "../../../../utils/utils"
import { isEmpty, isEmptyArray, getImgUrl } from "../../../../utils/utils";
// import ddUtils from "../../../../utils/ddUtils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import progressServer from "../../../../server/workServer/progressServer";


Component({
  mixins: [],
  data: {
    navbarData: {
      title: "项目实景",
    },
    fileData:[],//监控列表数据
    listData: [],//静态列表数据
    fileIdList: [],
    // projectId: '12019020004',//项目id
    flagNode: '',//是否为里程碑节点
  },
  props: {
    projectId: '12019020004',//项目id
  },
  //组件创建时触发
  onInit() { },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) { },
  //组件创建完毕时触发
  //此时页面已经渲染，通常在这时请求服务端数据。
  didMount() {
    this.getList()
    this.getFileList()
  },
  //组件更新完毕时触发
  //每次组件数据变更的时候都会调用。
  didUpdate(prevProps, prevData) { },
  //组件删除时触发
  //每当组件实例从页面卸载的时候都会触发此回调。
  didUnmount() { },
  methods: {
    // 获取基本信息
    getList: function () {
      let param = {
        "projectId": this.props.projectId,
        // "projectId": '12019020004',
        "type": 9 //	9现场进度10效果设计11模型12红线图
      }
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: progressServer.API_BANK_SIT,
          showLoading: true,
          data: param,
          success: res => {
            console.log('res.data', res.data)
            // var list = []
            // res.data.map((item) => {
            //   list.push(item.fileIdList[0])
            // })
            // console.log('fileIdList', list)
            this.setData({
              listData: res.data
              // fileIdList: list
            });

            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 点击里程碑节点
    milestoneNode(e) {
      console.log(2333)
      let code
      // 1  里程碑  0  非里程碑   空字符串   全量
      if (this.data.flagNode) {
        this.setData({
          flagNode: ''
        });
      } else {
        this.setData({
          flagNode: 1
        });
      }
      this.getList()
    },
    // 电话
    callIt() {
      // console.log('打电话')
      if (this.data.listData && !this.data.listData.length) {
        return
      }
      let name = this.data.listData[0].projectLeaderName
      let dingTalkId = this.data.listData[0].dingTalkId
      let str = '您即将呼叫：' + name + '?'
      ddUtils.showModal({
        title: str,
        // title: '您即将呼叫？',
        content: "请确认",
        success: res => {
          if (res.confirm) {
            dd.callUsers({
              users: [dingTalkId],
              // users: ['0146024235748171'],
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
            return
          }
        }
      })

    },
    // 获取预览图片的数据
    _bindPreviewTap(e) {
      console.log(e)
      let index = e.currentTarget.dataset.index;
      let previewindex = e.currentTarget.dataset.previewindex;
      let url = e.currentTarget.dataset.url;
      let localPath = e.currentTarget.dataset.localPath;
      let urlList = []
      urlList.push(url);
      let imgs = [];
      this.data.listData.forEach(function (item) {
        if (item.fileType != 1) {
          imgs.push(isEmpty(item.localPath) ? item.url : item.localPath);
        }
      });
      console.log('imgs', imgs)
      console.log('urlList', urlList)
      ddUtils.previewImage({
        // current: index - 1,
        current: previewindex - 1,
        urls: imgs
        // current: 0,
        // urls: urlList
      });
    },
    // 获取监控列表
    getFileList: function () {
      let param = {
        "projectId": this.props.projectId,
        // "projectId": '12019020004',
        'type': 1 //1 项目监控 2数字监理
      }
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: progressServer.API_FILE_INFO,
          showLoading: true,
          data: param,
          success: res => {
            console.log('res.data-fileData', res.data)
            // var list = []
            // res.data.map((item) => {
            //   list.push(item.fileIdList[0])
            // })
            // console.log('fileIdList', list)
            this.setData({
              fileData: res.data
              // fileIdList: list
            });

            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 点击监控的
    _bindFileTap(e){
      console.log('我是监控的数据')
      // console.log(e)
      let obj = e.currentTarget.dataset.obj;
      console.log(obj)
      // return
      // let projectId = obj.projectId
      let cameraIndexCode = obj.cameraIndexCode
      if(obj.online){
        dd.navigateTo({
          // url: '/pages/databoard/page/preview-page/preview-page?projectId=' +  obj.projectId + '&cameraIndexCode=' + cameraIndexCode,
          url: '/pages/databoard/page/preview-page/preview-page?cameraIndexCode=' + cameraIndexCode,
        })
      }else{
        ddUtils.showToast({
          title: '离线状态下无法查看监控'
        });

      }
      return

      var param = {
        cameraIndexCode: obj.cameraIndexCode,
        // 'cameraIndexCode': 'c29769a70edf42dfaa6327eea5e5ebe3',
        urlType: 1 //1预览;2回放;3对讲
      }
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: progressServer.API_INTER_URL,
          showLoading: true,
          data: param,
          success: res => {
            console.log('res.data', res.data)
            dd.navigateTo({
              // url: '/pages/databoard/page/preview-page/preview-page?projectId=' +  obj.projectId + '&cameraIndexCode=' + cameraIndexCode,
              url: '/pages/databoard/page/preview-page/preview-page?url=' + res.data.wsUrl,
            })

            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })

     

    },
    // 获取监控视频
    // 
     getUrl: function () {
      let param = {
        "projectId": this.props.projectId,
        // "projectId": '12019020004',
        "type": 9 //	9现场进度10效果设计11模型12红线图
      }
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: progressServer.API_INTER_URL,
          showLoading: true,
          data: param,
          success: res => {
            console.log('res.data', res.data)
            // var list = []
            // res.data.map((item) => {
            //   list.push(item.fileIdList[0])
            // })
            // console.log('fileIdList', list)
            this.setData({
              listData: res.data
              // fileIdList: list
            });

            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
  
  },
});
