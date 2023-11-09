import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import workService from "../../../../server/workServer";
Page({
  data: {
    navbarData: {
      title: "支付申请详情",
  },
    items: [
      {
        title:"详细信息",
      },{
        title:"审批记录",
      }
    ],
    id:"",
    current: 0,
    infoData: {}
  },
  uploadContractImage:null,
  onLoad(option) {
    if(option.id){
      this.getDetail(option.id)
    }
    this.setData({
      id:option.id
    })
  },
  onSaveUploadContractImgRef(ref){
    this.uploadContractImage = ref
  },
  withdrawApplication(){
        request.doPostRequest({
          url: workService.API_JFLOWAUDIT_SELET_INFO,
          data: {keyId: this.data.id},
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
      },
  getDetail(tenderId){
    request.doPostRequest({
      url: confing.API_PAY_DETAIL_POST ,
      data: {id: tenderId},
      success: res => {
        console.log(res.data)
        this.setData({
          infoData: res.data
        })
        setTimeout(() => {
          this.uploadContractImage._setImageList(res.data.investmentFileList?res.data.investmentFileList:'') 
        }, 0);
      }
    })
  },
});
