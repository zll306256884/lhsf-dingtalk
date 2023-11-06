import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from '../../utils/ddUtils'
import ddTimer from '../../utils/ddTimer'

Page({
  data: {
    visibel:false,
  },
  dialogScreenDateRef:null,
  onLoad() {
  },
  _onSaveDialogScreenDateRef:function (ref) {
    this.dialogScreenDateRef = ref;
  },
  tapName(e){
  },
  _bindScreenDateCallBack(data){
    console.log(data);

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