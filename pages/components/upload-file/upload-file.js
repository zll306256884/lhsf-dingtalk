const app = getApp();
import config from "../../../utils/config";
Page({
  data: {
    navbarData:{
      title: "文件上传"
    },
    webViewUrl: config.BASE_API_HOST+'/#/share/viewFile'//'http://192.168.8.168:8080/#/share/viewFile'
  },
  onLoad(option) {
    console.log(option);
    this.setData({
      webViewUrl: `${config.BASE_API_HOST}/#/share/viewFile?imgList=${option.imgList}`
    })

    if(option.type){
      this.setData({
        webViewUrl: `${config.BASE_API_HOST}/#/share/viewFile?type=${option.type}&imgList=${option.imgList}` 
      })
    }
    this.webViewContext = dd.createWebViewContext('web-view-1')
    this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
    console.log('this.setData.webViewUrl',this.data.webViewUrl, config.BASE_API_HOST)
  },
  onMessage:function(e) {
    let type = 'up'
    console.log('接受消息',e.detail)
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    console.log('prevPage',prevPage)
    
    if(e.detail.type === '1'){
      if(prevPage.uploadTenderImageList.data.imgList){
        prevPage.uploadTenderImageList._setImageList([...prevPage.uploadTenderImageList.data.imgList, ...e.detail.imgList],type)
      }else{
        prevPage.uploadTenderImageList._setImageList(e.detail.imgList,type)
      }
    }else if(e.detail.type === '2'){
      if(prevPage.uploadOtherImgList.data.imgList){
        prevPage.uploadOtherImgList._setImageList([...prevPage.uploadOtherImgList.data.imgList, ...e.detail.imgList ],type)
      }else{
        prevPage.uploadOtherImgList._setImageList(e.detail.imgList,type)
      }
    }else{
      if(prevPage.uploadImageList.data.imgList){
        prevPage.uploadImageList._setImageList([...prevPage.uploadImageList.data.imgList, ...e.detail.imgList],type)
      }else{
        prevPage.uploadImageList._setImageList(e.detail.imgList,type)
      } 
    }
    dd.navigateBack()
  },
});
