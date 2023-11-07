import request from "../../../../../utils/request"
import apiApprovalManage from "../../../../../server/workServer"
import ddUtils from "../../../../../utils/ddUtils"
Page({
  data: {
    navbarData:{
      title: "任务详情"
    },
    description:""
  },
  onLoad() {},
  cancel() {
    ddUtils.navigateBack();
  },
  async submit() {

  }
});
