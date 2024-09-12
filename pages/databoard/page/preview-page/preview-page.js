const app = getApp();
import config from "../../../../utils/config";

Page({
  data: {
    navbarData:{
      title: "监控预览"
    },
    // webViewUrl: config.BASE_API_HOST+'/#/share/viewFile'//'http://192.168.8.168:8080/#/share/viewFile'
    webViewUrl:config.BASE_API_HOST+'/#/share/monitor'
    // webViewUrl:'http://192.168.8.81:8080/#/share/monitor'
  },
  onLoad(option) {
    console.log(option);
    // return
    // this.setData({
    //   webViewUrl: `${config.BASE_API_HOST}/#/share/viewFile?imgList=${option.imgList}`
    // })

    // if(option.type){
    //   this.setData({
    //     webViewUrl: `${config.BASE_API_HOST}/#/share/viewFile?type=${option.type}&imgList=${option.imgList}` 
    //   })
    // }
    this.setData({
      webViewUrl: `${config.BASE_API_HOST}/#/share/monitor?cameraIndexCode=${option.cameraIndexCode}&source=${option.source}`
      //  webViewUrl: `http://192.168.8.51:8080/#/share/monitor?cameraIndexCode=${encodeURIComponent(option.cameraIndexCode)}&source=${option.source}`
    })
    this.webViewContext = dd.createWebViewContext('web-view-2')
    this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
    console.log('this.setData.webViewUrl',this.data.webViewUrl, config.BASE_API_HOST)
  },
  onMessage:function(e) {
    console.log('接受消息',e.detail)
    dd.navigateBack()
    return
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    console.log('prevPage',prevPage)
    
    if(e.detail.type === '1'){
      if(prevPage.uploadTenderImageList.data.imgList){
        prevPage.uploadTenderImageList._setImageList([...prevPage.uploadTenderImageList.data.imgList, ...e.detail.imgList])
      }else{
        prevPage.uploadTenderImageList._setImageList(e.detail.imgList)
      }
    }else if(e.detail.type === '2'){
      if(prevPage.uploadOtherImgList.data.imgList){
        prevPage.uploadOtherImgList._setImageList([...prevPage.uploadOtherImgList.data.imgList, ...e.detail.imgList ])
      }else{
        prevPage.uploadOtherImgList._setImageList(e.detail.imgList)
      }
    }else{
      if(prevPage.uploadImageList.data.imgList){
        prevPage.uploadImageList._setImageList([...prevPage.uploadImageList.data.imgList, ...e.detail.imgList])
      }else{
        prevPage.uploadImageList._setImageList(e.detail.imgList)
      } 
    }
    dd.navigateBack()
  },
});
