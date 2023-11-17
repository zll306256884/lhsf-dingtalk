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
    isShow: true,
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
    // 校验
    if (!this.data.isShow) {
      ddUtils.showToast({
        title: "新密码不符合规则"
      });
      return
    }
    if (!this.data.oldPwd) {
      ddUtils.showToast({
        title: "原密码必填"
      });
      return
    }
    if (!this.data.newPwd) {
      ddUtils.showToast({
        title: "新密码必填"
      });
      return
    }
    if (!this.data.confirmPwd) {
      ddUtils.showToast({
        title: "确认密码必填"
      });
      return
    }
    if (!this.data.code) {
      ddUtils.showToast({
        title: "验证码必填"
      });
      return
    }

    if (this.data.newPwd != this.data.confirmPwd) {
      ddUtils.showToast({
        title: "新密码和确认密码不一样"
      });
      return
    }

    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: userServer.API_EDIE_CODE,
        showLoading: false,
        data: param,
        success: res => {
          console.log('res.data', res.data)
          ddUtils.showToast({
            title: "密码修改成功！请使用新密码登录电脑端！"
          });
          ddUtils.navigateBack();
          // this.setData({
          //   verifyImg: res.data.image,
          // });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
          // console.log('失败')
          this.getVerifyCode()
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
    // console.log(data);
    // this.setData({
    //   newPwd: data.value,
    // });
    // console.log('newPwd', this.data.newPwd);
  },
  // 新密码校验
  xmmInputBlur: function (data) {
    // console.log(data.detail.value);
    console.log(data.e.detail.value);
    // let value = data.detail.value
    let value = data.e.detail.value
    if (value === '') {
      ddUtils.showToast({
        title: "请输入新密码"
      });
      return
      // } else if (!/^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{8,}$/.test(value)) {    //可加特殊符号
    } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/.test(value)) { //不可加特殊符号
      // callback(new Error('新密码不符合规范'))
      // this.data.newPwd = ''
      this.setData({
        newPwd: '',
        isShow: false,
      });
      console.log('newPwd--', this.data.newPwd);

      ddUtils.showToast({
        title: "新密码不符合规则"
      });
      return
    } else {
      this.setData({
        newPwd: value,
        isShow: true,
      });
      console.log('newPwd', this.data.newPwd);
    }
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
  // 确认密码校验
  suremmInputBlur: function (data) { },
  // 验证码
  verflyInputChange: function (data) {
    console.log(data);
    this.setData({
      code: data.detail.value,
      // findQuesCount: this.getFindQuesList().length
    });
    console.log('code', this.data.code);
  },
  // 取消
  resetIt() {
    ddUtils.showModal({
      content: "是否退出编辑？退出后不会保存当前编辑内容",
      success: res => {
        if (res.confirm) {
          // this.form.reset();
          ddUtils.navigateBack();
        }
      }
    });
  }

});