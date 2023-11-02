import {
  isEmpty
} from "../../../../utils/utils"
import config from "../../../../utils/config"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"

Page({
  data: {
    navbarData: {
      title: "进度填报",
    },
    projectData: {
      name: "",
    },
    dialogScreenprojectRef: null, //项目名称
  },
  onLoad() {},
  // 点击取消
  bindCancelTap: function (e) {
    ddUtils.navigateBack();
  },
  // 点击确定
  bindSaveTap: function (e) {
    console.log(e);
    console.log(this.data.projectData.name);
    ddUtils.navigateTo({
      url: `/pages/work/page/progressDetail/progressDetail`
    });
  },
  // 项目名称----组件start
  bindChooseProjectTap: function (e) {
    console.log(e);
    if (this.data.isEdit) return;
    if (this.dialogScreenprojectRef) this.dialogScreenprojectRef._showDialog()
  },
  onSaveDialogScreenprojecteRef: function (ref) {
    console.log(ref);
    this.dialogScreenprojectRef = ref;
  },
  bindChooseProjectCallBack: function (data) {
    console.log(data);
    this.setData({
      projectData: data || {},
      projectLeader: data.projectLeaderName,
      affiliateUnit: data.affiliatedUnitName,
      projectId: data.id || ''
    });
    console.log(this.data.projectData, 'this.data.projectData');
  },
  // 项目名称----组件end
});