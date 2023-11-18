import { Form } from "antd-mini/es/Form/form";
import request from "../../../../../utils/request";
import config from "../../../../../utils/config";
import workServer from "../../../../../server/workServer/index";
import ddUtils from "../../../../../utils/ddUtils";
import ddTimer from "../../../../../utils/ddTimer";

Page({
  form: new Form({
    rules: {
      title: [{ required: true, message: "请填写", trigger: "blur" }],
      endTime: [{ required: true, message: "请填写", trigger: "change" }],
      executer_dictText: [
        { required: true, message: "请填写", trigger: "change" }
      ],
      remark: [{ required: true, message: "请填写", trigger: "change" }]
    }
  }),
  data: {
    navbarData:{
      title: "新增任务"
    },
    currentId:null,
    title: "",
    endTime: "",
    executer_dictText: "",
    remark: "",
    projectId: "",
    annexList: [],
    projectList: [],
    executeUser: [],
    dialogScreenExecuteUser: null,
    dialogPickerDate: null,
    dialogPickerProject:null,
    uploadImageList: null
  },
  onLoad(option) {
    const params = option.json && JSON.parse(option.json);
    if (params && params.id) {
      this.setData({
        currentId:params.id,
      })
    }
  },
  onShow(){
    console.log(this.data.currentId);
    this.getProjectList();
    if(this.data.currentId){
      let title=this.data.currentId?"编辑任务":'新增任务'
      this.setData({
        "navbarData.title":title
      })
      this.getInfo(this.data.currentId);
    }
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  onSaveDialogScreenExecuteUserRef(ref) {
    this.dialogScreenExecuteUser = ref;
  },
  onSaveDialogPickerDateRef(ref) {
    this.dialogPickerDate = ref;
  },
  onSaveUploadTenderImgRef(ref) {
    this.uploadImageList = ref;
  },
  onSaveDialogScreenprojecteRef(ref){
    this.dialogPickerProject=ref
  },
  chooseExecuter() {
    if (this.dialogScreenExecuteUser)
      this.dialogScreenExecuteUser._showDialog();
  },
  bindScreenExecuteUserCallBack(data) {
    this.setData({
      executeUser: 
        data.map(e => {
          return { userId: e.userId, username: e.username };
        })
    });
    this.form.setFieldValue(
      "executer_dictText",
      data.map(e => e.username).toString()
    );
    this.setData({
      executer_dictText: data.map(e => e.userId).toString()
    });
  },
  bindChooseProjectCallBack(data){
    console.log(data);
    this.form.setFieldValue("projectId", data.id);
    this.setData({
      projectId: data.id
    });
  },
  chooseDate() {
    this.dialogPickerDate && this.dialogPickerDate._showDialog();
  },
  chooseProject(){
    this.dialogPickerProject && this.dialogPickerProject._showDialog();
  },
  bindPickerDateCallBack(date) {
    this.form.setFieldValue("endTime", date.date);
    this.setData({
      endTime: date.date
    });
  },
  cancel() {
    ddUtils.navigateBack();
  },
  getInfo(id) {
    request.doPostRequest({
      url: workServer.API_SELECT_TASK,
      data: { id },
      success: res => {
        this.setData({
          executeUser:JSON.parse(res.data.executeUser),
          annexList:res.data.missionFileList
        })
      //  console.log(this.dialogScreenExecuteUser,this.data.executeUser);
      //  this.dialogScreenExecuteUser._bindItemChooseUserChange(this.data.executeUser)
        const fields = this.form.getFieldsValue();
        for (let item in fields) {
          if ({}.hasOwnProperty.call(fields, item)) {
            fields[item] = res.data[item] ? res.data[item] : "";
          }
        }
        console.log(fields);
        this.form.setFieldsValue({
          ...fields,
          executer_dictText: JSON.parse(res.data.executeUser)
            .map(e => e.username)
            .toString(),
        });
       const files= res.data.missionFileList.map((item)=>{
          return {
            ...item,
            name:item.fileName,
            url:item.fileUrl
          }
        })
        setTimeout(() => {
          console.log('res.data.missionFileList',files,this.uploadImageList);
          this.uploadImageList._setImageList( files );
        }, 0);
      }
    });
  },
  getProjectList() {
    request.doPostRequest({
      url: config.API_PROJECT_NAME,
      success: res => {
        res.data.forEach(e => {
          e.label = e.name;
          e.value = e.id;
        });
        this.setData({
          projectList: res.data || []
        });
      }
    });
  },
  async submit() {
    let values = await this.form.submit();
    if (this.uploadImageList) {
    let list = this.uploadImageList._getUploadImgId().imgList;
      list.forEach(e => {
        e.fileSize=e.size,
        e.fileName = e.name,
        e.fileUrl=e.url,
        e.fileType = 1,
        e.missionId=this.data.currentId//必传
      });
      this.setData({
        annexList: list
      });
    }
    values.executeUser =JSON.stringify(this.data.executeUser);
    values.annexList = this.data.annexList;
    let url
    if(this.data.currentId){
      values.id = this.data.currentId
      url = workServer.API_MODIFY_TASK
    }else{
      url = workServer.API_CREATE_TASK
    }
    request.doPostRequest({
      url,
      data: values,
      success: res => {
        if (res.code===1000) {
          ddUtils.showToast({
            title: "保存成功！"
          });
        }
        ddUtils.navigateBack(this.data.currentId?2:1);
      }
    });
  }
});
