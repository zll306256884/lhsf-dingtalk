
import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from "../../utils/ddUtils"
Page({
 data:{
  navbarData: {
    title: "消息",
},
current: 0,
items: [
  {
    title:"全部",
  
  },{
    title:"已读",
  
  },{
    title:"未读",
  },
],
 MessageList:[],
 },
 onLoad(){
  this.getMessageList(0)
 },
 // 切换我的请求tab
 onQueryChange(e) {
  switch (e) {
    case 0:
      this.getMessageList(0)
      break;
    case 1:
      this.getMessageList(1)
      break;
      case 2:
        this.getMessageList(2)
        break;
  }
 },
 //消息
 getMessageList:function(s){
  let data = {
    pageNum: 1,
    pageSize: 13,
    "status": s,
  };
  request.doPostRequest({
    url: apiApprovalManage.API_MESSAGE_POST,
    data,
    success: res => {
      this.setData({
        MessageList: res.data.records
      })
      console.log(res);
    },
  });
 },
 // 消息列表点击详情
 selectTap(e){
   console.log(e);
   let item = e.target.dataset.item
   let pId = JSON.parse(item.urlParameter)
   let ID = e.target.dataset.item.belongModule
   request.doPostRequest({
    url: apiApprovalManage.API_MESSAGE_READ_TASK,
    data:{id:item.id},
    success: res => {
      console.log(res);
    },
  });
  this.getMessageList(0)
   switch (ID) {
      case 4:
        ddUtils.navigateTo({
          url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${pId.id}&showType=${1}&projectId=${item.projectId}`
        });
        break;
        case 10:
          ddUtils.navigateTo({
            url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${item.keyId}&type=${false}`
          });
          break;
   }
 }
});
