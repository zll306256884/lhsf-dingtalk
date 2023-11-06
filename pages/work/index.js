import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from "../../utils/ddUtils"
const app = getApp();

Page({
  data: {
    iconList: [{
        url: "../../../../assets/images/work/Group-1.png",
        name: "新增项目",
        path: 'pages/work/page/addProject/addProject'
      },
      {
        url: "../../../../assets/images/work/Group-2.png",
        name: "新增日志"
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
    // 待办
    tabs1: [{
      title: "待办审批",
      count: 0
    }, {
      title: "待办任务",
      count: 0
    }, {
      title: "待办请求",
      count: 0
    }, ],
    currentAwait: 0,
    listData: [],
    listWait: [],
    // 我的审批
    tabs2: [{
      title: "已办审批",
      count: 0
    }, {
      title: "办结审批",
      count: 0
    }],
    listApproval: [],
    // 我的任务
    tabs3: [{
        title: "我发起的",
        count: 0
      }, {
        title: "已完成",
        count: 0
      },
      {
        title: "已取消",
        count: 0
      }
    ],
    currentTask: 0,
    listTask: [],
    // 我的请求
    tabs4: [{
      title: "进行中请求",
      count: 0
    }, {
      title: "已办结请求",
      count: 0
    }],
    listquery: []
  },
  onLoad(option) {
    this.getAwaitList()
    this.getApprovalList(1)
    this.getQueryList('2')
    this.getTaskList(app.globalData.userInfo.userId, [1, 2, 5])
  },
  onItemTap(e) {
    switch (e.target.dataset.index) {
      case 0:
        ddUtils.navigateTo({
          url: `/pages/work/page/addProject/addProject`
        });

        break;
      case 1:
        // 新增日志
        ddUtils.navigateTo({
          url: `/pages/work/page/addLog/addLog`
        });
        break;
      case 2:
        // 进度填报
        ddUtils.navigateTo({
          url: `/pages/work/page/progressReporting/progressReporting`
        });
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        ddUtils.navigateTo({
          url: `/pages/work/page/addPayment/addPayment`
        });
        break;
      case 6:
        ddUtils.navigateTo({
          url: `/pages/work/page/alterationRegister/alterationRegister`
        });
        break;
      case 7:
        ddUtils.navigateTo({
          url: `/pages/work/page/beCompletedRegister/beCompletedRegister`
        });
      break;
     }
  },
  // 获取全部待办列表
  getAwaitList: function () {
    let data = {
      projectId: app.globalData.userInfo.projectId || ''
    };
    request.doPostRequest({
      url: apiApprovalManage.API_ALL_WAIT_LIST,
      data,
      success: res => {
        this.data.tabs1[0].count = res.data.waitAuditNum,
          this.data.tabs1[1].count = res.data.waitAuditNum,
          this.data.tabs1[2].count = res.data.draftNum,
          this.setData({
            listWait: res.data,
            listData: res.data.waitAuditList.slice(0, 3),
            tabs1: this.data.tabs1
          })
      },
    });
  },
  //获取审批列表
  getApprovalList: function (status) {
    console.log('app ', app);
    let data = {
      account: app.globalData.userInfo.userAccount,
      pageNum: 1,
      pageSize: 3,
      showType: status, //1待办 2已办 3办结
    };
    request.doPostRequest({
      url: apiApprovalManage.API_APPROVAL_LIST,
      data,
      success: res => {
        this.setData({
          listApproval: res.data.records
        })
      },
    });
  },
  //获取任务列表
  getTaskList: function (createById, status) {
    let data = {
      pageNum: 1,
      pageSize: 3,
      params: {
        createById: createById, //发起人
        executeUserId: "",
        sort: "endTime",
        taskStatus: status, //[1,2,5]我发起，4已完成，6已取消
      }
    };
    request.doPostRequest({
      url: apiApprovalManage.API_TASK_LIST,
      data,
      success: res => {
        this.data.tabs3[0].count = res.data.total
        this.setData({
          listTask: res.data.records,
          tabs3: this.data.tabs3
        })
      },
    });
  },
  //获取请求列表
  getQueryList: function (status) {
    let data = {
      pageNum: 1,
      pageSize: 3,
      params: {
        status: status, //1待办，2进行中，3已办结
      }
    };
    request.doPostRequest({
      url: apiApprovalManage.API_QUERY_LIST,
      data,
      success: res => {
        this.setData({
          listQuery: res.data.records
        })
      },
    });
  },
  // 切换待办tab
  onAwaitChange(e) {
    let list = this.data.listWait
    this.setData({
      currentAwait: e
    })
    console.log(e, this.data.listWait);
    switch (e) {
      case 0:
        this.setData({
          listData: list.waitAuditList.slice(0, 3)
        })
        break;
      case 1:
        this.setData({
          listData: list.waitMissionList.slice(0, 3)
        })
        break;
      case 2:
        this.setData({
          listData: list.draftList.slice(0, 3)
        })
        break;
    }
  },
  // 切换我的审批tab
  onApprovalChange(e) {
    switch (e) {
      case 0:
        this.getApprovalList(2)
        break;
      case 1:
        this.getApprovalList(3)
        break;
    }
  },
  // 切换我的任务tab
  onTaskChange(e) {
    this.setData({
      currentTask: e
    })
    switch (e) {
      case 0:
        this.getTaskList(app.globalData.userInfo.userId, [1, 2, 5])
        break;
      case 1:
        this.getTaskList('', [4])
        break;
      case 2:
        this.getTaskList('', [6])
        break;
    }
  },

  // 切换待办tab
  onAwaitChange(e) {
    let list = this.data.listWait
    this.setData({
      currentAwait: e
    })
    console.log(e, this.data.listWait);
    switch (e) {
      case 0:
        this.setData({
          listData: list.waitAuditList.slice(0, 3)
        })
        break;
      case 1:
        this.setData({
          listData: list.waitMissionList.slice(0, 3)
        })
        break;
      case 2:
        this.setData({
          listData: list.draftList.slice(0, 3)
        })
        break;
    }
  },
  // 切换我的审批tab
  onApprovalChange(e) {
    switch (e) {
      case 0:
        this.getApprovalList(2)
        break;
      case 1:
        this.getApprovalList(3)
        break;
    }
  },
  // 切换我的任务tab
  onTaskChange(e) {
    this.setData({
      currentTask: e
    })
    switch (e) {
      case 0:
        this.getTaskList(app.globalData.userInfo.userId, [1, 2, 5])
        break;
      case 1:
        this.getTaskList('', [4])
        break;
      case 2:
        this.getTaskList('', [6])
        break;
    }


  },
  // 切换我的请求tab
  onQueryChange(e) {
    switch (e) {
      case 0:
        this.getQueryList(2)
        break;
      case 1:
        this.getQueryList(3)
        break;
    }
  },
  selectMoreAwait() {

  },
  selectMoreApproval() {

  },
  selectMoreTask() {
    ddUtils.navigateTo({
      url: `/pages/work/page/listTask/list`
    });
  },
  selectMoreQuery() {

  },
  // 点击列表项查看详情
  selectInfo(e) {
    console.log(e);
  }
});