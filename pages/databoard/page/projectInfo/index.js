Page({
  data: {
    navbarData: {
      title: ""
    },
    scrollTop: 0,
    tabs: [
      {
        title: "工程项目概览"
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
        title: "招标管理"
      },
      {
        title: "项目日志"
      }
    ],
    currentTabIndex: 0,
    projectInfo: {},
    alter: "",
    dingTalkId: "",
    userName: "",
    childrenTab: null
  },
  mapRef: '',

  onLoad(option) {
    console.log(option);
    this.data.alter = option.alter;
    this.data.dingTalkId = option.dingTalkId;
    this.data.projectInfo.projectName = option.projectName;
    this.data.projectInfo.projectId = option.projectId;
    this.data.navbarData.title = option.projectName;
    if (option.type) {
      console.log(option.type);
      this.setData({
        currentTabIndex: Number(option.type)
      });
    }
    this.setData({
      projectInfo: this.data.projectInfo,
      navbarData: this.data.navbarData,
      userName: option.userName
    });
    if (option.childrenTab) {
      this.setData({
        childrenTab: option.childrenTab
      });
    }
  },
  onShow(option) {
    console.log(option);
  },
  onSaveMapRef(ref) {
    this.mapRef = ref;
  },
  onTabChange(e) {
    this.setData({
      currentTabIndex: e
    });
    if (e === 0) {
      setTimeout(() => {
        this.mapRef.initMap();
      }, 0);
     
    }
  },
  onPageScroll(ev) {
    if (this.data.currentTabIndex === 0 ) {//&& this.mapRef
      console.log("页面滚动",ev.scrollTop);
      let _this = this;
       //当滚动的top值最大或者最小时，由于在手机实测小程序的时候会发生滚动条回弹，所以为了解决回弹，设置默认最大最小值
      // if (ev.scrollTop <= 0) {
      //   ev.scrollTop = 0;
      // } else if (ev.scrollTop > dd.getSystemInfoSync().windowHeight) {
      //   ev.scrollTop = dd.getSystemInfoSync().windowHeight;
      // }
      //判断浏览器滚动条上下滚动
      if (
        ev.scrollTop > this.data.scrollTop ||
        ev.scrollTop == dd.getSystemInfoSync().windowHeight
      ) {
        this.mapRef.onShowUnit();
      } else if(ev.scrollTop <= 200){
        this.mapRef.onHideUnit();
      }
      // 给scrollTop重新赋值
      setTimeout(function() {
        _this.setData({
          scrollTop: ev.scrollTop
        });
      }, 0);
    }
  }
});
