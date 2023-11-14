
Page({
  data: {
    navbarData: {
      title: "项目"
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
    currentTabIndex: 0,
    projectInfo: {},
  },
  onLoad(option) {
    const params = JSON.parse(option.json)
    console.log(JSON.parse(option.json));
    this.setData({
      projectInfo: params
    })
    this.data.navbarData.title = params.projectName
    this.setData({
      navbarData: this.data.navbarData
    })
  },
  onTabChange(e) {
    this.setData({
      currentTabIndex: e
    })
  },
});
