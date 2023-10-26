import request from "../../utils/request"
import apiApprovalManage from "../../server/workServer"

Page({
  onLoad(option) {
    this. getRecordList()
    
  },
    //获取列表
    getRecordList: function () {
      let data = {
          account:'admin',
          pageNum: 1,
          pageSize: 10,
      };
      request.doPostRequest({
          url:apiApprovalManage.API_APPROVAL_MANAGE_WAIT_LIST,
          data,
          success: res => {
          },
          complete: res => {
          }
      });
  },
});