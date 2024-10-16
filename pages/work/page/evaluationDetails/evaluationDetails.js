import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
const app = getApp();
Page({
  data: {
    navbarData: {
      title: "评价详情",
    },
    id:"",
    param:{}
  },
  onLoad(option) {
    this.getDetail(option.id)
  },

  onShow(){

  },
  getDetail(id) {
    request.doPostRequest({
      url: confing.API_QUERY_CURRENT_UNIT_SCORE_DETAIL,
      data: { id: id },
      success: res => {
        this.setData({
          param: res.data
        }) 
      }
    })
  },
});
