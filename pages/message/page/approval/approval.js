import { isEmptyArray, isHasMore } from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
// import userServer from "../../../../server/userServer"
import approvalServer from "../../../../server/approvalServer/approvalServer"  //
import request from "../../../../utils/request"
const app = getApp();
Page({
  data: {
    navbarData: {
      title: "我的审批",
    },
    tabIndex: 0,
    targetValue: '1',
    tabList: [{
      title: "待办审批",
      value: '1',
      total: 1
    },
    {
      title: "已办审批",
      value: '2',
      total: 0
    },
    {
      title: "办结审批",
      value: '3',
      total: 0
    }
    ],
    // 漏斗
    visibel: false,
    options: [
      {
        label: "类型",
        prop: "type",
        value: [],
        type: 'select',
        option: [
          // {
          //   id: "1",
          //   label: '进度计划',
          //   selected: false,
          // },
          {
            id: "2",
            label: '招标文件会签',
            selected: false,
          },
          {
            id: "3",
            label: '合同审批流程',
            selected: false,
          }, {
            id: "4",
            label: '款项支付',
            selected: false,
          },
          // {
          //   id: "5",
          //   label: '项目资金计划',
          //   selected: false,
          // },
          {
            id: "6",
            label: '生态伙伴',
            selected: false,
          },
          {
            id: "8",
            label: '新增项目',
            selected: false,
          },
          {
            id: "9",
            label: '竣工结算会签',
            selected: false,
          },
        ],
      },
      // {
      //   label: "申请人",
      //   value: "",
      //   prop: "userName",
      //   type: 'input'
      // },
    ],
    listData: [],//获取列表数据
    taskName: '',//申请人
    funnelParam: {//漏斗参数
      belongModule: [2, 3, 4, 6, 8, 9],
      userName: '',
    },
    belongModule: [],
    dialogScreenDateRef: null,
    // 
    isSearchLoading: false
  },
  pageNum: 1,
  errorView: null,
  hasMore: false,
  isLoading: false,

  _onSaveDialogScreenDateRef: function (ref) {
    this.dialogScreenDateRef = ref;
  },
  tapName(e) {
    this.setData({
      visibel: true
    })
  },
  _bindScreenDateCallBack(data) {
    console.log(data);

  },
  _onSaveErrorViewRef: function (ref) {
    this.errorView = ref;
  },
  _bindErrorRefreshTap: function (e) {
    this.getList();
  },
  onDialog(data) {
    this.setData({
      visibel: data
    })
  },
  onBindSureTap(data) {
    console.log('漏斗的参数', data);
    // let userName = data[1].value;
    // console.log('申请人', userName);
    // let belongModule = data.options[0].value[0].id
    console.log('data[0].option', data[0].option)
    var belongModule = []
    let list = data[0].option
    list.map((item) => {
      if (item.selected) {
        belongModule.push(item.id)
      }
    })
    this.pageNum = 1
    this.setData({
      'funnelParam.belongModule': belongModule,
      belongModule: belongModule
      // 'funnelParam.userName': userName,
    });
    if(belongModule.length < 1){
      this.setData({
        'funnelParam.belongModule': null,
        belongModule: null
        // 'funnelParam.userName': userName,
      });
    }
    // if (belongModule.length > 1) {
    //   ddUtils.showToast({
    //     title: '类型不支持多选'
    //   })
    //   return
    // }
    
    this.onDialog(false)
    this.getList()
  },
  onLoad(query) {
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
    // this.data.targetValue
    console.log(query)
    this.setData({
      tabIndex: Number(query.currentApproval) - 1,
    });
    let targetValue = this.data.tabList[this.data.tabIndex].value
    console.log('targetValue', targetValue)

    this.setData({
      targetValue: targetValue
    });
    // this.getList()
  },
  onShow() {
    // 返回回到这个页面需要调用的接口
    this.pageNum = 1
    this.getList()
    this.getCount()
  },
  events: {
    // 返回的时候  不需要多层
    onBack() {
      // ddUtils.navigateTo({
      //   url: '/pages/work/index'
      // })
    },
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    // this.getList()
  },
  // tab切换组件
  onNavTabChange: function (index) {
    console.log('index', index)
    this.setData({
      tabIndex: index,
    });
    this.pageNum = 1
    let targetValue = this.data.tabList[this.data.tabIndex].value
    console.log('targetValue', targetValue)

    this.setData({
      targetValue: targetValue
    });
    this.getList()
  },
  // 任务名称搜索
  onChange(value) {
    this.setData({
      taskName: value
    })
    this.pageNum = 1
    this.getList()
  },
  // 搜索确认
  onConfirm(value) {
    this.setData({
      taskName: value
    })
    this.pageNum = 1
    this.getList()
  },
  //判断是否为空
  _loadDone: function (res) {
    this.isLoading = false;
    this.errorView._hideLoadMore();

    if (isEmptyArray(this.data.listData)) {
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
  // 获取基本信息
  getList: function () {
    this.setData({isSearchLoading: true})
    let param = {
      "asc": true,
      "pageNum": this.pageNum,
      "pageSize": 10,
      "account": app.globalData.userInfo.userAccount,
      taskName: this.data.taskName,
      // "userName": "",
      // "belongModule": this.data.options[0].value,//事项类型
      // "userName": this.data.options[1].value,//申请人
      "showType": this.data.targetValue, //状态
      'belongModule': this.data.funnelParam.belongModule,
      // 'userName': this.data.userName,
      // ...this.data.funnelParam
    }
    console.log('param', param)
    // return
    // return new Promise((resolve, reject) => {
    request.doPostRequest({
      url: approvalServer.API_SELECT_LIST,
      showLoading: false,
      data: param,
      success: res => {
        console.log('res.data', res.data)
        this.hasMore = isHasMore(res.data.records);
        // let page = this.pageNum + 1
        this.pageNum++
        this.setData({
          listData: res.data.records || []
          // pageNum: page
        });
        // resolve(res.data)
        this.setData({isSearchLoading: false})
      },
      complete: res => {
        this._loadDone(res);
      },
      fail: res => {
        this.setData({isSearchLoading: false})
        reject(res)
      }
    });
    // })
  },
  // 加载数据
  getMoreDataList() {
    console.log('chufal2')
    // debugger
    //防止重复加载和没有更多数据
    if (this.isLoading || !this.hasMore) {
      return;
    }
    this.isLoading = true;
    this.errorView._showLoadMore();
    // let page = this.pageNum + 1
    console.log('pageNum', this.pageNum)
    // return
    let param = {
      "asc": true,
      "pageNum": this.pageNum,
      "pageSize": 10,
      "account": app.globalData.userInfo.userAccount,
      taskName: this.data.taskName,
      // "userName": "",
      // "belongModule": this.data.options[0].value,//事项类型
      // "userName": this.data.options[1].value,//申请人
      "showType": this.data.targetValue, //状态
      ...this.data.funnelParam
    }
    console.log('param', param)
    // return
    // return new Promise((resolve, reject) => {
    request.doPostRequest({
      url: approvalServer.API_SELECT_LIST,
      showLoading: false,
      data: param,
      success: res => {
        console.log('res.data', res.data)
        this.hasMore = isHasMore(res.data.records);
        this.pageNum++
        this.setData({
          // listData: res.data.records
          listData: this.data.listData.concat(res.data.records) || []
        });
        console.log('listData数据总共：', this.data.listData)
        // resolve(res.data)
      },
      complete: res => {
        this._loadDone(res);
      },
      fail: res => {
        reject(res)
      }
    });
    // })

    // let params = {
    //   asc: false,
    //   pageNum: this.page,
    //   pageSize: 10,
    //   params: { status: this.data.tabIndex + 1 },
    //   sort: 'createTime'
    // }
    // request.doPostRequest({
    //   url: apiMesssageServer.API_REQUEST_LIST,
    //   data: params,
    //   success: res => {
    //     console.log(res.data)
    //     this.page++;
    //     this.hasMore = isHasMore(res.data.records);

    //     this.setData({
    //       dataList: this.data.dataList.concat(res.data.records) || []
    //     })
    //   },
    //   complete: res => {
    //     this._loadDone(res);
    //   }
    // })
  },
  // 获取点数 
  getCount: function () {
    let param = {
      belongModule: [2, 3, 4, 6, 8, 9]
    }
    console.log('param', param)
    // return
    // return new Promise((resolve, reject) => {
    request.doPostRequest({
      url: approvalServer.API_SELECT_COUNT,
      showLoading: false,
      data: param,
      success: res => {
        console.log('res.data', res.data)
        let waitNum = res.data.waitNum;
        let completedNum = res.data.completedNum
        let overNum = res.data.overNum
        this.setData({
          'tabList[0].total': waitNum,
          // 'tabList[1].total': completedNum,
          // 'tabList[2].total': overNum,
        });
        // resolve(res.data)
      },
      complete: res => {
        this._loadDone(res);
      },
      fail: res => {
        reject(res)
      }
    });
    // })
  },
  onReachBottom() {
    // 页面被拉到底部
    console.log('chufal1')
    this.getMoreDataList()
  },

  // 点击跳转
  toDetail(e) {
    console.log(e);
    let temp = e.currentTarget.dataset.item.belongModule
    //1-进度计划 2-招标文件会签 3-合同审批流程 4-款项支付 5-项目资金计划 6-生态伙伴
    let id = e.target.dataset.item.keyId
    let projectId = e.target.dataset.item.projectId
    let showType = e.target.dataset.item.showType
    let examineId = e.target.dataset.item.id //审批组件用
    // 下面的
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
              url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?examineId=${examineId}&id=${id}&approvalType=${showType}`
            });
            break;
          case 3:
            ddUtils.navigateTo({
              url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?examineId=${examineId}&id=${id}&approvalType=${showType}`
            });
            break;
          case 4:
            ddUtils.navigateTo({
              url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${id}&projectId=${projectId}&showType=${showType}&examineId=${examineId}`
            });
            break;
          case 8:
            ddUtils.navigateTo({
              url: `/pages/work/page/projectInfo/projectInfo?examineId=${examineId}&id=${id}&approvalType=${showType}`
            });
            break;
          case 9:
            ddUtils.navigateTo({
              url: `/pages/work/page/beCompletedRegisterDetail/beCompletedRegisterDetail?examineId=${examineId}&id=${id}&approvalType=${showType}`
            });
            break;
        }
      },
      complete: res => {
        // this._loadDone(res);
      }
    })
    // return


    // console.log('item', item)
    // if (item.belongModule == 1) {
    //   // 进度
    // }
    // if (item.belongModule == 2) {
    //   // 招标文件会签
    // }
    // if (item.belongModule == 3) {
    //   // 合同审批流程
    // }
    // if (item.belongModule == 4) {
    //   // 款项支付
    // }
    // if (item.belongModule == 5) {
    //   // 项目资金计划
    // }
    // if (item.belongModule == 6) {
    //   // 生态伙伴
    // }
  },

  // 跳转页面示例
  tothePage() {
    dd.navigateTo({
      url: './page/personalinfo/index'
    })
  },

  onReset(e) {
    console.log('onReset', e);
  },


  onOptionData1(data) {
    console.log(data, '子组件触发父组件');
  },
  // onNavTabChange: function (index) {
  //   this.setData({
  //     tabIndex: index
  //   });
  //   let targetValue = this.data.tabList[this.data.tabIndex].value

  //   console.log('targetValue', targetValue)
  // },
  backAudit(e){
    let item = e.currentTarget.dataset.item
    ddUtils.showModal({
      title:'请确认',
      content: "确定撤回审批?",
      success: res => {
        if (res.confirm) {
          request.doPostRequest({
            url: approvalServer.API_BACK_AUDIT,
            data: {account: app.globalData.userInfo.userAccount,no:item.no, workId:item.workId},
            success: res => {
              this.pageNum = 1
              this.getList()
              this.getCount()
            }
          })
        }
      }
    });
  }
});