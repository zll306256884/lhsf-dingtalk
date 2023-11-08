import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"

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
    current: 0,
    infoData: {}
  },
  uploadContractImage:null,
  onLoad(option) {
    if(option.id){
      this.getDetail(option.id)
    }
  },
  onSaveUploadContractImgRef(ref){
    this.uploadContractImage = ref
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
