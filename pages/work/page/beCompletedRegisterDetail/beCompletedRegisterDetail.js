import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
Page({
  data: {
    navbarData: {
      title: "竣工结算登记",
  },
  infoData:{},
  id:'',
  },
  uploadContractImage: null,
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
  getDetail(tenderId){
    request.doPostRequest({
      url: confing.API_BE_DETAIL_POST ,
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
  editTap:function(){
    ddUtils.navigateTo({
      url: `/pages/work/page/beCompletedRegister/beCompletedRegister??id=${this.data.id}&sort=${1}`
    }); 
  }
});
