import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"
Page({
  data: {
    items: [
      {
        title:"详细信息",
      },{
        title:"审批记录",
      }
    ],
    current: 0,
    detailInfo: {}
  },
  uploadContractImage: null,
  onLoad(options) {
    if(options.id){
      this.getDetail(options.id)
    }
  },
  onSaveUploadContractImgRef(ref){
    this.uploadContractImage = ref
  },
  getDetail(tenderId){
    request.doPostRequest({
      url: projectService.API_CONTRACT_DETAIL,
      data: {id: tenderId},
      success: res => {
        console.log(res.data)
        this.setData({
          detailInfo: res.data
        })
        setTimeout(() => {
          this.uploadContractImage._setImageList(res.data.fileList?res.data.fileList:'') 
        }, 0);
      }
    })
  },
});
