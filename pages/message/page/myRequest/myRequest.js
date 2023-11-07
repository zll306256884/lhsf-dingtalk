import request from "../../../../utils/request"
import apiMesssageServer from "../../../../server/messageServer"
import { isHasMore } from "../../../../utils/utils"

const app = getApp();
Page({
  data: {
    navbarData: {
      title: '我的请求'
    },
    tabList: [{
        name: '待办请求'
      },{
        name: '进行中请求'
      },{
        name: '已办请求'
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
  },

  getDataList(){
    let params = {
      asc: false,
      pageNum: 1,
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
      }
    })
  },
  onNavTabChange(index){
    this.setData({
      tabIndex: index
    });

    this.getDataList()
  }
});
