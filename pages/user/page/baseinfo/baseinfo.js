import ddUtils from "../../../../utils/ddUtils"
import {  isEqual,  isEmptyArray} from "../../../../utils/utils"
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
    userId:''

  },
  onLoad(option) {
    console.log('参数',option);
    this.setData({userId:option.id})
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
          userId: this.data.userId
        },
        success: res => {
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
          "userId": this.data.userId
        },
        success: res => {
          this.setData({
            projectList: res.data.records,
          });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })
  }
});