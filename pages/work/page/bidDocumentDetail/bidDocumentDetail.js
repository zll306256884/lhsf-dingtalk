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
  onLoad(options) {
    if(options.id){
      this.getDetail(options.id)
    }
  },
  getDetail(tenderId){
    request.doPostRequest({
      url: projectService.API_TENDER_DETAIL,
      data: {id: tenderId},
      success: res => {
        console.log(res.data)
        this.setData({
          detailInfo: res.data
        })
        // setTimeout(() => {
        //   this.uploadTenderImageList._setImageList(res.data.tenderDocumentList?res.data.tenderDocumentList:'') 
        //   this.uploadOtherImgList._setImageList(res.data.otherDocumentList?res.data.otherDocumentList:'') 
        // }, 0);
      }
    })
  },
});
