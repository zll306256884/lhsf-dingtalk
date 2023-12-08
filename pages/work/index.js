import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from "../../utils/ddUtils"
import apiMesssageServer from "../../server/messageServer"
// approvalServer
import approvalServer from "../../server/approvalServer/approvalServer"
const app = getApp();

Page({
  data: {
    iconList: [{
      url: "../../../../assets/images/work/Group-1.png",
      name: "新增项目",
      path: '/pages/work/page/addNewProject/addNewProject',
      showType:'xzxm'
    },
    {
      url: "../../../../assets/images/work/Group-2.png",
      name: "新增日志",
      path: '/pages/work/page/addLog/addLog',
      showType: 'xzrz'
    },
    {
      url: "../../../../assets/images/work/Group-3.png",
      name: "进度填报",
      path: '/pages/work/page/progressReporting/progressReporting',
      showType: 'jdtb'
    },
    {
      url: "../../../../assets/images/work/Group-4.png",
      name: "招标文件会签",
      path: '/pages/work/page/bidDocumentCreatAndEdit/bidDocumentCreatAndEdit',
      showType: 'zbwjhq'
    },
    {
      url: "../../../../assets/images/work/Group-5.png",
      name: "合同审批流程",
      path: '/pages/work/page/contractApprovalCreatAndEdit/contractApprovalCreatAndEdit',
      showType: 'htsplc'
    },
    {
      url: "../../../../assets/images/work/Group-6.png",
      name: "新增支付",
      path: '/pages/work/page/addPayment/addPayment',
      showType: 'kxzf'
    },
    {
      url: "../../../../assets/images/work/Group-7.png",
      name: "变更登记",
      path: '/pages/work/page/alterationRegister/alterationRegister',
      showType: 'bgdj'
    },
    {
      url: "../../../../assets/images/work/Group-8.png",
      name: "竣工结算登记",
      path: '/pages/work/page/beCompletedRegister/beCompletedRegister',
      showType: 'jgjsdj'
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
    },],
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
    currentApproval: '2',//选择的审批
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
    listquery: [],
    requestStatus: 0,
    approvalStatus: null
  },
  onLoad(option) {
    // this.getAwaitList()
    // this.getApprovalList(2)
    // this.getQueryList('2')
    // this.getTaskList(app.globalData.userInfo.userId, [1, 2, 5])

    let menuList = app.globalData.menuList.subList
    console.log(menuList)
    let buttonList = []
    if(menuList && menuList.length){
      if(menuList[0].subList && menuList[0].subList.length){
        buttonList = menuList[0].subList[0].buttonList
      }
    }
    // console.log(buttonList)
    // let list = this.data.iconList
    // let listList = []
    // list.forEach(e => {
    //   if( buttonList.find(k => k.optKey === e.showType)){
    //     listList.push(e)
    //   }
    // })
    // this.setData({
    //   iconList: listList
    // })
  },
  onShow() {
    this.setData({
      currentAwait: 0,
      currentTask: 0,
      approvalStatus: 0,
      requestStatus: 0
    })
    this.getAwaitList()
    this.getApprovalList(2)
    this.getQueryList('2')
    this.onTaskChange(this.data.currentTask)
    this.getCount()
    this.getTaskCount()
  },
  onItemTap(e) {
    console.log(e);
    let { path } = e.currentTarget.dataset
    ddUtils.navigateTo({
      url: path
    });
  },
  // 获取全部待办列表
  getAwaitList: function () {
    let data = {
      projectId: ''
    };
    request.doPostRequest({
      url: apiApprovalManage.API_ALL_WAIT_LIST,
      data,
      success: res => {
        this.data.tabs1[0].count = res.data.waitAuditNum,
          this.data.tabs1[1].count = res.data.waitMissionNum,
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
        this.setData({
          listTask: res.data.records,
        })
      },
    });
  },
    //获取任务数量
    getTaskCount: function () {
      let data = {
        pageNum: 1,
        pageSize: 3,
        params: {
          createById: app.globalData.userInfo.userId, //发起人
          executeUserId: "",
          sort: "endTime",
          taskStatus:[1,2,5], //[1,2,5]我发起，4已完成，6已取消
        }
      };
      request.doPostRequest({
        url: apiApprovalManage.API_TASK_LIST,
        data,
        success: res => {
          this.data.tabs3[0].count = res.data.total
          this.setData({
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
    this.setData({
      approvalStatus: e
    })
    switch (e) {
      case 0:
        this.getApprovalList(2)
        this.setData({
          currentApproval: 2
        })
        console.log('currentApproval', this.data.currentApproval)
        break;
      case 1:
        this.getApprovalList(3)
        this.setData({
          currentApproval: 3
        })
        console.log('currentApproval', this.data.currentApproval)
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
    this.setData({
      requestStatus: e
    })
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
    // debugger
    switch (this.data.currentAwait) {
      case 0:
        ddUtils.navigateTo({
          url: `/pages/message/page/approval/approval?currentApproval=1`
        });
        break;
      case 1:
        ddUtils.navigateTo({
          url: `/pages/work/page/myTask/taskList/list?tabIndex=${0}`
        });
        break;
      case 2:
        ddUtils.navigateTo({
          url: `/pages/message/page/myRequest/myRequest`
        });
        break;
    }

  },
  selectMoreApproval() {
    ddUtils.navigateTo({
      url: `/pages/message/page/approval/approval?currentApproval=${this.data.currentApproval}`
    });

  },
  selectMoreTask() {
    ddUtils.navigateTo({
      url: `/pages/work/page/myTask/taskList/list?tabIndex=${this.data.currentTask + 1}`
    });
  },
  selectMoreQuery() {
    ddUtils.navigateTo({
      url: `/pages/message/page/myRequest/myRequest?requestStatus=${this.data.requestStatus + 1}`
    });
  },
  // 刷新为已读
  getRead(examineId) {
    let params = {
      "id": examineId,
      "isRead": 1
    }
    request.doPostRequest({
      url: approvalServer.API_UPLATE_READ,
      showLoading: true,
      data: params,
      success: res => {
        console.log(res)
        return res
      },
      complete: res => {
        // this._loadDone(res);
      }
    })

  },
  // 点击列表项查看待办详情
  async selectAwaitInfo(e) {
    console.log(e);
    // 待办审批
    if (this.data.currentAwait === 0) {
      console.log('待办审批')
      console.log('this.data.currentAwait', this.data.currentAwait)
      let temp = e.target.dataset.item.belongModule;
      let id = e.target.dataset.item.keyId
      let projectId = e.target.dataset.item.projectId
      let showType = e.target.dataset.item.showType
      let examineId = e.target.dataset.item.id //审批组件用
      // let resBack = await this.getRead(examineId)
      // console.log('resBack', resBack)
      let params = {
        "id": examineId,
        "isRead": 1
      }
      request.doPostRequest({
        url: approvalServer.API_UPLATE_READ,
        showLoading: true,
        data: params,
        success: res => {
          console.log(res)
          switch (temp) {
            case 2:
              ddUtils.navigateTo({
                url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${examineId}&id=${id}&approvalType=1`
              });
              break;
            case 3:
              ddUtils.navigateTo({
                url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${examineId}&id=${id}&approvalType=1`
              });
              break;
            case 4:
              ddUtils.navigateTo({
                url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${id}&projectId=${projectId}&showType=${1}&examineId=${examineId}`
              });
            // case 5:
            //   ddUtils.navigateTo({
            //     url: `/pages/work/page/projectCapital/capitalPlan/capitalPlan?json=${JSON.stringify(item)}`
            //   });
            //   break;
          }
          // return res
        },
        complete: res => {
          // this._loadDone(res);
        }
      })
      return

    }
    // 待办任务
    if (this.data.currentAwait === 1) {
      ddUtils.navigateTo({
        url: `/pages/work/page/myTask/taskInfo/taskInfo?id=${e.currentTarget.dataset.item.id}`
      });
    }
    // 待办请求
    if (this.data.currentAwait === 2) {
      console.log('this.data.currentAwait', this.data.currentAwait)
      let item = e.target.dataset.item
      let temp = e.target.dataset.item.type;
      switch (temp) {
        case 1:
          ddUtils.navigateTo({
            url: `/pages/work/page/requestProgressDetail/requestProgressDetail?planId=${item.keyId}&projectId=${item.projectId}`
          });
          break;
        case 2:
          ddUtils.navigateTo({
            url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${item.keyId}&requestType=0`
          });
          break;
        case 3:
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.keyId}&requestType=0`
          });
          break;
        case 4:
          ddUtils.navigateTo({
            url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${item.keyId}&type=${temp}&status=${item.status}&projectId=${item.projectId}&keyId=${item.id}`
          });
          break;
        case 5:
          ddUtils.navigateTo({
            url: `/pages/work/page/projectCapital/capitalPlan/capitalPlan?json=${JSON.stringify(item)}`
          });
          break;
        case 6:
          ddUtils.navigateTo({
            url: `/pages/work/page/projectInfo/projectInfo?id=${item.keyId}&requestType=0`
          });
          break;
        case 7:
          ddUtils.navigateTo({
            url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${item.keyId}&keyId=${item.id}`
          });
          break;
        case 8:
          ddUtils.navigateTo({
            url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?id=${item.keyId}&keyId=${item.id}`
          });
          break;
      }
    }

  },
  // 点击列表项查看审批详情
  selectApprovalInfo(e) {
    console.log(e);
    let item = e.currentTarget.dataset.item
    let temp = e.currentTarget.dataset.item.belongModule
    let id = e.target.dataset.item.keyId
    let projectId = e.target.dataset.item.projectId
    let showType = e.target.dataset.item.showType
    switch (temp) {
      case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${item.id}&id=${item.keyId}&approvalType=${this.data.approvalStatus + 2}`
        });
        break;
      case 3:
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${item.id}&id=${item.keyId}&approvalType=${this.data.approvalStatus + 2}`
        });
        break;
      case 4:
        ddUtils.navigateTo({
          url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${id}&projectId=${projectId}&showType=${showType}&examineId=${item.id}`
        });
        break;
    }
  },
  // 点击列表项查看任务详情
  selectTaskInfo(e) {
  
    ddUtils.navigateTo({
      url: `/pages/work/page/myTask/taskInfo/taskInfo??id=${e.currentTarget.dataset.item.id}`
    });
  },
  getCount() {
    request.doPostRequest({
      url: apiMesssageServer.API_COUNT_MATTER,
      data: { userId: app.globalData.userInfo.userId },
      success: res => {
        let list = this.data.tabs4
        console.log(list);
        list[0].count = res.data.handleNum
        // list[1].total = res.data.handleNum
        console.log(list);
        this.setData({
          tabs4: list
        })
      }
    })
  },
  // 点击列表项查看请求详情
  selectQueryInfo(e) {
    console.log(e);
    let temp = e.target.dataset.item.type;
    let status = e.target.dataset.item.status;
    let item = e.target.dataset.item
    let id = e.target.dataset.item.keyId
    console.log(item);
    switch (temp) {
      case 1:
        ddUtils.navigateTo({
          url: `/pages/work/page/requestProgressDetail/requestProgressDetail?planId=${item.keyId}&requestType=${this.data.requestStatus + 1}&projectId=${item.projectId}`
        });
        break;
      case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${item.keyId}&requestType=${this.data.requestStatus + 1}`
        });
        break;
      case 3:
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.keyId}&requestType=${this.data.requestStatus + 1}`
        });
        break;
      case 4:
        ddUtils.navigateTo({
          url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${id}&type=${temp}&status=${status}&projectId=${item.projectId}&keyId=${item.id}`
        });
        break;
      case 5:
        ddUtils.navigateTo({
          url: `/pages/work/page/projectCapital/capitalPlan/capitalPlan?json=${JSON.stringify(item)}`
        });
        break;
      case 6:
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${item.keyId}&requestType=${this.data.requestStatus + 1}`
        });
        break;
      case 7:
        ddUtils.navigateTo({
          url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${id}&keyId=${item.id}&keyId=${item.id}`
        });
        break;
      case 8:
        ddUtils.navigateTo({
          url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?id=${id}&keyId=${item.id}`
        });
        break;
    }
  }
});