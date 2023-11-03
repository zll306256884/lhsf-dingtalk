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
  },
  onLoad(query) {
    console.log('query', query)
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
    this.setData({
      projectId: query.id
    });
    console.log(this.data.projectId);
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
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: progressServer.API_PROGRESS_LIST,
        showLoading: false,
        data: {
          "projectId": this.data.projectId
        },
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
});