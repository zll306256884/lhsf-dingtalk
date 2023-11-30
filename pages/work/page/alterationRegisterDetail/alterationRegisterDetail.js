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
  keyId:'',
  type:true
  },
  uploadContractImage: null,
  onLoad(option) {
    console.log(option);
    if(option.id){
      this.getDetail(option.id)
    }
    this.setData({
      id:option.id,
      type:option.type || true,
      keyId:option.keyId
    })
  },
  onSaveUploadContractImgRef(ref){
    this.uploadContractImage = ref
  },
  onShow(){
    this.getDetail(this.data.id)
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
        const files= res.data.investmentFileList.map((item)=>{
          return {
            ...item,
            name:item.fileName,
          }
        })
        setTimeout(() => {
          this.uploadContractImage._setImageList(files) 
        }, 0);
        // setTimeout(() => {
        //   this.uploadContractImage._setImageList(res.data.investmentFileList?res.data.investmentFileList:'') 
        // }, 0);
      }
    })
  },
  // 删除
  bindCancelTap(){
    ddUtils.showModal({
      content: "确认删除吗?",
      success: res => {
        if (res.confirm) {
          request.doPostRequest({
            url: confing.API_DELETE_POST,
            data: { ids: [this.data.keyId] },
            success: (res) => {
              if(res.message==="成功"){
                ddUtils.showToast({
                  title: "操作成功"
                })
              }
              // let pages = getCurrentPages(); //获取加载的页面
              // let page = pages[pages.length - 2];
              // page.rightFrPage._getRecordList()
              setTimeout(()=>{
              ddUtils.navigateBack()
              },500)
            }
          })
        }
      }
    });
  },
  editTap:function(){
    ddUtils.navigateTo({
      url: `/pages/work/page/alterationRegister/alterationRegister??id=${this.data.id}&sort=${1}`
    }); 
  }
});
