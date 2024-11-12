import utils from "/utils/utils"
import ddUtils from "/utils/ddUtils"
import request from "/utils/request"
import config from "/utils/config"
import logServer from "/server/dataBoardServer/log.js";

const app = getApp();

Component({
  mixins: [],
  data: {
    navbarData: {
      title: "工作日志",
    },
    showAll: 0,
    items1: [
      { text: '重大', value: 1 },
      { text: '全部', value: '' },
    ],
    logType: 1,
    logList: [],//查询的数据

  },
  tabsRef:'',
  uploadFormImgRef:'',
  props: {
    projectId: '',//项目id
  },
  //组件创建时触发
  onInit() { },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) { },
  //组件创建完毕时触发
  //此时页面已经渲染，通常在这时请求服务端数据。
  didMount() {
    this.initLogList()
  },
  //组件更新完毕时触发
  //每次组件数据变更的时候都会调用。
  didUpdate(prevProps, prevData) { },
  //组件删除时触发
  //每当组件实例从页面卸载的时候都会触发此回调。
  didUnmount() { },
  methods: {
    _onSaveTabsRef: function (ref) {
      this.tabsRef = ref;
    },
    _onSaveUploadFormImgRef: function (ref) {
      this.uploadFormImgRef = ref;
      let fileList = this.uploadFormImgRef._getUploadImgId().imgList
      console.log('upload--->', this.uploadFormImgRef, fileList);
    },
    initLogList() {
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: logServer.API_LOG_LIST,
          showLoading: false,
          data: {
            "logType": this.data.logType,//	日志类型 0普通1重大事件
            "projectId": this.props.projectId //项目id
          },
          success: res => {
           if (!(res.data && res.data.length)) {
           this.setData({ logType: '',});
           this.getDetail()
           }else{
            this.setData({
              logList:this.handleData(res.data)
            });
           }
          resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },

    handleData(list){
     list.forEach(item => {
        item.appProjectLogResponseList.forEach(e => {
          if (e.appProjectLogDtoList && e.appProjectLogDtoList.length) {
            e.appProjectLogDtoList.forEach(i => {
              i.photoList = []
              i.fileList=[]
              i.logPhotoList.forEach(img=>{
              if (['jpg', 'jpeg', 'png'].includes(img.url.slice(img.url.lastIndexOf('.') + 1))) {
                i.photoList.push(img)
              } else {
                i.fileList.push(img)
              }
            })
            })
          }
        })
      })
      return list
    },
    // 获取数据详情
    getDetail() {
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: logServer.API_LOG_LIST,
          showLoading: false,
          data: {
            "logType": this.data.logType,//	日志类型 0普通1重大事件
            "projectId": this.props.projectId //项目id
          },
          success: res => {
            console.log('res.data', res.data)
            this.setData({
              logList:this.handleData(res.data)
            });
            console.log('res.data-------------------------->', res.data)

            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })

    },
    // 点击切换
    handleChange(value) {
      this.setData({
        logType: value,
      });
      this.getDetail()
    },
    // 点击全文/收起
    expandedIt(e) {
      let index1 = e.target.dataset.index1
      let index2 = e.target.dataset.index2
      let index3 = e.target.dataset.index3
      let showAll = e.target.dataset.showAll
      if (showAll == 0) {
        this.data.logList[index1].appProjectLogResponseList[index2].appProjectLogDtoList[index3].showAll = 1
      }
      if (showAll == 1) {
        this.data.logList[index1].appProjectLogResponseList[index2].appProjectLogDtoList[index3].showAll = 0
      }
      this.setData({
        logList: this.data.logList,
      });
    },
    // 预览
    _bindPreviewTap(e) {
      let url = e.currentTarget.dataset.url;
      let urlList = []
      urlList.push(url);
      ddUtils.previewImage({
        current: 0,
        urls: urlList
      });
    },
    // 图片预览
    ddDownFile(e) {
      console.log('e--------------',e);
      let index = e.currentTarget.dataset.index;
      let list = e.currentTarget.dataset.list;
      let urls = []
      list.forEach(img => {
        let url = img.preUrl || img.url
        urls.push(url)
      })
        ddUtils.previewImage({
          current: index,
          urls: urls
        });
      // let item = e.currentTarget.dataset.item;
      // let url = item.preUrl || item.url;
      // let name = item.name;
      // let extension = name.slice(name.lastIndexOf(".") + 1);
      // console.log('url',url);
      // if(['png','jpg','jpeg'].includes(extension)){
      //   ddUtils.previewImage({
      //     urls: [url]
      //   });
      // }
    },
  },
});
