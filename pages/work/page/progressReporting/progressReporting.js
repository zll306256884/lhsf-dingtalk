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
    projectId: "",
    dialogScreenprojectRef: null, //项目名称
  },
  onLoad() { },
  // 点击取消
  bindCancelTap: function (e) {
    // ddUtils.showToast({
    //   title: "请选择项目名称"
    // });
    // ddUtils.navigateBack();
    ddUtils.showModal({
      content: "是否退出编辑？退出后不会保存当前编辑内容",
      success: res => {
        if (res.confirm) {
          // this.form.reset();
          ddUtils.navigateBack();
        }
      }
    });
  },
  // 点击确定
  bindSaveTap: function (e) {
    console.log(e);
    // 
    console.log(this.data.projectData.name);
    console.log(this.data.projectId);
    if (this.data.projectId && this.data.projectData.name) {
      dd.navigateTo({
        url: '/pages/work/page/progressDetail/progressDetail?id=' + this.data.projectId + '&name=' + this.data.projectData.name,
      })
    } else {
      ddUtils.showModal({
        content: "请选择项目",
        success: res => {
        }
      });
    }
    // ddUtils.navigateTo({
    //   url: `/pages/work/page/progressDetail/progressDetail`,
    //   query: {
    //     projectId: this.data.projectId
    //   }

    // });
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
      projectId: data.projectId || ''
    });
    console.log(this.data.projectData, 'this.data.projectData');
  },
  // 项目名称----组件end
});