import ddUtils from "../../../../utils/ddUtils"
const app = getApp();
Page({
  data: {
    navbarData: {
      title: "评价记录",
    },
    id:"",
    evaluationList:[]
  },
  onLoad(option) {
    this.setData({
      evaluationList: JSON.parse(option.evaluationList)
    })
    console.log("Ddddd",this.data.evaluationList)
  },

  onShow(){

  },
  JumpIt(e) {
    let data = e.target.dataset.row
    ddUtils.navigateTo({
      url: `/pages/work/page/evaluationDetails/evaluationDetails?id=${data.id}`
    });
   }
});
