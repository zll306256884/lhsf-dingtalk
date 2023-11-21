
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
    alter:'',
    dingTalkId:"",
    userName:'',
    childrenTab: null
  },
  mapRef:null,

  onLoad(option) {
    console.log(option);
    this.data.alter = option.alter
    this.data.dingTalkId = option.dingTalkId
    this.data.projectInfo.projectName=option.projectName
    this.data.projectInfo.projectId=option.projectId
    this.data.navbarData.title = option.projectName
    if(option.type === '3' || option.type === 3){
      this.setData({
        currentTabIndex: 4
      })
    }
    if(option.current === '3'){
      this.setData({
        currentTabIndex: 3
      })
    }
    this.setData({
      projectInfo:this.data.projectInfo,
      navbarData: this.data.navbarData,
      userName:option.userName
    })
    if(option.childrenTab){
      this.setData({
        childrenTab: option.childrenTab
      })
    }
  },
  onShow(option){
 console.log(option);
  },
  onSaveMapRef(ref){
    this.mapRef=ref
  },
  onTabChange(e) {
    this.setData({
      currentTabIndex: e
    })
    if(e===0){
      this.mapRef.initMap()
    }
  },
  // onPageScroll(){
  // this.mapRef.onShowUnit()
  // },
  onPullDownRefresh(){
  this.mapRef.onHideUnit()
  dd.stopPullDownRefresh()
  },
});
