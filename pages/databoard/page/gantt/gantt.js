const app = getApp();
import config from "../../../../utils/config";
Page({
  data: {
    webViewUrl: config.BASE_API_HOST + '/#/share/gantt'
  },
  onLoad(option) {
    console.log('optiongantt', option);
    this.setData({
      webViewUrl: `${config.BASE_API_HOST}/#/share/gantt?projectId=${option.projectId}`
    }) //http://192.168.6.41/#/share/gantt?projectId=12019020001
    this.webViewContext = dd.createWebViewContext('web-view-1')
    this.webViewContext.postMessage({ tokenStr: app.globalData.userInfo.userToken })
    console.log('this.setData.webViewUrl', this.data.webViewUrl, config.BASE_API_HOST, app.globalData.userInfo.userToken)
  },
  onMessage: function (e) {
    console.log('接受消息', e.detail)
    dd.navigateBack()
    return
  },
});
