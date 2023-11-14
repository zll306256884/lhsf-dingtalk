
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
    console.log(option);
    this.data.projectInfo.projectName=option.projectName
    this.data.projectInfo.projectId=option.projectId
    this.data.navbarData.title = option.projectName
    if(option.type === '3'){
      this.setData({
        currentTabIndex: 4
      })
    }
    this.setData({
      projectInfo:this.data.projectInfo,
      navbarData: this.data.navbarData
    })
  },
  onTabChange(e) {
    this.setData({
      currentTabIndex: e
    })
  },
});
