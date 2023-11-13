import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"

Page({
  data: {
    navbarData: {
      title: "招标文件详情"
    },
    items: [
      {
        title:"详细信息",
      },{
        title:"审批记录",
      }
    ],
    requestType: null,
    current: 0,
    detailInfo: {},
    tenderId: null,
    examineId: null
  },
  onLoad(options) {
    if(options.examineId){//审批
      this.setData({
        examineId: options.examineId
      })
    }
    if(options.requestType){//我的请求
      this.setData({
        requestType: options.requestType
      })
    }
    if(options.id){
      this.setData({
        tenderId: options.id
      })
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
  //删除
  deletThis(){

  },
  //编辑
  editThis(){
    ddUtils.navigateTo({
      url: `/pages/work/page/bidDocumentCreatAndEdit/bidDocumentCreatAndEdit?id=${this.data.tenderId}`
    });
  },
  //撤回申请
  withdrawApplication(){
    request.doPostRequest({
      url: workService.API_JFLOWAUDIT_SELET_INFO,
      data: {keyId: this.data.contractId},
      success: res => {
        console.log(res.data)
        let params = {
          account: res.data.account,
          no: res.data.jflowNo,
          workId: res.data.jflowWorkid
        }
        request.doPostRequest({
          url: workService.API_AUDIT_WITHDRAW,
          data: params,
          success: res => {
            console.log(res.data)
            ddUtils.showToast({
              title: "操作成功"
            });
            ddUtils.navigateBack();
          }
        })
      }
    })
  }
});
