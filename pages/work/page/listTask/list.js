import request from "../../../../utils/request"
import apiApprovalManage from "../../../../server/workServer"
import ddUtils from "../../../../utils/ddUtils"
const app = getApp();

Page({
  data: {
     tabs1: [
      {
        title:"待办任务",
        count:0
      },{
        title:"我发起的",
        count:0
      },{
        title:"已完成",
        count:0
      },{
        title:"已取消",
        count:0
      }
    ],
    taskTitle:"",
    listTask:[],
    currentTask:0
  },
  onLoad() {
    this.getTaskList(app.globalData.userInfo.userId,[1,2,5])
  },
  //获取任务列表
 getTaskList: function (createById,status) {
  let data = {
      pageNum: 1,
      pageSize: 10,
      params:{
        title:this.data.taskTitle,
        createById:createById ,//发起人
        executeUserId: "" ,
        sort:"endTime",
        taskStatus:status,//[1,2,5]我发起，4已完成，6已取消
      }
  };
  request.doPostRequest({
      url:apiApprovalManage.API_TASK_LIST,
      data,
      success: res => {
        this.setData({
          listTask:res.data.records
        })
      },
  });
},
// 任务名称搜索
onBlur(value){
  this.setData({
    taskTitle:value
}) 
  this.getTaskList()
},
// 搜索确认
onConfirm(value){
  this.setData({
    taskTitle:value
}) 
  this.getTaskList()
},
// 切换我的任务tab
onTaskChange(e){
  this.setData({
    currentTask:e
}) 
  switch (e) {
    case 0:
    this.getTaskList('',[1,2,5])
    break;
    case 1:
    this.getTaskList(app.globalData.userInfo.userId,[1,2,5])
    break;
    case 2:
    this.getTaskList('',[4])
    break;
    case 3:
    this.getTaskList('',[6])
    break;
   }
},
addTask(){
  ddUtils.navigateTo({
    url: `/pages/work/page/addTask/addTask`
  });
}
});
