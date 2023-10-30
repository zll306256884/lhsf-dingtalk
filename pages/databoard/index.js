import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"

Page({
  data: {
    visibel:false,
  },
  filterRef:null,
  onLoad() {
  },
  onSavefilterRef:function (ref) {
    console.log("ref",ref);
    this.filterRef = ref;
  },
  tapName(e){
    this.setData({
      visibel:true
    })
  },
  onDialog(data){
    this.setData({
      visibel:data
    })
  },
  onBindSureTap(form){
    console.log(form);
    this.onDialog(false)
  }
});