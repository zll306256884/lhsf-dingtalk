import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
Page({
  data: {
    navbarData: {
      title: "工程联系单",
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
      url: confing.API_ALTER_DETAIL_POST ,
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
      url: `/pages/work/page/alterationRegister/alterationRegister??id=${this.data.id}`
    }); 
  }
});
