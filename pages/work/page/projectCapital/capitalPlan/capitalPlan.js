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
  recordList:[]
  },
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
        })
        console.log(res.data);
      },
    });
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
   click:function(value){
     console.log(value);
     let item = value.target.dataset.item
    ddUtils.navigateTo({
      url: `/pages/work/page/projectCapital/fundParticulars/fundParticulars?json=${JSON.stringify(item)}`
    });
     console.log(item,"click");
   }
});
