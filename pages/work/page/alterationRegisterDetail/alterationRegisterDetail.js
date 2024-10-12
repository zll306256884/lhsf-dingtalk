import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
const app = getApp();
Page({
  data: {
    navbarData: {
      title: "工程联系单",
  },
  infoData:{},
  userId:'',
  id:'',
  keyId:'',
  type:true,
  dingTalkFormList: [],
  },
  uploadContractImage: null,
  uploadTenderImageList: null,//变更小组会议纪要
  uploadOtherImgList: null,//变更内容
  onLoad(option) {
    console.log(option);
    if(option.id){
      this.getDetail(option.id)
    }
    this.setData({
      id:option.id,
      type:option.type || true,
      keyId:option.keyId,
      userId:app.globalData.userInfo.userId
    })
    
  },
  onSaveUploadContractImgRef(ref){
    this.uploadContractImage = ref
  },
  onSaveUploadSummaryRef: function (ref) {
    this.uploadTenderImageList = ref;
  },
  onSaveUploadAlterRef: function(ref){
     this.uploadOtherImgList = ref
  },
  onShow(){
    this.getDetail(this.data.id)
  },
  onSelectInfo(e) {
    let string=e.target.dataset.value
    switch (string) {
      case 'project':
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${this.data.infoData.projectId}`
        });
      break;
      case 'leader':
        ddUtils.navigateTo({
          url: `/pages/user/page/baseinfo/baseinfo?id=${this.data.infoData.projectLeaderId}`
        });
      break;
      case 'contract':
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${this.data.infoData.contractId}`
        }); 
      break;

    }
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
        let dingTalkFormList = [
          { key:'事项类型：', value: '工程联系单' },
          { key:'所属项目：', value: res.data.projectName },
          { key:'合同名称：', value: res.data.contractName },
          { key:'合同金额', value: res.data.contractAmount + '万元' },
          { key:'变更金额', value: res.data.changeAmount + '万元' },
        ]
        this.setData({
          dingTalkFormList
        })
        const files= res.data.investmentFileList.map((item)=>{
          return {
            ...item,
            name:item.fileName,
          }
        })
        const summaryFiles = res.data.summaryFileList.map((item) => {
          return {
            ...item,
            name: item.fileName,
          }
        })
        const alterFiles = res.data.alterFileList.map((item) => {
          return {
            ...item,
            name: item.fileName,
          }
        })
        setTimeout(() => {
          this.uploadContractImage._setImageList(files)
          this.uploadTenderImageList._setImageList(summaryFiles)
          this.uploadOtherImgList._setImageList(alterFiles)
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
