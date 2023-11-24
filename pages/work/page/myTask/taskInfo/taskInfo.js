import workServer from "../../../../../server/workServer/index";
import request from "../../../../../utils/request"
import ddUtils from "../../../../../utils/ddUtils"
const app = getApp();

Page({
  data: {
    navbarData:{
      title: "任务详情"
    },
    tabs: [
      {
        title:"任务信息",
      },{
        title:"任务完成情况",
      }
    ],
    app,
    activeTab:0,
    executer_dictText: "",
    infoData:{},
    executeUser:[],
    annexList:[],
    currentId:null,
    uploadImageList:null
  },
  onLoad(option) {
      this.getInfo(option.id);
      this.setData({
        currentId:option.id
      })
    },
    onSaveUploadTenderImgRef(ref) {
      this.uploadImageList = ref;
    },
  getInfo(id) {
    request.doPostRequest({
      url:  workServer.API_READ_TASK,
      data: { id,isRead: 1 },
      success: res => {
        console.log(res);
      }
    })
    request.doPostRequest({
      url: workServer.API_SELECT_TASK,
      data: { id },
      success: res => {
        res.data.subMissionList = res.data.subMissionList.map(e => {
          return{
            ...e,
            executer_dictText:JSON.parse(e.executeUser).map(i => i.username).toString() 
          }
        });
        this.setData({
          infoData:res.data,
          annexList:res.data.missionFileList,
          executer_dictText:JSON.parse(res.data.executeUser).map(e => e.username).toString()
        })
        console.log(this.data.infoData);
       const files= res.data.missionFileList.map((item)=>{
          return {
            ...item,
            name:item.fileName,
            url:item.fileUrl
          }
        })
        setTimeout(() => {
          this.uploadImageList._setImageList( files );
        }, 0);
      }
    });
  },
  handleTask(){
    if(this.data.infoData.missionId==='0'){
      const execute=()=>{
      let executeUsers=this.data.infoData.subMissionList.filter(item=> item.taskStatus!==4) 
      const executeNames=executeUsers.map(item=> {return JSON.parse(item.executeUser)[0].username})
      console.log(executeUsers,executeNames);
      return executeNames.join(',')
      }
      ddUtils.showModal({
        title:"完成任务",
        content: `确认后，未完成人：${execute()}的协作状态设置为已完成，且各协作人无法更改任务详情`,
        success: res => {
          if (res.confirm) {
            request.doPostRequest({
              url:workServer.API_FINISH_TASK,
              data: {id:this.data.currentId},
              success: res => {
                if (res.code===1000) {
                  ddUtils.showToast({
                    title: "操作成功！"
                  });
                }
               ddUtils.navigateBack();
              }
            });
          }
        }
      });
    }else{
      ddUtils.navigateTo({
        url: `/pages/work/page/myTask/taskHandleInfo/taskHandleInfo?json=${this.data.currentId}`
      });
    }
  },
  editTask(){
    const params={
      id:this.data.currentId
    }
    ddUtils.navigateTo({
      url: `/pages/work/page/myTask/taskAdd/taskAdd?json=${JSON.stringify(params)}`
    });
  },
  cancelTask(){
    ddUtils.showModal({
      content: "确认取消吗?",
      success: res => {
        if (res.confirm) {
          request.doPostRequest({
            url: workServer.API_CANCEL_TASK,
            data:{
              id:this.data.currentId
            } ,
            success: () => {
              if(res.code===1000){
                ddUtils.showToast({
                  title: "取消成功！"
                }); 
              }
             ddUtils.navigateBack();
            }
          })
        }
      }
    });
  },
  onTaskChange(e){
    this.setData({
      activeTab:e
    })
  },
  delete(e){
    if(this.data.infoData.subMissionList.length===1){
      ddUtils.showToast({
        title: "至少有一个执行人！不可删除"
      });
      return
    }
    ddUtils.showModal({
      content: "确认删除吗?",
      success: res => {
        if (res.confirm) {
          const params={
            id: e.currentTarget.dataset.item.id
          }
          request.doPostRequest({
            url: workServer.API_DELETE_TASK,
            data:params,
            success: res => {
              if(res.code===1000){
                ddUtils.showToast({
                  title: "删除成功！"
                });
                this.getInfo(this.data.currentId)
              }
            }
          })
        }
      }
    });
  },
  remind(e){
    const params={
      executeUserId: e.currentTarget.dataset.item.executeUserId,
      id: e.currentTarget.dataset.item.id
    }
    request.doPostRequest({
      url: workServer.API_REMIND_TASK,
      data:params,
      success: res => {
        if(res.code===1000){
          ddUtils.showToast({
            title: "提醒成功！"
          });
        }
      }
    })
  },
  download(e){
    const missionFileList=e.currentTarget.dataset.item.missionFileList
    if(missionFileList.length===0){
      ddUtils.showToast({
        title: "没有可供下载的文件！"
      });
      return
    }else{
      missionFileList.map(item=>{
        dd.saveFileToDingTalk({
          name:item.fileName,
          url:item.fileUrl,
          success: (res) => {
            console.log(res);
            // const { data } = res;
          },
          fail: () => {},
          complete: () => {},
        });
      })
    } 
  }
});
