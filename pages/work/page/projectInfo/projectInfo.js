import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";

const app = getApp();
Page({
  data: {
    navbarData:{
      title: "新增项目"
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
    //项目红线图
    projectId: null
  },
  onLoad(options) {
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
        this.setData({
          formData: res.data,
          isAccess:{name:this.data.screenFromList.find(e=>e.value === res.data.isAccess).name,value:res.data.isAccess},
          projectClassification:{name:res.data.projectClassification_dictText,value:res.data.projectClassification},
          constructionPhase:{name:res.data.constructionPhase_dictText,value:res.data.constructionPhase},
          isOutPut:{name:this.data.isOutPutOption.find(e=>e.value === res.data.isOutPut).name,value:res.data.isOutPut},
          'outPutTime.shortDate':res.data.outPutTime,
          constructionNature:{name:res.data.constructionNature_dictText,value:res.data.constructionNature},
          engineeringProperties:{name:res.data.engineeringProperties_dictText,value:res.data.engineeringProperties},
        })
        console.log(this.data.isAccess)
      }
    })
  },
});
