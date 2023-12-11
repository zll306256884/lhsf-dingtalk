import ddUtils from "../../../../utils/ddUtils"
import userServer from "../../../../server/userServer"
import request from "../../../../utils/request"
import config from "../../../../utils/config"

const app = getApp();

Page({
    data: {
        isLoading:false,
        navbarData: {
            title: "授权登录",
            showNavbarBackHome:false,
        },
    },

    onLoad() {

    },

    onReady() {

    },

    onShow() {
    },

    onHide() {
    },

    onUnload() {
        app.globalData.tokenInvalid = false;
    },

    onTitleClick() {
    },

    onPullDownRefresh() {
    },

    onReachBottom() {
    },

    // 事件处理函数对象
    events: {
        onBack() {
        },
    },
    //bind login tap
    bindAuthLoginTap: function (e) {
      this.setData({
        isLoading:true
      })
        dd.getAuthCode({
            scopes: 'auth_user',
            success: (resAuth) => {
                request.doPostRequest({
                    url: userServer.API_LOGIN,
                    showLoading: false,
                    data: {
                        code: resAuth.authCode
                    },
                    success: res => {
                        let loginData = res.data;
                        app.globalData.userInfo = {};
                        app.globalData.userInfo.userToken = loginData.token;
                        app.globalData.userInfo.mobile = loginData.mobile;
                        app.globalData.userInfo.userId= loginData.userId

                        this.getAllInfo();
                      
                    },
                    fail: res => {
                      this.setData({
                        isLoading:false
                      })
                    },
                    
                });
            },
            fail: () => {
              this.setData({
                isLoading:false
              })
            },
        });
    },
    getAllInfo: function () {
        Promise
            .all([this.getUserInfo(),this.getPermissionByToken()])
            .then(results => {
                if (results.length != 2) return;
                let tempUserInfo = results[0] || {};
                   let list = results[1].find(e =>e.title === '移动端') || {}
                    app.globalData.menuList = list
                    ddUtils.setStorage({
                      key: app.globalData.buttonList,
                      data: list
                    });
                    app.globalData.userInfo.userAccount = tempUserInfo.account;
                    app.globalData.userInfo.avatar = tempUserInfo.avatar;
                    app.globalData.userInfo.nickName = tempUserInfo.name;
                    app.globalData.userInfo.userId= tempUserInfo.userId
                    ddUtils.setStorage({
                        key: app.globalData.keyUserInfo,
                        data: app.globalData.userInfo
                    });
                    
                    this.setData({
                      isLoading:false
                    })
                    ddUtils.switchTab({
                        url: "/pages/work/index"
                    });
            }).catch((error) => {
                app.globalData.userInfo = {};
            });
    },

    getUserInfo: function () {
        return new Promise((resolve, reject) => {
            request.doPostRequest({
                url: userServer.API_GET_USER_INFO + `?token=${app.globalData.userInfo.userToken}`,
                showLoading: false,
                data: {
                    projectId: ""
                },
                success: res => {
                    resolve(res.data)
                },
                fail: res => {
                    reject(res)
                }
            });
        })
    },
    getRoleProjectList(){
      return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: config.API_PROJECT_NAME,
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      })
    })
    },
    getPermissionByToken(){
      return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: config.API_MENU_LIST,
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      })
    })
    }
});
