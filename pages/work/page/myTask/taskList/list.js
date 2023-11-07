import request from "../../../../../utils/request"
import apiApprovalManage from "../../../../../server/workServer"
import ddUtils from "../../../../../utils/ddUtils"
import { isHasMore } from "../../../../../utils/utils"

const app = getApp();

Page({
  data: {
    navbarData:{
      title: "我的任务"
    },
     tabs1: [
      {
        title:"待办任务",
      },{
        title:"我发起的",
      },{
        title:"已完成",
      },{
        title:"已取消",
      }
    ],
    taskTitle:"",
    total:0,
    listTask:[],
    currentTask:0,
    isNeedRefreshList:false
  },
  page: 1,
  // hasMore: false,
  // isLoading: false,
  onLoad() {
    let params={
      createById:"",
      title:"",
      status:[1,2,5]
    }
    this.getTaskList(params)
  },
  onReachBottom() {
  let params={
    createById:"",
    title:"",
    status:[1,2,5]
  }
  switch (this.data.currentTask) {
    case 0:
    break;
    case 1:
      params.createById = app.globalData.userInfo.userId
    break;
    case 2:
      params.status=[4]
    break;
    case 3:
       params.status=[6]
    break;
   }
    this.getMoreList(params);
},
  onShow(){
    if(this.isNeedRefreshList) {
      // this.isNeedRefreshList = false;
      // this.setData({
      //   currentTask:2
      // })
      // let params={
      //   createById:"",
      //   title:"",
      //   status:[4]
      // }
      // this.getTaskList(params)
      this.onTaskChange(2)
  }

  },
  //获取任务列表
 getTaskList: function (params) {
  let data = {
      pageNum: 1,
      pageSize: 10,
      params:{
        title:params.title,
        createById:params.createById ,//发起人
        executeUserId: "" ,
        sort:"endTime",
        taskStatus:params.status,//[1,2,5]我发起，4已完成，6已取消
      }
  };
  request.doPostRequest({
      url:apiApprovalManage.API_TASK_LIST,
      data,
      success: res => {
        this.setData({
          listTask:res.data.records,
          total:res.data.total
        })
      },
  });
},
getMoreList(params) {
  request.doPostRequest({
      url: apiApprovalManage.API_TASK_LIST,
      data: {
          pageNum:this.page,
          pageSize: app.globalData.pageSize,
          params:{
            title:params.title,
            createById:params.createById ,//发起人
            executeUserId: "" ,
            sort:"endTime",
            taskStatus:params.status,//[1,2,5]我发起，4已完成，6已取消
          }
      },
      success: res => {
          this.page++;
          this.hasMore = isHasMore(res.data.records);
          this.setData({
            listTask: this.data.listTask.concat(res.data.records || [])
          });
      },
  });
},
// 任务名称搜索
onChange(value){
  this.setData({
    taskTitle:value
  })
},
// 搜索确认
onConfirm(value){
  this.searchTask(value)
},
searchTask(title){
  let status=()=>{
    if(this.data.currentTask===3){
    return [6]
    }else if(this.data.currentTask===2){
    return [4]
    }else{
    return [1,2,5]
    }
  }
 let params={
    createById:this.data.currentTask === 1? app.globalData.userInfo.userId : "",
    status:status(),
    title,
  }
this.getTaskList(params)
},
// 切换我的任务tab
onTaskChange(e){
  this.setData({
    currentTask:e,
    taskTitle:""
  }) 
  let params={
    createById:"",
    title:"",
    status:[1,2,5]
  }
  switch (e) {
    case 0:
    break;
    case 1:
      params.createById = app.globalData.userInfo.userId
    break;
    case 2:
      params.status=[4]
    break;
    case 3:
       params.status=[6]
    break;
   }
   this.getTaskList(params)
},
addTask(){
  ddUtils.navigateTo({
    url: `/pages/work/page/myTask/taskAdd/taskAdd`
  });
},
selectTaskInfo(e) {
  console.log(e);
  // if(this.data.currentTask===1){
    const pramas={
      id:e.currentTarget.dataset.item.id
    }
    ddUtils.navigateTo({
      url: `/pages/work/page/myTask/taskInfo/taskInfo?json=${JSON.stringify(pramas)}`
    });
  // } 
},
setRefreshList(){
  this.isNeedRefreshList = true
}
});
