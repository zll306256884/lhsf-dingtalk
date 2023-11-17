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
    listData: [],
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
      if (this.props.listData && !this.props.listData.length) {
        return
      }
      let callCode = (JSON.parse(this.props.listData[0].responsible))[0].id
      console.log(JSON.parse(this.props.listData[0].responsible))
      // let callCode = '1715236940858523649'
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

          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 
    _bindPreviewTap(e) {
      let index = e.currentTarget.dataset.index;
      let imgs = [];
      this.data.listData.forEach(function (item) {
        if (item.fileType != 1) {
          imgs.push(isEmpty(item.localPath) ? item.url : item.localPath);
        }
      });
      ddUtils.previewImage({
        current: index,
        urls: imgs
      });
    },
    // 
  },
});
