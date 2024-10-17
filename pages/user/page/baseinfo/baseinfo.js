import ddUtils from "../../../../utils/ddUtils"
import {  isEqual,  isEmptyArray} from "../../../../utils/utils"
import userServer from "../../../../server/userServer"
import request from "../../../../utils/request"
import progressServer from "../../../../server/workServer/progressServer";
const app = getApp();

Page({
  data: {
    navbarData: {
      title: "个人信息",
    },
    username: '',
    deptName: "",
    station: "",
    mobile: '',
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
            mobile: res.data.mobile,
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
  },
  callMobile(e) {
    console.log('e', e, this.data.userId, app.globalData.userInfo)
    if(this.data.userId === app.globalData.userInfo.userId) {
      ddUtils.showToast({
        title: '不支持拨打自己的号码'
      });
      return
    }
    // ddUtils.makePhoneCall({phoneNumber: this.data.mobile});
    ddUtils.showModal({
      title:  `您即将呼叫: ${this.data.username}？`,
      content: "请确认",
      success: res => {
        if (res.confirm) {
          console.log('确认：', this.data.userId);
            return new Promise((resolve, reject) => {
              request.doPostRequest({
                url: progressServer.API_CALL_CODE,
                showLoading: true,
                data: {
                  "userId": this.data.userId
                },
                success: res => {
                  console.log('res.data', res.data)
                  dd.callUsers({
                    users: [res.data.dingTalkId],
                    // users: ['01460242357481712'],
                    corpId: 'ding1d9d54bb1a36aca6f5bf40eda33b7ba0',
                    success: () => { },
                    fail: (res) => {
                      console.log(res)
                      ddUtils.showToast({
                        title: 'errorCode：' + res.error + ',' + res.errorMessage
                      });
                    },
                    complete: () => { },
                  });

                },
                fail: res => {
                  reject(res)
                }
              });
            })
        }
      }
    })
  },
});