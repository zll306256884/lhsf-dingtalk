import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import logServer from "../../../../server/dataBoardServer/log.js";

const app = getApp();

Page({
  data: {
    navbarData: {
      title: "工作日志",
    },
    showAll:0,
    items1: [
      { text: '重大', value: 1},
      { text: '全部', value:0 },
    ],
    logType: 0,
    logList:[],//查询的数据

  },
  onLoad() { 
    this.getDetail()
  },
  // 获取数据详情
  getDetail() {
    return new Promise((resolve, reject) => {
      request.doPostRequest({
        url: logServer.API_LOG_LIST,
        showLoading: false,
        data: {
          "logType": this.data.logType,//	日志类型 0普通1重大事件
          // "projectId": "12019020001" //项目id
          "projectId": "12019020001" //项目id
        },
        success: res => {
          console.log('res.data', res.data)
          this.setData({
            logList: res.data
          });
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      });
    })

  },
  // 点击切换
  handleChange(value, items, e) {
    this.setData({
      logType:value,
    });
    this.getDetail()
    console.log(value, items, e);
  },
  // 点击全文
  expandedIt(e){
    console.log('全文',e)
  }
});
