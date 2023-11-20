
import request from "../../../utils/request"
import config  from "../../../server/workServer"
import ddUtils from "../../../utils/ddUtils"
Page({
  data: {
    navbarData: {
      title: "系统公告",
      id:'',
      affiche:{},
  },
  },
  onLoad(option) {
    console.log(option);
    this.setData({
      id:option.id
    })
  },
  onShow(){
    if(this.data.id){
      this.getMessage()
    }
  },
  getMessage(){
    request.doPostRequest({
      url: config.API_NOTICE_MESSAGE,
      data:{id:this.data.id},
      success: res => {
        this.setData({
          affiche:res.data
        })
        console.log(res);
      },
    });
  }
});
