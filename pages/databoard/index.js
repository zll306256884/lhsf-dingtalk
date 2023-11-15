
Page({
  data: {
    navbarData: {
      title: "临海市项目工程数据看板"
    },
    tabs: [
      {
        title: "项目概览"
      },
      {
        title: "年度资金管控"
      },
      {
        title: "年度招标进度"
      }
    ],
    currentTabIndex: 0,
  },
  mapRef:null,
  onLoad() {
  },
  onSaveMapRef(ref){
    this.mapRef=ref
  },
  onTabChange(e) {
    this.setData({
      currentTabIndex: e
    });
    if(e===0){
      console.log("??????????",this.mapRef);
      this.mapRef.initMap()
    }
  }
});
