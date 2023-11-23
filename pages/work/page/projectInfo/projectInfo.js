import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";

const app = getApp();
Page({
  data: {
    navbarData:{
      title: "项目详情"
    },
    screenFromList:[
      { name:'否',value:0 },
      { name:'是',value:1 }
    ],
    isOutPutOption: [
      { name:'否',value:'0' },
      { name:'是',value:'1' },
    ],
    formData:{},
    isAccess: {},//考核
    projectClassification: {},//分类
    constructionPhase: {},//建设阶段
    isOutPut: {},//是否投入
    outPutTime: {},//{date: '', shortDate: ''}
    constructionNature: {},//建设性质
    engineeringProperties: {},//工程性质
    //所属单位
    //项目负责人
    uploadImgRefList: null,//项目红线图
    projectId: null,
    requestType: null
  },
  onSaveUploadImgRef: function (ref) {
    this.uploadImgRefList = ref;
    console.log(this.uploadImgRefList)
  },
  onLoad(options) {
    if(options.requestType){
      //我的请求
      this.setData({
        requestType: options.requestType
      })
    }
    if(options.id){
      this.setData({
        projectId: options.id
      })
      this.getDetail(options.id)
    }
  },
  getDetail(id){
    request.doPostRequest({
      url: projectService.API_SELECTPROJECT_INFO_BYID,
      data:{id:id},
      success: res => {
        if(res.data.isAccess=== 0 || res.data.isAccess=== 1){
          this.setData({
            isAccess:{name:this.data.screenFromList.find(e=>e.value === res.data.isAccess).name,value:res.data.isAccess}
          })
        }
        if(res.data.isOutPut){
          this.setData({
            isOutPut:{name:this.data.isOutPutOption.find(e=>e.value === res.data.isOutPut).name,value:res.data.isOutPut}
          })
        }
        this.setData({
          formData: res.data,
          projectClassification:{name:res.data.projectClassification_dictText,value:res.data.projectClassification},
          constructionPhase:{name:res.data.constructionPhase_dictText,value:res.data.constructionPhase},
          outPutTime:{shortDate:res.data.outPutTime},
          constructionNature:{name:res.data.constructionNature_dictText,value:res.data.constructionNature},
          engineeringProperties:{name:res.data.engineeringProperties_dictText,value:res.data.engineeringProperties},
        })
        setTimeout(() => {
          this.uploadImgRefList._setImageList(res.data.projectRedLineList?res.data.projectRedLineList:'') 
        }, 0);
      }
    })
  },
  //删除
  deletThis(){
    
  },
  //编辑
  editThis(){
    ddUtils.navigateTo({
      url: `/pages/work/page/addNewProject/addNewProject?id=${this.data.projectId}`
    });
  },
});
