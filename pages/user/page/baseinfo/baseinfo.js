import ddUtils from "../../../../utils/ddUtils"

import {
  isEqual,
  isEmptyArray
} from "../../../../utils/utils"
// import ddUtils from "../../../../utils/ddUtils"
import userServer from "../../../../server/userServer"
import request from "../../../../utils/request"

const app = getApp();



Page({
  data: {
    navbarData: {
      title: "个人信息",
    },
    username: '',
    deptName: "",
    station: "",
    projectList: [],

  },
  onLoad(query) {
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    this.getList()
    this.getInProjectfunction()
  },
  // 获取基本信息
  getList: function () {
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: userServer.API_BASE_INFO,
        showLoading: true,
        data: {
          userId: app.globalData.userInfo.userId
        },
        success: res => {
          // console.log('res.data', res.data)
          this.setData({
            username: res.data.username,
            deptName: res.data.deptName,
            station: res.data.station,
          });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })
  },
  // 获取在职项目
  getInProjectfunction() {
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: userServer.API_IN_PROJECT,
        showLoading: false,
        data: {
          "pageNum": 1,
          "pageSize": 100,
          // "userId": '1'
          "userId": app.globalData.userInfo.userId
        },
        success: res => {
          console.log('res.data我是在职项目', res.data)
          this.setData({
            projectList: res.data.records,
          });
          console.log('projectList', this.data.projectList)
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })
  }
});