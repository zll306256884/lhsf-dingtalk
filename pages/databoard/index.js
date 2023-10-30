import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from '../../utils/ddUtils'
import ddTimer from '../../utils/ddTimer'

Page({
  data: {
    visibel:false,
  },
  filterRef:null,
  onLoad() {
  },
  onSavefilterRef:function (ref) {
    this.filterRef = ref;
  },
  tapName(e){
    ddTimer.chooseDateTime('{y}-{m}-{d} {h}:{i}:{s}').then(res=>{
    console.log(res);
    })
    // ddUtils.showModal({
    //   title:"确认删除所选数据?",
    //   content: "删除后不可恢复，请确认",
    //   success: res => {
    //     if (res.confirm) {
    //     console.log(e);
    //     }
    //   }
    // });
    // this.setData({
    //   visibel:true
    // })
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