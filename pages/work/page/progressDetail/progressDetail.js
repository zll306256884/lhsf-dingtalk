import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";

const app = getApp();

Page({
  data: {
    navbarData: {
      title: "进度计划详情",
    },
  },
  onLoad() {
    // this.showIt()
  },
  progressItemRef(e){
    console.log('我是列表ref',e);
  },
  showIt() {
    console.log(this.selectComponent('#autComponents'))
    // console.log(this.selectComponent('#autComponents'))
  }
});