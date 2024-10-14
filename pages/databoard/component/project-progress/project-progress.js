const app = getApp();

import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import progressServer from "../../../../server/workServer/progressServer";

Component({
  mixins: [],
  data: {
    navbarData: {
      title: "进度计划详情",
    },
    listData: [1, 2, 3, 4, 5],
    // projectId: '12019020004',//项目id
    flagNode: '',//是否为里程碑节点
    planType: null,//前期计划、施工计划
    status: '',//筛选的状态
    // new
    currentOpen: -1,
    items: [
      {
        title: '全部',
        options: [
          // {
          //   text: '全部',
          //   value: '',
          // },
          // {
          //   text: '延期',
          //   value: 3,
          // },
          // {
          //   text: '进行中',
          //   value: 2,
          // },
          // {
          //   text: '未开始',
          //   value: 1,
          // },
          // {
          //   text: '已完成',
          //   value: 4,
          // },
          { text: '全部', value: null, },
          { text: '前期进度计划', value: 1, },
          { text: '施工进度计划', value: 2, },
          // { text: '未开始', value: 0, },
          // { text: '进行中', value: 1, },
          // { text: '延期未开始', value: 2, },
          // { text: '延期未完成', value: 3, },
          // { text: '延期完成', value: 4, },
          // { text: '已完成', value: 5, },
        ],
      },
      {
        title: '里程碑节点',
        options: [
          // {
          //   text: '选项一',
          //   value: '1',
          // },
          // {
          //   text: '选项二',
          //   value: '2',
          // },
          // {
          //   text: '选项三',
          //   value: '3',
          // },
        ],
      },
    ],
    tabText: '横道图',
    webViewUrl: config.BASE_API_HOST+'/#/share/gantt'
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
    // 二级选项更改
    handleChange(value, items, e) {
      console.log(value, items, e, 1);
      // this.data.status = value
      // this.setData({ status: value });
      this.setData({ planType: value });
      this.getList()
      // this.data.currentOpen = -1;
      this.setData({ currentOpen: -1 });
    },
    // 一级选项更改
    onTapItem(e) {
      // console.log(e, 2);
      // console.log(e.currentTarget.dataset.index);
      const { index } = e.target.dataset;
      if (index === 1) {
        this.milestoneNode(e)
      }
      console.log('index', index);
      const { currentOpen } = this.data;
      let value = index;
      if (currentOpen === index) {
        value = -1;
      }
      this.setData({ currentOpen: value });

    },
    // 获取基本信息
    getList: function () {
      let param = {
        "projectId": this.props.projectId,
        // 'status': this.data.status,
        'flagNode': this.data.flagNode,
        'planType': this.data.planType,
        'enable': 1,
        'clientType':2
      }
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: progressServer.API_PROGRESS_LIST,
          showLoading: false,
          data: param,
          success: res => {
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
    // 横道图和进度监控切换
    handleTabChange() {
      if(this.data.tabText === '横道图') {
        ddUtils.navigateTo({
          url: `/pages/databoard/page/gantt/gantt?projectId=${this.props.projectId}`
        });
        // this.setData({
        //   tabText: '进度监控'
        // })
        // this.setData({
        //   webViewUrl: `${config.BASE_API_HOST}/#/share/gantt?projectId=${this.props.projectId}`
        // }) //http://192.168.6.41/#/share/gantt?projectId=12019020001&type=miniProgram
        // this.webViewContext = dd.createWebViewContext('web-view-1')
        // this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
        // console.log('this.setData.webViewUrl',this.data.webViewUrl, config.BASE_API_HOST, app.globalData.userInfo.userToken)
      } else {
        this.setData({
          tabText: '横道图'
        })
      }
    },
    onMessage:function(e) {
      console.log('接受消息',e.detail)
      dd.navigateBack()
      return
    },

  },
});
