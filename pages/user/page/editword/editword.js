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
      title: "修改密码",
    },
    verifyImg: '',
    totalNum: '',
    oldPwd: "", //原密码
    newPwd: "", //新密码
    confirmPwd: "", //确认密码
    code: "", //验证码
    imageId: '',
  },
  onLoad(query) {
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    this.getVerifyCode()
    // this.getInProjectfunction()
  },
  // 获取验证码
  getVerifyCode: function () {
    return new Promise((resolve, reject) => {
      request.doGetRequest({
        url: userServer.API_VERIFY_CODE,
        showLoading: false,
        data: {},
        success: res => {
          // console.log('res.data', res.data)
          this.setData({
            verifyImg: res.data.image,
            imageId: res.data.imageId
          });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })
  },
  // 点击保存
  submitIt() {
    console.log(1);
    console.log('totalNum', this.data.totalNum);
    // 
    let param = {
      "code": this.data.code,
      "confirmPwd": this.data.confirmPwd,
      "newPwd": this.data.newPwd,
      "oldPwd": this.data.oldPwd,
      'imageId': this.data.imageId,
    }
    console.log(param)
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: userServer.API_EDIE_CODE,
        showLoading: false,
        data: param,
        success: res => {
          console.log('res.data', res.data)
          ddUtils.showToast({
            title: "操作成功"
          });
          ddUtils.navigateBack();
          // this.setData({
          //   verifyImg: res.data.image,
          // });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })

  },
  //bind input change
  // 原密码
  ymmInputChange: function (data) {
    console.log(data);
    this.setData({
      oldPwd: data.value,
    });
    console.log('oldPwd', this.data.oldPwd);
  },
  // 新密码
  xmmInputChange: function (data) {
    console.log(data);
    this.setData({
      newPwd: data.value,
    });
    console.log('newPwd', this.data.newPwd);
  },
  // 确认密码
  suremmInputChange: function (data) {
    console.log(data);
    this.setData({
      confirmPwd: data.value,
      // findQuesCount: this.getFindQuesList().length
    });
    console.log('confirmPwd', this.data.confirmPwd);
  },
  // 验证码
  verflyInputChange: function (data) {
    console.log(data);
    this.setData({
      code: data.detail.value,
      // findQuesCount: this.getFindQuesList().length
    });
    console.log('code', this.data.code);
  },

});