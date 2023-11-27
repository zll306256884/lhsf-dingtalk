import { isEqual, isEmptyArray } from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import userServer from "../../../../server/userServer"
import request from "../../../../utils/request"
import config from "../../../../utils/config"

const app = getApp();

Page({
    data: {
        navbarData: {
            title: "授权登录",
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
        ddUtils.showLoading();
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
                        this.getPermissionByToken()
                        
                    },
                    fail: res => {
                        ddUtils.hideLoading();
                    },
                });
            },
            fail: () => {
                ddUtils.hideLoading();
            },
        });
    },
    getAllInfo: function () {
        Promise
            .all([this.getUserInfo(), this.getMyProjectList()])
            .then(results => {
                ddUtils.hideLoading();
                if (results.length != 2) return;
                let tempUserInfo = results[0] || {};
                let tempProjectList = results[1].records || [];
                let defaultPeoject;

                for (let item of tempProjectList) {
                    if (isEqual(item.flagDefault, '1')) {
                        defaultPeoject = item;
                        break;
                    }
                }

                if (!defaultPeoject && !isEmptyArray(tempProjectList))
                    defaultPeoject = tempProjectList[0];
                    app.globalData.userInfo.userAccount = tempUserInfo.account;
                    app.globalData.userInfo.userId = tempUserInfo.userId;
                    app.globalData.userInfo.avatar = tempUserInfo.avatar;
                    app.globalData.userInfo.nickName = tempUserInfo.name;
                    app.globalData.userInfo.sex = "";
                    app.globalData.userInfo.projectId = defaultPeoject ? defaultPeoject.projectId : '';
                    app.globalData.userInfo.projectName = defaultPeoject ? defaultPeoject.projectName : '';
                    ddUtils.setStorage({
                        key: app.globalData.keyUserInfo,
                        data: app.globalData.userInfo
                    });
                    ddUtils.switchTab({
                        url: "/pages/work/index"
                    });
            }).catch((error) => {
                ddUtils.hideLoading();
                app.globalData.userInfo = {};
            });
    },

    getUserInfo: function () {
      console.log('app.globalData.userInfo.userToken',app.globalData.userInfo.userToken);
        return new Promise((resolve, reject) => {
            request.doPostRequest({
                url: userServer.API_GET_USER_INFO + `?token=${app.globalData.userInfo.userToken}`,
                showLoading: false,
                data: {
                    projectId: app.globalData.userInfo.projectId
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

    getMyProjectList: function () {
        return new Promise((resolve, reject) => {
            request.doPostRequest({

                url: userServer.API_PROJECT_LIST,
                showLoading: false,
                data: {
                    pageNum: 1,
                    pageSize: 999,
                    params: {
                        projectName: ""
                    },
                },
                success: res => {
                  console.log("???????????",res);
                    resolve(res.data)
                },
                fail: res => {
                    reject(res)
                }
            });
        })
    },
    getProjectList(){
      request.doPostRequest({
        url: config.API_PROJECT_NAME,
        success: res => {
          res.data.forEach(e => {
            e.label = e.name
            e.value = e.id
          })
          app.globalData.userInfo.projectList=res.data || []
        }
      })
    },
    getPermissionByToken(){
      request.doPostRequest({
        url: config.API_MENU_LIST,
        success: res => {
          console.log('菜单',res)
          let list = res.data.find(e =>e.title === '移动端') || {}
          app.globalData.menuList = list
          ddUtils.setStorage({
            key: app.globalData.buttonList,
            data: list
          });
        }
      })
    }
});
