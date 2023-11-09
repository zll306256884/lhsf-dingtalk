import request from "../../../../utils/request"
import apiMesssageServer from "../../../../server/messageServer"
import { isEmptyArray,isHasMore } from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"


const app = getApp();
Page({
  data: {
    navbarData: {
      title: '我的请求'
    },
    tabList: [{
        name: '待办请求',
        total:0
      },{
        name: '进行中请求',
        total:0
      },{
        name: '已办请求',
        total:0
      },
    ],
    tabIndex: 0,
    dataList: []
  },

  page: 1,
  errorView: null,
  hasMore: false,
  isLoading: false,

  onLoad() {
    this.getDataList()
    this.getCount()
  },
  onReachBottom() {
    this.getMoreDataList();
  },
  _onSaveErrorViewRef: function (ref) {
    this.errorView = ref;
  },
  _bindErrorRefreshTap: function (e) {
    this.getDataList();
  },
  getDataList(){
    let params = {
      asc: false,
      pageNum: this.page,
      pageSize: 10,
      params: {status: this.data.tabIndex + 1},
      sort: 'createTime'
    }
    request.doPostRequest({
      url: apiMesssageServer.API_REQUEST_LIST,
      data: params,
      success: res => {
        console.log(res.data)
        this.page++;
        this.hasMore = isHasMore(res.data.records);

        this.setData({
          dataList: res.data.records || []
        })
      },
      complete: res => {
        this._loadDone(res);
      }
    })
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
      params: {status: this.data.tabIndex + 1},
      sort: 'createTime'
    }
    request.doPostRequest({
      url: apiMesssageServer.API_REQUEST_LIST,
      data: params,
      success: res => {
        console.log(res.data)
        this.page++;
        this.hasMore = isHasMore(res.data.records);

        this.setData({
          dataList: this.data.dataList.concat(res.data.records) || []
        })
      },
      complete: res => {
        this._loadDone(res);
      }
    })
  },
  getCount(){
    request.doPostRequest({
      url: apiMesssageServer.API_COUNT_MATTER,
      data: {userId: app.globalData.userInfo.userId},
      success: res => {
        let list = this.data.tabList
        console.log(list);
        list[0].total = res.data.waitNum
        list[1].total = res.data.handleNum
        console.log(list);
        // this.setData({
        //   tabList: list
        // })
      }
    })
  },
  onNavTabChange(index){
    this.setData({
      tabIndex: index
    });
    this.page = 1
    this.getDataList()
  },
  //判断是否为空
  _loadDone: function (res) {
    this.isLoading = false;
    this.errorView._hideLoadMore();

    if (isEmptyArray(this.data.dataList)) {
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
  ToDetail(e){
    console.log(e);
    let {item} = e.currentTarget.dataset
    console.log(item);
    // type 1-进度计划 2-招标文件会签 3-合同审批流程 4-款项支付 5-资金使用计划 6-新增项目 7-变更登记 8-竣工结算登记
    //requestType 0待办 1进行中 3已办
    switch(item.type){
      case 1:
        break;
      case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${item.keyId}&requestType=${this.data.tabIndex}`
        });
        break;
      case 3:
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.keyId}&requestType=${this.data.tabIndex}`
        });
        break;
      case 4:
        ddUtils.navigateTo({
          url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${item.keyId}&requestType=${this.data.tabIndex}`
        });
        break;
      case 5:
        ddUtils.navigateTo({
          url: `/pages/work/page/projectCapital/capitalPlan/capitalPlan?id=${item.keyId}&requestType=${this.data.tabIndex}`
        });
        break;
      case 6:
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${item.keyId}&requestType=${this.data.tabIndex}`
        });
        break;
      case 7:
        ddUtils.navigateTo({
          url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${item.keyId}&requestType=${this.data.tabIndex}`
        });
        break;
      case 8:
        ddUtils.navigateTo({
          url: ``
        });
        break;
    }
  }
});
