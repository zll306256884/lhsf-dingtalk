import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import progressServer from "../../../../server/workServer/progressServer";

const app = getApp();

Page({
  data: {
    navbarData: {
      title: "进度计划详情",
    },
    listData: [1, 2, 3, 4, 5],
    projectId: '',
    planType: null,
    flagNode: '',//是否为里程碑节点
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
          // 0-未开始 1-进行中 2-延期未开始 3-延期未完成 4-延期完成 5-已完成
          { text: '全部', value: '', },
          { text: '未开始', value: 0, },
          { text: '进行中', value: 1, },
          { text: '延期未开始', value: 2, },
          { text: '延期未完成', value: 3, },
          { text: '延期完成', value: 4, },
          { text: '已完成', value: 5, },
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

  },
  // 二级选项更改
  handleChange(value, items, e) {
    console.log(value, items, e, 1);
    this.data.status = value
    this.setData({ status: value });
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
  onLoad(query) {
    console.log('query', query)
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
    this.setData({
      projectId: query.id,
      planType: parseInt(query.planType),
      'navbarData.title': query.name,
    });
    console.log(this.data.projectId);

  },
  onShow() {
    // 页面显示
    // getCurrentPages()函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
    // 当页面返回的时候 ，需要调用的函数
    this.getList()
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    // this.getList()
  },
  progressItemRef(e) {
    console.log('我是列表ref', e);
  },
  showIt() {
    console.log(this.selectComponent('#autComponents'))
    // console.log(this.selectComponent('#autComponents'))
  },
  // 获取基本信息
  getList: function () {
    let param = {
      "projectId": this.data.projectId,
      "planType": this.data.planType,
      // "projectId": '12019020004',
      'status': this.data.status,
      'flagNode': this.data.flagNode,
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
});