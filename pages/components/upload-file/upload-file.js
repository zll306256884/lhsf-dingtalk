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
    this.setData({
      webViewUrl: `http://192.168.6.41/#/share/viewFile?imgListLength=${option.imgListLength}`
    })

    if(option.type){
      this.setData({
        webViewUrl: `http://192.168.6.41/#/share/viewFile?type=${option.type}&imgListLength=${option.imgListLength}` 
      })
    }
    this.webViewContext = dd.createWebViewContext('web-view-1')
    this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
  },
  onMessage:function(e) {
    console.log('接受消息',e.detail)
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    console.log('prevPage',prevPage)
    
    if(e.detail.type === '1'){
      if(prevPage.uploadTenderImageList.data.imgList){
        prevPage.uploadTenderImageList._setImageList(prevPage.uploadTenderImageList.data.imgList.concat(e.detail.imgList))
      }else{
        prevPage.uploadTenderImageList._setImageList(e.detail.imgList)
      }
    }else if(e.detail.type === '2'){
      if(prevPage.uploadOtherImgList.data.imgList){
        prevPage.uploadOtherImgList._setImageList(prevPage.uploadOtherImgList.data.imgList.concat(e.detail.imgList))
      }else{
        prevPage.uploadOtherImgList._setImageList(e.detail.imgList)
      }
    }else{
      if(prevPage.uploadImageList.data.imgList){
        prevPage.uploadImageList._setImageList(prevPage.uploadImageList.data.imgList.concat(e.detail.imgList))
      }else{
        prevPage.uploadImageList._setImageList(e.detail.imgList)
      }
    }
    dd.navigateBack()
  },
});
