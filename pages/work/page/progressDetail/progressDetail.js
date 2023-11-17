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
    flagNode: '',//是否为里程碑节点
  },
  onLoad(query) {
    console.log('query', query)
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
    this.setData({
      projectId: query.id,
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
    this.getList()
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
      // "projectId": this.data.projectId,
      "projectId": '12019020004',
      'flagNode': this.data.flagNode
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