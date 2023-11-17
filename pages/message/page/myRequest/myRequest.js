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
        title: '待办请求',
        total:0,
        badge: true,
      },{
        title: '进行中请求',
        total:0,
        badge: true,
      },{
        title: '已办请求',
        total:0
      },
    ],
    tabIndex: 0,
    dataList: [],
    visibel: false,
    options: [
      {
        label: "事项类型",
        prop: "type",
        value: [],
        type: 'select',
        option: [
          {
            id: 1,
            label: '进度计划',
            selected: false,
          },
          {
            id: 2,
            label: '招标文件会签',
            selected: false,
          },
          {
            id: 3,
            label: '合同审批流程',
            selected: false,
          }, {
            id: 4,
            label: '款项支付',
            selected: false,
          },
          {
            id: 5,
            label: '资金使用计划',
            selected: false,
          },
          {
            id: 6,
            label: '新增项目',
            selected: false,
          },
          {
            id: 7,
            label: '变更登记',
            selected: false,
          },
          {
            id: 8,
            label: '竣工结算登记',
            selected: false,
          },{
            id: 9,
            label: '生态伙伴',
            selected: false,
          },
        ],
      }
    ],
    type: []
  },

  page: 1,
  errorView: null,
  hasMore: false,
  isLoading: false,

  onLoad(options) {
    if(options.requestStatus){
      this.setData({
        tabIndex: Number(options.requestStatus)
      })
    }
  },
  onShow() {
    this.setData({
      options: JSON.parse(JSON.stringify(this.data.options))
    })
    this.page = 1
    this.getDataList()
    this.getCount()
  },
  events: {
    onBack() {
      ddUtils.navigateTo({
        url: '/pages/work/index'
      })
    },
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
  filterDialog(){
    this.onDialog(true)
  },
  onDialog(data) {
    this.setData({
      visibel: data
    })
  },
  onBindSureTap(data) {
    console.log(data)
    let filterValue = data[0].option
    let list = filterValue.filter(e => e.selected === true)

    this.page = 1
    this.onDialog(false)
    if(list){
      let type = list.map(e => e.id)
      this.setData({
        type
      })
      this.getDataList(type)
    }else{
      this.setData({
        type: []
      })
      this.getDataList()
    }
  },
  getDataList(type){
    let params = {
      asc: false,
      pageNum: this.page,
      pageSize: 10,
      params: {status: this.data.tabIndex + 1, type: type},
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
        this.setData({
          tabList: list
        })
      }
    })
  },
  onNavTabChange(index){
    this.setData({
      tabIndex: index
    });
    this.page = 1
    this.getDataList(this.data.type)
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
        ddUtils.navigateTo({
          url: `/pages/work/page/requestProgressDetail/requestProgressDetail?planId=${item.keyId}&requestType=${this.data.tabIndex}&projectId=${item.projectId}`
        });
        break;
      case 2:
        ddUtils.navigateTo({
          url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${item.keyId}&requestType=${this.data.tabIndex}&deleteId=${item.id}`
        });
        break;
      case 3:
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.keyId}&requestType=${this.data.tabIndex}&deleteId=${item.id}`
        });
        break;
      case 4:
        ddUtils.navigateTo({
          url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${item.keyId}&requestType=${this.data.tabIndex}&status=${item.status}`
        });
        break;
      case 5:
        ddUtils.navigateTo({
          url: `/pages/work/page/projectCapital/capitalPlan/capitalPlan?json=${JSON.stringify(item)}`
        });
        break;
      case 6:
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${item.keyId}&requestType=${this.data.tabIndex}&deleteId=${item.id}`
        });
        break;
      case 7:
        ddUtils.navigateTo({
          url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${item.keyId}&requestType=${this.data.tabIndex}`
        });
        break;
      case 8:
        ddUtils.navigateTo({
          url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?id=${item.keyId}`
        });
        break;
    }
  }
});
