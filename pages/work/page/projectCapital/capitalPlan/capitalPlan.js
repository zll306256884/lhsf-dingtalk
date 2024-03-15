import request from "../../../../../utils/request"
import apiApprovalMessage from "../../../../../server/workServer/addInvestment"
import ddUtils from "../../../../../utils/ddUtils"
Page({
  data: {
    navbarData: {
      title: "资金计划",
    },
    monthAnnualFundPlanId:"",
    projectName:"",
    title:"",
    isShow:0,
    annualCumulativePlanPaymentAmount:"",
    yearAnnualFundPlanTotal:"",
    items: [
      {
        title:"资金计划",
      
      },{
        title:"附件",
      
      }
    ],
    recordList:[],
    planType: 2
  },
  uploadImgRef:null,
  onLoad(option) {
    let op = JSON.parse(option.json)
     console.log(op,1111111111);
   this.data.monthAnnualFundPlanId=op.keyId
   console.log(this.data.monthAnnualFundPlanId);
   this.titleMessage(0)
   this.planDetailsList(0)
  },
  onQueryChange(e) {
    this.setData({
      isShow:e
    })
    switch (e) {
      case 0:
        this.titleMessage(0)
        this.planDetailsList(0)
        break;
        case 1:
          this.getAccessory()
          break;
    }
  },
  titleMessage:function(status){
    let data = {
      monthAnnualFundPlanId:this.data.monthAnnualFundPlanId
    };
    request.doPostRequest({
      url: apiApprovalMessage.API_PROJECT_DETAILS_POST,
      data,
      success: res => {
        this.setData({
          projectName:res.data.projectName,
          title:res.data.title,
          annualCumulativePlanPaymentAmount:res.data.annualCumulativePlanPaymentAmount,
          yearAnnualFundPlanTotal:res.data.yearAnnualFundPlanTotal,
          planType: res.data.planType
        })
        console.log(res.data);
      },
    });
  },
  // 上传
onSaveUploadImgRef: function (ref) {
  console.log(ref,232323232323);
  this.uploadImgRef = ref;
},
//  年资金使用计划月计划详细详情
   planDetailsList:function(){
    let data = {
      monthAnnualFundPlanId:this.data.monthAnnualFundPlanId
    };
    request.doPostRequest({
      url: apiApprovalMessage.API_PROJECT_DELS_POST,
      data,
      success: res => {
        this.setData({
          recordList:res.data
        })
        console.log(res.data);
      },
    });
   },
   getAccessory(){
    let data = {
      keyId:this.data.monthAnnualFundPlanId,
      pageNum:1,
      pageSize:10

    };
    request.doPostRequest({
      url: apiApprovalMessage.API_ASSESSORY_POST,
      data,
      success: res => {
        this.setData({
          recordList:res.data
        })
        const files= res.data.records.map((item)=>{
          return {
            ...item,
            name:item.fileName,
          }
        })
        setTimeout(() => {
          this.uploadImgRef._setImageList(files) 
        }, 0);
        
      },
      
    });
//     let investmentFileList = [], temFileList=[]
// if (this.uploadImgRef) {
//   temFileList = this.uploadImgRef.data.imgList;
//   console.log(temFileList);
// for (let item of temFileList) {
//   investmentFileList.push({
//       type: 0,
//       fileName: item.name,
//       size: item.size,
//       url: item.url,
//   })
// }
// }
   },
   click:function(value){
     console.log(value);
     let item = value.target.dataset.item
    ddUtils.navigateTo({
      url: `/pages/work/page/projectCapital/fundParticulars/fundParticulars?json=${JSON.stringify(item)}`
    });
     console.log(item,"click");
   }
});
