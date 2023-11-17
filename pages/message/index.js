
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
    total:0,
    badge: true,    
  },
],
 MessageList:[],
 },
 onShow(){
  this.getMessageList(0)
  this.getunReadMessageTotal()
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
    pageSize: 10,
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
 getunReadMessageTotal(){
  request.doPostRequest({
    url: apiApprovalManage.API_UNMESSAGE_TO_POST,
    data:{},
    success: res => {
      console.log(res);
      let list = this.data.items
        console.log(list);
      
        list[2].total =res.data.unReadMessageTotal
        console.log(list);
        this.setData({
          items: list
        })
     
    },
  });
 },
 // 消息列表点击详情
 selectTap(e){
    // 事项类型 1-进度计划 2-招标文件会签 3-合同审批流程 4-款项支付 5-项目资金计划 6-生态伙伴 7-档案管理
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
      case 8:
        if(item.missionDelFlag===1){
          ddUtils.showToast({
            title: "当前任务已删除，无法操作！"
          });
        }else{
          ddUtils.navigateTo({
            url: `/pages/work/page/myTask/taskInfo/taskInfo?json=${JSON.stringify({id:item.keyId})}`
          });
        }   
        break;
    }
  //  type 消息类型（1任务消息，2服务消息，3审批消息，4系统公告）
  //  taskStatus 任务状态（1未激活，2未完成，3已拒绝，4已完成，5已超时，6已取消）
  //  jflowType 审核类型（1通过2驳回3待审核）
  if(item.type === 1){//1任务消息

  }else if(item.type === 2){//2服务消息
    switch (item.belongModule) {
      case 2:
      ddUtils.navigateTo({
        url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${item.keyId}`
      });
        break;
    case 3:
      ddUtils.navigateTo({
        url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.keyId}`
      });
      break;
    }
  }else if(item.type === 3){//3审批消息
    if (item.jflowType === 3) { //通过
      switch (item.belongModule) {
        case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${item.keyId}&id=${item.keyId}&approvalType=1`
        });
          break;
        case 3:
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${item.keyId}&id=${item.keyId}&approvalType=1`
          });
          break;
      }
    }else if(item.jflowType === 2){
      switch (item.belongModule) {
        case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${item.keyId}&id=${item.keyId}&approvalType=2`
        });
          break;
        case 3:
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${item.keyId}&id=${item.keyId}&approvalType=2`
          });
          break;
      }  
   }
  }else if(item.type === 4){//4系统公告

  }
}
});
