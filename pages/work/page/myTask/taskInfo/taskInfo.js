import workServer from "../../../../../server/workServer/index";
import request from "../../../../../utils/request"
import ddUtils from "../../../../../utils/ddUtils"

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
    activeTab:0,
    executer_dictText: "",
    infoData:{},
    executeUser:[],
    annexList:[],
    currentId:null,
    uploadImageList:null
  },
  onLoad(option) {
    const params = JSON.parse(option.json);
      this.getInfo(params.id);
      this.setData({
        currentId:params.id
      })
    },
    onSaveUploadTenderImgRef(ref) {
      this.uploadImageList = ref;
    },
  getInfo(id) {
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
    ddUtils.navigateTo({
      url: `/pages/work/page/myTask/taskHandleInfo/taskHandleInfo?json=${this.data.currentId}`
    });
  },
  onTaskChange(e){
    this.setData({
      activeTab:e
    })
  },
  delete(e){
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
        }
      }
    })
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
    console.log(e);

  }
});
