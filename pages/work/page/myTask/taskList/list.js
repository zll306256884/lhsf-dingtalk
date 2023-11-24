import request from "../../../../../utils/request"
import apiApprovalManage from "../../../../../server/workServer"
import ddUtils from "../../../../../utils/ddUtils"
import { isHasMore } from "../../../../../utils/utils"

const app = getApp();

Page({
  data: {
    navbarData:{
      title: "我的任务",
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
  },
  page: 1,
  // hasMore: false,
  // isLoading: false,
  onLoad(option) {
    this.setData({
      currentTask:Number(option.tabIndex)
    })
  },
  onShow(){
   this.onTaskChange(this.data.currentTask)
  },
  onReachBottom() {
  let params={
    executeUserId:"",
    createById:"",
    title:this.data.taskTitle,
    status:[1,2,5]
  }
  switch (this.data.currentTask) {
    case 0:
      params.executeUserId = app.globalData.userInfo.userId
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
  //获取任务列表
 getTaskList: function (params) {
  let data = {
      pageNum: 1,
      pageSize: 10,
      params:{
        title:params.title,
        createById:params.createById ,//发起人
        executeUserId: params.executeUserId,
        sort:"endTime",
        taskStatus:params.status,//[1,2,5]我发起，4已完成，6已取消
      }
  };
  request.doPostRequest({
      url:apiApprovalManage.API_TASK_LIST,
      data,
      success: res => {
        const list= res.data.records.map(item=>{
          return{
            ...item,
            executer_dictText: JSON.parse(item.executeUser)
            .map(e => e.username)
            .toString(),
          }
        })
        this.setData({
          listTask:list,
          total:res.data.total
        })
      },
  });
},
getMoreList(params) {
  request.doPostRequest({
      url: apiApprovalManage.API_TASK_LIST,
      data: {
          pageNum:this.page + 1,
          pageSize: app.globalData.pageSize,
          params:{
            title:params.title,
            createById:params.createById ,//发起人
            executeUserId: params.executeUserId,
            sort:"endTime",
            taskStatus:params.status,//[1,2,5]我发起，4已完成，6已取消
          }
      },
      success: res => {
          this.page++;
          this.hasMore = isHasMore(res.data.records);
          const list= res.data.records.map(item=>{
            return{
              ...item,
              executer_dictText: JSON.parse(item.executeUser)
              .map(e => e.username)
              .toString(),
            }
          })
          this.setData({
            listTask: this.data.listTask.concat(list || [])
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
    executeUserId:this.data.currentTask === 0? app.globalData.userInfo.userId :"",
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
    executeUserId:"",
    createById:"",
    title:"",
    status:[1,2,5]
  }
  switch (e) {
    case 0:
      params.executeUserId = app.globalData.userInfo.userId
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
    const pramas={
      id:e.currentTarget.dataset.item.id
    }
    ddUtils.navigateTo({
      url: `/pages/work/page/myTask/taskInfo/taskInfo?json=${JSON.stringify(pramas)}`
    });
},
});
