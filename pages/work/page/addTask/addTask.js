import { Form } from 'antd-mini/es/Form/form';
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import workServer from "../../../../server/workServer/index"
import ddUtils from "../../../../utils/ddUtils"
Page({
  form: new Form({
    rules: {
      title: [{ required: true, message: '请填写', trigger: 'blur'}],
      endTime: [{ required: true, message: '请填写', trigger: 'change' }],
      executer_dictText: [{ required: true, message: '请填写', trigger: 'change' }],
      remark: [{ required: true, message: '请填写', trigger: 'change' }]
    },
  }),
  data: {
    title:"",
    endTime:"",
    executer_dictText:"",
    remark: "",
    projectId:"",
    annexList:[],
    projectList:[],
    executeUser:[],
    dialogScreenExecuteUser :null,
    dialogPickerDate:null,
    uploadTenderImageList:null,
  },
  onLoad() {
    this.getProjectList()
    console.log('form',this.form);
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  onSaveDialogScreenExecuteUserRef(ref){
    this.dialogScreenExecuteUser = ref
  },
  onSaveDialogPickerDateRef(ref){
    this.dialogPickerDate = ref
  },
  onSaveUploadTenderImgRef(ref){
    this.uploadTenderImageList = ref
  },
  chooseExecuter(){
    if(this.dialogScreenExecuteUser) this.dialogScreenExecuteUser._showDialog()
  },
  bindScreenExecuteUserCallBack(data){
    this.setData({
      executeUser:JSON.stringify(data.map(e => { return { userId: e.userId, username: e.username } }))
    })
    this.form.setFieldValue('executer_dictText', data.map(e => e.username).toString());
    this.setData({
      'executer_dictText': data.map(e => e.userId).toString()
    })
  },
  chooseDate(){
    this.dialogPickerDate && this.dialogPickerDate._showDialog()
  },
  bindPickerDateCallBack(date){
    this.form.setFieldValue('endTime', date.startDate);
    this.setData({
      'endTime':date.startDate
    })
  },
  cancel(){
    ddUtils.navigateBack();
  },
  getProjectList(){
    request.doPostRequest({
      url: config.API_PROJECT_NAME,
      success: res => {
        res.data.forEach(e => {
          e.label = e.name
          e.value = e.id
        })
        this.setData({
          projectList: res.data || []
        })
      }
    })
  },
  async submit() {
    let values = await this.form.submit();
    console.log('values', values);
    if (this.uploadTenderImageList) {
      let list = this.uploadTenderImageList._getUploadImgId().imgList
      list.forEach(e => {
        e.fileName = e.name
        e.type= 1
      })
      this.setData({
        annexList: list
      }) 
    }
    values.executeUser = this.data.executeUser
    values.annexList=this.data.annexList
    request.doPostRequest({
      url:workServer.API_CREATE_TASK,
      data:values,
      success: res => {
        if(res.data.id){
          ddUtils.showToast({
            title: "保存成功！"
          });
        }
        ddUtils.navigateBack();
      },
  });
  }
});
