import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"
import ddUtils from "../../utils/ddUtils"
import { isEmptyArray, isHasMore } from "../../utils/utils"
Page({
  data:{
    navbarData: {
      title: "消息",
      showNavbarBackHome:false,
      // showNavbarBack:false
    },
    items: [
      {
        title:"全部",
      
      },{
        title:"已读",
      
      },{
        title:"未读",
        total:0,
        badge: true,    
      },
    ],
    tabIndex: 0,
    MessageList:[],
  },
  page: 1,
  errorView: null,
  hasMore: false,
  isLoading: false,
  onShow(){
    this.setData({
      tabIndex: 0
    });
    this.page = 1
    this.getMessageList(0)
    this.getunReadMessageTotal()
  },
 // 切换我的请求tab
  onQueryChange(e) {
    console.log(e);
    this.setData({
      tabIndex: e
    });
    this.page = 1
    switch (e) {
      case 0:
        this.getMessageList(0)
        break;
      case 1:
        this.getMessageList(1)
        break;
      case 2:
        this.getMessageList(2)
        break;
    }
  },
 //消息
  getMessageList:function(s){
    let data = {
      pageNum: this.page,
      pageSize: 10,
      "status": s,
    };
    request.doPostRequest({
      url: apiApprovalManage.API_MESSAGE_POST,
      data,
      success: res => {
        this.page++;
        this.hasMore = isHasMore(res.data.records);
        this.setData({
          MessageList: res.data.records || []
        })
        console.log(res);
      },
      complete: res => {
        this._loadDone(res);
      }
    });
  },
  getMoreDataList(){
    if (this.isLoading || !this.hasMore) //防止重复加载和没有更多数据
      return;

    this.isLoading = true;
    this.errorView._showLoadMore();

    let params = {
      asc: false,
      pageNum: this.page,
      pageSize: 10,
      status:this.data.tabIndex,
      sort: 'createTime'
    }
    request.doPostRequest({
      url: apiApprovalManage.API_MESSAGE_POST,
      data: params,
      success: res => {
        console.log(res.data)
        this.page++;
        this.hasMore = isHasMore(res.data.records);

        this.setData({
          MessageList: this.data.MessageList.concat(res.data.records) || []
        })
      },
      complete: res => {
        this._loadDone(res);
      }
    })
  },

 //判断是否为空
  _loadDone: function (res) {
    this.isLoading = false;
    this.errorView._hideLoadMore();
    if (isEmptyArray(this.data.MessageList)) {
        if (res.loadFail === true) {
            this.errorView._showEmptyView({
                loadError: true,
                errorMessage: "加载失败, 点击重新加载"
            });
        } else {
            this.errorView._showEmptyView();
        }
    } else {
        this.errorView._hideEmptyView();
    }
  },

  onReachBottom() {
    this.getMoreDataList();
  },
  _onSaveErrorViewRef: function (ref) {
    this.errorView = ref;
  },
  _bindErrorRefreshTap: function (e) {
    this.getMessageList();
  },
  getunReadMessageTotal(){
    request.doPostRequest({
      url: apiApprovalManage.API_UNMESSAGE_TO_POST,
      data:{subType:2,typeList:[3,5]},
      success: res => {
        console.log(res);
        let list = this.data.items
          console.log(list);
        
          list[2].total =res.data.unReadMessageTotal
          console.log(list);
          this.setData({
            items: list
          })
        
      },
    });
  },
 // 消息列表点击详情
 selectTap(e) {
    // 事项类型 1-进度计划 2-招标文件会签 3-合同审批流程 4-款项支付 5-项目资金计划 6-生态伙伴 7-档案管理
    console.log(e);
    let item = e.target.dataset.item

    // 议题消息不能在钉钉打开
    if(item.subType === 2) {
      return ddUtils.showToast({
        title:"暂不支持移动端访问，请在电脑端进行查看！"
      })
    }

    let examineId = e.target.dataset.item.id //审批组件用
    let pId = JSON.parse(item.urlParameter)
    let ID = e.target.dataset.item.belongModule
    request.doPostRequest({
      url: apiApprovalManage.API_MESSAGE_READ_TASK,
      data:{id:item.id},
      success: res => {
        console.log(res);
      },
    });
    this.page = 1
    this.getMessageList(0)
    switch (ID) {
      case 4:
        ddUtils.navigateTo({
          url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${pId.id}&projectId=${item.projectId}&type=${item.type}&examineId=${examineId}`
        });
        break;
      case 10:
        ddUtils.navigateTo({
          url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${item.keyId}&type=${false}`
        });
        break;
      // case 8:
      //   if(item.missionDelFlag===1){
      //     ddUtils.showToast({
      //       title: "当前任务已删除，无法操作！"
      //     });
      //   }else{
      //     ddUtils.navigateTo({
      //       url: `/pages/work/page/myTask/taskInfo/taskInfo?id=${JSON.parse(item.urlParameter).id}`
      //     });
      //   }   
      //   break;
      // case 9://竣工结算
      //   ddUtils.navigateTo({
      //     url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?examineId=${examineId}&id=${pId.id}`
      //   });
      //   break;
    }
  //  type 消息类型（1任务消息，2服务消息，3审批消息，4系统公告）
  //  taskStatus 任务状态（1未激活，2未完成，3已拒绝，4已完成，5已超时，6已取消）
  //  jflowType 审核类型（1通过2驳回3待审核）
  if(item.type === 1){//1任务消息
    if(item.missionDelFlag===1){
      ddUtils.showToast({
        title: "当前任务已删除，无法操作！"
      });
    }else{
      ddUtils.navigateTo({
        url: `/pages/work/page/myTask/taskInfo/taskInfo?id=${JSON.parse(item.urlParameter).id}`
      });
    }
  }else if(item.type === 2){//2服务消息
    switch (item.belongModule) {
      case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${item.keyId}`
        });
          break;
      case 3:
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.keyId}`
        });
        break;
      case 8://新增项目
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${pId.id}`
        });
        break;
      case 9://竣工结算
        ddUtils.navigateTo({
          url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?id=${pId.id}`
        });
        break;
    }
  }else if(item.type === 3){//3审批消息
    if (item.jflowType === 3) { //待审核
      switch (item.belongModule) {
        case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${item.keyId}&id=${pId.id}&approvalType=1`
        });
          break;
        case 3:
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${item.keyId}&id=${pId.id}&approvalType=1`
          });
          break;
        case 8://新增项目
          ddUtils.navigateTo({
            url: `/pages/work/page/projectInfo/projectInfo?examineId=${item.keyId}&id=${pId.id}&approvalType=1`
          });
          break;
        case 9://竣工结算
          ddUtils.navigateTo({
            url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?examineId=${item.keyId}&id=${pId.id}`
          });
          break;
      }
    }else if(item.jflowType === 1){//审批通过
      switch (item.belongModule) {
        case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${item.keyId}&id=${pId.id}&approvalType=2`
        });
          break;
        case 3:
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${item.keyId}&id=${pId.id}&approvalType=2`
          });
          break;
        case 8://新增项目
          ddUtils.navigateTo({
            url: `/pages/work/page/projectInfo/projectInfo?examineId=${examineId}&id=${pId.id}`
          });
          break;
        case 9://竣工结算
          ddUtils.navigateTo({
            url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?examineId=${examineId}&id=${pId.id}`
          });
          break;
      }  
    }else if(item.jflowType === 2){//审批驳回
      switch (item.belongModule) {
        case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${item.keyId}&id=${pId.id}&approvalType=3`
        });
          break;
        case 3:
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${item.keyId}&id=${pId.id}&approvalType=3`
          });
          break;
        case 8://新增项目
          ddUtils.navigateTo({
            url: `/pages/work/page/projectInfo/projectInfo?id=${pId.id}`
          });
          break;
          case 9://竣工结算
        ddUtils.navigateTo({
            url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?examineId=${item.keyId}&id=${pId.id}`
          });
          break;
      }  
    }else{
      switch (item.belongModule) {
        case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${pId.id}`
        });
          break;
        case 3:
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${pId.id}`
          });
          break;
        case 8://新增项目
          ddUtils.navigateTo({
            url: `/pages/work/page/projectInfo/projectInfo?id=${pId.id}`
          });
          break;
          case 9://竣工结算
        ddUtils.navigateTo({
            url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?id=${pId.id}`
          });
          break;
      }
    }
  }else if(item.type === 4){//4系统公告
     ddUtils.navigateTo({url:`/pages/message/systemAnnouncement/systemAnnouncement?id=${item.keyId}`})
  }else if(item.type === 5 ) {
    ddUtils.showToast({
      title:"暂不支持移动端访问，请在电脑端进行查看！"
    })
  }
}
});
