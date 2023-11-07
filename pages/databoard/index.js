import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from '../../utils/ddUtils'
import ddTimer from '../../utils/ddTimer'

Page({
  data: {
    visibel:false,
    navbarData:{
      title: "任务详情"
    },
    options:[
      {
        label:"类型",
        prop:"type",
        value:[],
        type:'select',
        option: [
          {
              id:"1",
              label: '12',
              selected: false,
          },
          {
              id:"2",
              label: '34',
              selected: false,
          },
          {
              id:"3",
              label: '56',
              selected: false,
          },
      ],
      },
      {
        label:"人员",
        value:"",
        prop:"userName",
        type:'input' 
      },
    ],
  },
  dialogScreenDateRef:null,
  onLoad() {
  },
  _onSaveDialogScreenDateRef:function (ref) {
    this.dialogScreenDateRef = ref;
  },
  tapName(e){
    this.setData({
      visibel:true
    })
  },
  _bindScreenDateCallBack(data){
    console.log(data);

  },
  onDialog(data){
    this.setData({
      visibel:data
    })
  },
  onBindSureTap(data){
    console.log(data);
    this.onDialog(false)
  }
});