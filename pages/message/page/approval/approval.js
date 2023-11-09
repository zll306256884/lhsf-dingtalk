import {
  isEqual,
  isEmptyArray
} from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
// import userServer from "../../../../server/userServer"
import approvalServer from "../../../../server/approvalServer/approvalServer"
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
      name: "待办审批",
      value: '1',
      total: 0
    },
    {
      name: "已办审批",
      value: '2',
      total: 0
    },
    {
      name: "办结审批",
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
          {
            id: "1",
            label: '进度计划',
            selected: false,
          },
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
          {
            id: "5",
            label: '项目资金计划',
            selected: false,
          },
          {
            id: "6",
            label: '生态伙伴',
            selected: false,
          },
        ],
      },
      {
        label: "申请人",
        value: "",
        prop: "userName",
        type: 'input'
      },
    ],
    listData: [],//获取列表数据
    funnelParam: {//漏斗参数
      belongModule: '',
      userName: '',
    },
    dialogScreenDateRef: null,
    // 

  },
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
  onDialog(data) {
    this.setData({
      visibel: data
    })
  },
  onBindSureTap(data) {
    console.log('漏斗的参数', data);
    let userName = data.options[1].value
    let belongModule = data.options[0].value[0].id
    console.log('belongModule', belongModule)
    console.log('userName', userName)
    // let param ={
    //   belongModule:
    // }
    // return
    this.setData({
      'funnelParam.belongModule': belongModule,
      'funnelParam.userName': userName,
    });
    this.onDialog(false)
    this.getList()
  },
  onLoad(query) {
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    this.getList()
  },
  // tab切换组件
  onNavTabChange: function (index) {
    console.log('index', index)
    this.setData({
      tabIndex: index,
    });
    let targetValue = this.data.tabList[this.data.tabIndex].value
    console.log('targetValue', targetValue)

    this.setData({
      targetValue: targetValue
    });
    this.getList()
  },
  // 获取基本信息
  getList: function () {
    let param = {
      "asc": true,
      "pageNum": 1,
      "pageSize": 1000,
      "account": "admin",
      "userName": "",
      // "belongModule": this.data.options[0].value,//事项类型
      // "userName": this.data.options[1].value,//申请人
      "showType": this.data.targetValue, //状态
      ...this.data.funnelParam
    }
    console.log('param', param)
    // return
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: approvalServer.API_SELECT_LIST,
        showLoading: false,
        data: param,
        success: res => {
          console.log('res.data', res.data)
          this.setData({
            listData: res.data.records
          });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })
  },

  // 点击跳转
  toDetail(e) {
    let temp = e.currentTarget.dataset.item.belongModule
    let id = e.target.dataset.item.keyId
    switch (temp) {
      case 4:
          ddUtils.navigateTo({
            url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${id}`
          });
          break;
    }
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

});