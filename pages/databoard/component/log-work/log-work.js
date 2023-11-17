import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
// import progressServer from "../../../../server/workServer/progressServer";
import logServer from "../../../../server/dataBoardServer/log.js";

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
  props: {
    projectId: '12019020001',//项目id
  },
  //组件创建时触发
  onInit() { },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) { },
  //组件创建完毕时触发
  //此时页面已经渲染，通常在这时请求服务端数据。
  didMount() {
    this.getDetail()
  },
  //组件更新完毕时触发
  //每次组件数据变更的时候都会调用。
  didUpdate(prevProps, prevData) { },
  //组件删除时触发
  //每当组件实例从页面卸载的时候都会触发此回调。
  didUnmount() { },
  methods: {
    // 获取数据详情
    getDetail() {
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: logServer.API_LOG_LIST,
          showLoading: false,
          data: {
            "logType": this.data.logType,//	日志类型 0普通1重大事件
            // "projectId": "12019020001" //项目id
            "projectId": this.props.projectId //项目id
          },
          success: res => {
            console.log('res.data', res.data)
            this.setData({
              logList: res.data
            });
            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })

    },
    // 点击切换
    handleChange(value, items, e) {
      this.setData({
        logType: value,
      });
      this.getDetail()
      console.log(value, items, e);
    },
    // 点击全文/收起
    expandedIt(e) {
      // console.log('全文', e)
      let index1 = e.target.dataset.index1
      let index2 = e.target.dataset.index2
      let index3 = e.target.dataset.index3
      // let expandedAll = e.target.dataset.expandedAll
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
    // }
  },
});
