import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from "../../utils/ddUtils"
Page({
  data: {
    iconList: [{
        url: "../../../../assets/images/work/Group-1.png",
        name: "新增项目",
        path: 'pages/work/page/addProject/addProject'
      },
      {
        url: "../../../../assets/images/work/Group-2.png",
        name: "新增日志",
        path: 'pages/work/page/addLog/addLog'
      },
      {
        url: "../../../../assets/images/work/Group-3.png",
        name: "进度填报"
      },
      {
        url: "../../../../assets/images/work/Group-4.png",
        name: "招标文件会签"
      },
      {
        url: "../../../../assets/images/work/Group-5.png",
        name: "合同签订登记"
      },
      {
        url: "../../../../assets/images/work/Group-6.png",
        name: "新增支付"
      },
      {
        url: "../../../../assets/images/work/Group-7.png",
        name: "变更登记"
      },
      {
        url: "../../../../assets/images/work/Group-8.png",
        name: "竣工结算登记"
      }
    ],

  },

  onLoad(option) {
    console.log(option);
    this.getRecordList()

  },
  onItemTap(e) {
    console.log(e.target.dataset.index);
    if (e.target.dataset.index === 0) {
      ddUtils.navigateTo({
        url: `/pages/work/page/addProject/addProject`
      });
    }
    // 新增日志
    if (e.target.dataset.index === 1) {
      ddUtils.navigateTo({
        url: `/pages/work/page/addLog/addLog`
      });
    }
    // 进度填报
    if (e.target.dataset.index === 2) {
      ddUtils.navigateTo({
        url: `/pages/work/page/progressReporting/progressReporting`
      });
    }
    if (e.target.dataset.index === 5) {
      ddUtils.navigateTo({
        url: `/pages/work/page/addPayment/addPayment`
      });
    }
  },

  //获取列表
  getRecordList: function () {
    let data = {
      account: 'admin',
      pageNum: 1,
      pageSize: 10,
    };
    request.doPostRequest({
      url: apiApprovalManage.API_APPROVAL_MANAGE_WAIT_LIST,
      data,
      success: res => {},
      complete: res => {}
    });
  }
});