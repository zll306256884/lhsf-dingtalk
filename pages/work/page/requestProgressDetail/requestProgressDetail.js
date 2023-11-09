import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import progressServer from "../../../../server/workServer/progressServer";

const app = getApp();

Page({
  data: {
    navbarData: {
      title: "进度计划",
    },
    listData: [1, 2, 3, 4, 5],//列表数据
    topData: {},//头部数据
    projectId: '',//项目id
    planId: "",//计划id
    flagNode: '',//是否为里程碑节点
  },
  onLoad(query) {
    console.log('query', query)
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
    this.setData({
      projectId: query.id ? query.id : '12019020004',
      planId: query.planId ? query.planId : '1717058334583947264'
    });
    // console.log(this.data.projectId);
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
    this.getList()
    this.getTopList()
  },
  progressItemRef(e) {
    console.log('我是列表ref', e);
  },
  showIt() {
    console.log(this.selectComponent('#autComponents'))
    // console.log(this.selectComponent('#autComponents'))
  },
  // 获取基本信息
  getList: function () {
    let param = {
      "projectId": this.data.projectId,
      'flagNode': this.data.flagNode
    }
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: progressServer.API_PROGRESS_LIST,
        showLoading: false,
        data: param,
        success: res => {
          console.log('res.data', res.data)
          res.data.map((item) => {
            item.responsible = JSON.parse(item.responsible)
          })
          this.setData({
            listData: res.data
          });
          // console.log('this.data.listData请求进度计划',this.data.listData)
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })
  },
  // 获取头部信息
  getTopList() {
    let param = {
      "createBy": "",
      "enabled": 0,
      "id": this.data.planId,
      "producerTime": {
        "end": "",
        "start": ""
      },
      "projectId": "",
      "projectName": "",
      "version": 0
    }
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: progressServer.API_TOP_MESSAGE,
        showLoading: false,
        data: param,
        success: res => {
          console.log('头部数据res.data', res.data)
          // res.data.map((item) => {
          //   item.responsible = JSON.parse(item.responsible)
          // })
          this.setData({
            topData: res.data
          });
          // console.log('this.data.listData请求进度计划',this.data.listData)
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })

  },
  // 点击里程碑节点
  milestoneNode(e) {
    console.log(2333)
    let code
    // 1  里程碑  0  非里程碑   空字符串   全量
    if (this.data.flagNode) {
      this.setData({
        flagNode: ''
      });
    } else {
      this.setData({
        flagNode: 1
      });
    }
    this.getList()
  },
});