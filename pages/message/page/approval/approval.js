import ddUtils from "../../../../utils/ddUtils"

import {
  isEqual,
  isEmptyArray
} from "../../../../utils/utils"
// import ddUtils from "../../../../utils/ddUtils"
import userServer from "../../../../server/userServer"
import request from "../../../../utils/request"
// import request from "../../../utils/request"

const app = getApp();


Page({
  data: {
    navbarData: {
      title: "我的审批",
    },
    tabIndex: 0,
    tabList: [{
        name: "待办审批",
        value: '1',
        total:100
      },
      {
        name: "已办审批",
        value: '2',
        total:10
      },
      {
        name: "办结审批",
        value: '3',
        total:1
      }
    ],
   
  },
  onLoad(query) {
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    this.getList()
  },
  // tab切换组件
  onNavTabChange: function (index) {
    this.setData({
      tabIndex: index
    });
    let targetValue=this.data.tabList[this.data.tabIndex].value
    console.log('targetValue', targetValue)
  },
  // 跳转
  bindTopItemTap(e) {
    console.log(e.target.dataset.index);
    let code = e.target.dataset.index;
    if (code == 0) {
      // 我的信息
      dd.navigateTo({
        url: './page/baseinfo/baseinfo'
      })
    }
    if (code == 1) {
      // 修改密码
      dd.navigateTo({
        url: './page/editword/editword'
      })
    }
    if (code == 2) {
      // 退出登录
      ddUtils.showActionSheet({
        itemList: ["退出登录"],
        success: res => {
          switch (res.index) {
            case 0:
              ddUtils.clearLoginStorage();

              ddUtils.reLaunch({
                url: "./page/login/index"
              })
              break;
            default:
              break
          }
        }
      });

    }

  },
  // 更改数据示例
  changeName(e) {
    this.setData({
      name: 'dingtalk'
    })
  },
  // 跳转页面示例
  tothePage() {
    dd.navigateTo({
      url: './page/personalinfo/index'
    })
  },
  imageError(e) {
    console.log('image 发生 error 事件，携带值为', e.detail.errMsg);
  },
  onTap(e) {
    console.log('image 发生 tap 事件', e);
  },
  imageLoad(e) {
    console.log('image 加载成功', e);
  },
  onSubmit(e) {
    console.log('onSubmit', e);
    dd.alert({
      content: `你选择的框架是 ${e.detail.value.libs.join(', ')}`,
    });
  },
  onReset(e) {
    console.log('onReset', e);
  },
  onChange(e) {
    console.log(e);
  },
  // 获取基本信息
  getList: function () {
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: userServer.API_BASE_INFO,
        showLoading: false,
        data: {
          userId: app.globalData.userInfo.userId
        },
        success: res => {
          // console.log('res.data', res.data)
          this.setData({
            userInfo: {
              nickName: res.data.username,
              avatar: res.data.headImg,
              mobile: res.data.mobile,
              firstName: res.data.username ? res.data.username.split('')[0] : ''
            },
          });
          console.log('userInfo', this.data.userInfo)
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })

  },
  onOptionData1(data) {
    console.log(data, '子组件触发父组件');
  },
  onNavTabChange: function (index) {
    this.setData({
      tabIndex: index
    });
    let targetValue = this.data.tabList[this.data.tabIndex].value

    console.log('targetValue', targetValue)
  },

});