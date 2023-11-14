import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import progressServer from "../../../../server/workServer/progressServer";

Page({
  data: {
    navbarData: {
      title: "进度任务详情"
    },
    taskId: "",
    listData: []
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
  // 
});
