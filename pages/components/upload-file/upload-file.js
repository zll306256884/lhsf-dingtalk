const app = getApp();

Page({
  data: {
    navbarData:{
      title: "文件上传"
    },
    webViewUrl: 'http://192.168.6.41/#/share/viewFile'//'http://192.168.8.168:8080/#/share/viewFile'
  },
  onLoad() {
    this.webViewContext = dd.createWebViewContext('web-view-1')
    this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
  },
  onMessage:function(e) {
    console.log('接受消息',e.detail)
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.uploadImageList._setImageList(e.detail.imgList)
    dd.navigateBack()
  },
});
