import request from "../../../../../utils/request"
import workServer from "../../../../../server/workServer/index";
import ddUtils from "../../../../../utils/ddUtils"
import { Form } from "antd-mini/es/Form/form";

Page({
  form: new Form({
    rules: {
      remark: [{ required: true, message: "请填写", trigger: "change" }]
    }
  }),
  data: {
    navbarData:{
      title: "任务详情"
    },
    remark:"",
    finishFile:[],
    currentId:"",
    uploadImageList :null
  },
  onLoad(option) {
    this.setData({
      currentId:option.json
    })
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  onSaveUploadTenderImgRef(ref) {
    this.uploadImageList = ref;
  },
  cancel() {
    ddUtils.navigateBack();
  },
  async submit() {
    let values = await this.form.submit();
    console.log("values", values);
    if (this.uploadImageList) {
      let list = this.uploadImageList._getUploadImgId().imgList;
      console.log(list);
      list.forEach(e => {
        e.fileSize=e.size,
        e.fileName = e.name,
        e.fileUrl=e.url,
        e.fileType = 1,
        e.missionId=this.data.currentId//必传
      });
      this.setData({
        finishFile: list
      });
    }
    values.finishFile = this.data.finishFile;
    values.id = this.data.currentId
    request.doPostRequest({
      url:workServer.API_FINISH_TASK,
      data: values,
      success: res => {
        if (res.code===1000) {
          ddUtils.showToast({
            title: "保存成功！"
          });
        }
        let pages = getCurrentPages();
        let page = pages[pages.length - 2];
        if (page && page.setNeedRefreshList) {
          page.setRefreshList(2);
        }
        ddUtils.navigateBack(2);
      }
    });

  }
});
