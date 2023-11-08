

Page({
  data: {
    visibel: false,
    navbarData: {
      title: "xxxxx项目名称"
    },
    tabs: [
      {
        title: "项目概览"
      },
      {
        title: "项目进度"
      },
      {
        title: "现场实景"
      },
      {
        title: "投资管控"
      },
      {
        title: "招标进度"
      },
      {
        title: "工作日志"
      }
    ],
    currentTabIndex:0,
  },
  onLoad() {},
  onTabChange(e){
    this.setData({
      currentTabIndex:e
    })
  },
});
