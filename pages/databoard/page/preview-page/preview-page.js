const app = getApp();
import config from "../../../../utils/config";

Page({
  data: {
    navbarData:{
      title: "监控预览"
    },
    webViewUrl:config.BASE_API_HOST+'/#/share/monitor'
  },
  onLoad(option) {
    this.setData({
      webViewUrl: `${config.BASE_API_HOST}/#/share/monitor?cameraIndexCode=${option.cameraIndexCode}&source=${option.source}`
    })
    this.webViewContext = dd.createWebViewContext('web-view-2')
    this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
  },
  onMessage:function(e) {
    dd.navigateBack()
    return
    // let pages = getCurrentPages()
    // let prevPage = pages[pages.length - 2]
    
    // if(e.detail.type === '1'){
    //   if(prevPage.uploadTenderImageList.data.imgList){
    //     prevPage.uploadTenderImageList._setImageList([...prevPage.uploadTenderImageList.data.imgList, ...e.detail.imgList])
    //   }else{
    //     prevPage.uploadTenderImageList._setImageList(e.detail.imgList)
    //   }
    // }else if(e.detail.type === '2'){
    //   if(prevPage.uploadOtherImgList.data.imgList){
    //     prevPage.uploadOtherImgList._setImageList([...prevPage.uploadOtherImgList.data.imgList, ...e.detail.imgList ])
    //   }else{
    //     prevPage.uploadOtherImgList._setImageList(e.detail.imgList)
    //   }
    // }else{
    //   if(prevPage.uploadImageList.data.imgList){
    //     prevPage.uploadImageList._setImageList([...prevPage.uploadImageList.data.imgList, ...e.detail.imgList])
    //   }else{
    //     prevPage.uploadImageList._setImageList(e.detail.imgList)
    //   } 
    // }
    // dd.navigateBack()
  },
});
