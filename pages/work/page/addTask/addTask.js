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
    // executeUserList:[],
    dialogScreenExecuteUser :null,
    dialogPickerDate:null,
  },
  onLoad() {
    this.getProjectList()
    console.log('form',this.form);
  },
  handleRef(ref) {
    console.log(ref);
    this.form.addItem(ref);
  },
  onSaveDialogScreenExecuteUserRef(ref){
    this.dialogScreenExecuteUser = ref
  },
  onSaveDialogPickerDateRef(ref){
    this.dialogPickerDate = ref
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
  onUpload(localFile) {
    return new Promise((resolve, reject) => {
      my.uploadFile({
        url: config.API_UPLOAD_FILE, // 请替换成有效的服务端 url
        // fileType: 'image',
        // name: 'userfile', // 这里根据后台服务需求来替换
        filePath: localFile.path, // 这里传入 localFile.path
        // formData: { extra: '其他信息' }, // 这里根据后台服务需求来替换
        success: res => {
          const { url } = JSON.parse(res.data);
          resolve(url);
        },
        fail: err => {
          reject();
        },
      });
    });
  },
  cancel(){

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
    values.executeUser = this.data.executeUser
    values.endTime = values.endTime + ' 00:00:00'
    values.annexList=[]
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
