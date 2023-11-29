const app = getApp();

Page({
  data: {
    navbarData:{
      title: "文件上传"
    },
    webViewUrl: 'http://192.168.6.41/#/share/viewFile'//'http://192.168.8.168:8080/#/share/viewFile'
  },
  onLoad(option) {
    console.log(option);
    if(option.type){
      this.setData({
        webViewUrl: 'http://192.168.6.41/#/share/viewFile?type='+ option.type
      })
    }
    this.webViewContext = dd.createWebViewContext('web-view-1')
    this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
  },
  onMessage:function(e) {
    console.log('接受消息',e.detail)
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.uploadImageList._setImageList(e.detail.imgList)
    if(e.detail.type === '1'){
      prevPage.uploadTenderImageList._setImageList(e.detail.imgList)
    }else if(e.detail.type === '2'){
      prevPage.uploadOtherImgList._setImageList(e.detail.imgList)
    }
    dd.navigateBack()
  },
});
