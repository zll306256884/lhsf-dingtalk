import apiDataBoardServer from "../../../../server/dataBoardServer";
import request from "../../../../utils/request";
import ddUtils from "../../../../utils/ddUtils";
const markers = [];
const longitude = 121.131229;
const latitude = 28.845441;
const includePoints = [
  {
    latitude: 28.845441,
    longitude: 121.131229
  }
];
Component({
  mixins: [],
  props: {},
  data: {
    scale: 12,
    longitude,
    latitude,
    includePoints,
    markers,
    mapCtx: null,
    mapV2Enable: dd.canIUse("map.optimize"),
    projectList: [],
    statusList: [
      {
        title: "全部",
        value: null
      },
      {
        title: "在建",
        value: 1
      },
      {
        title: "延期",
        value: 2
      },
      {
        title: "投入未使用",
        value: 3
      },
      {
        title: "投入使用",
        value: 4
      }
    ],
    tabIndex: 0,
    currentItem:0,
    params: {
      projectId: "",
      projectName: "",
      projectStatus: ""
    }
  },
  dialogScreenProject: null,
  didMount() {
    this.initMap();
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    initMap() {
      this.mapCtx = dd.createMapContext("map");
      this.getProjectList();
      this.setData({
        currentItem:5
      })
    },
    onSaveDialogScreenprojecteRef(ref) {
      this.dialogScreenProject = ref;
    },
    onSearchProject() {
      console.log(this.dialogScreenProject);
      if (this.dialogScreenProject) this.dialogScreenProject._showDialog();
    },
    onTabChange(e) {
      this.setData({
        tabIndex: e
      });
      this.data.params.projectName = "";
      if (e === 0) {
        this.data.params.projectStatus = null;
      } else {
        this.data.params.projectStatus = e;
      }
      this.setData({
        params: this.data.params
      });
      this.getProjectList();
    },
    onSelectItem(e) {
      let projectId = e.currentTarget.dataset.item.projectId;
      let projectName = e.currentTarget.dataset.item.projectName;
      ddUtils.navigateTo({
        url: `/pages/databoard/page/projectInfo/index?projectId=${projectId}&projectName=${projectName}`
        // url: `/pages/databoard/page/projectInfo/index?json=${JSON.stringify(
        //   e.currentTarget.dataset.item
        // )}`
      });
    },
    bindChooseProjectCallBack(data) {
      this.data.params.projectName = data.name;
      this.getProjectList();
    },
    getProjectList() {
      request.doPostRequest({
        url: apiDataBoardServer.API_MAP_PROJECT_LIST,
        data: this.data.params,
        success: res => {
          this.setData({
            projectList: res.data
          });
          this.updateComponents();
        }
      });
    },

    updateComponents() {
      const newMarkers = this.data.projectList
        .filter(i => i.cityCapitalX && i.cityCapitalY)
        .map((item, index) => {
          return {
            id:index + 1,
            width: 64,
            height: 64,
            joinCluster: true,
            longitude: Number(parseFloat(item.cityCapitalX).toFixed(6)),
            latitude: Number(parseFloat(item.cityCapitalY).toFixed(6)),
            iconPath: require(`../../../../assets/images/map/${item.projectType}-${item.projectStatus}.png`),
            callout: {
              content: item.projectName
            }
          };
        });
      const newIncludePoints = newMarkers.map(item => {
        return {
          latitude: item.latitude,
          longitude: item.longitude
        };
      });
      this.mapCtx.updateComponents({
        scale: 12,
        longitude: 121.131229,
        latitude: 28.845441,
        setting: {
          gestureEnable: 1, // 开启手势功能
          showScale: 1, // 显示比例尺
          showCompass: 1, // 显示指南针
          tiltGesturesEnabled: 1 // 开启双指下滑手势
        },
        markers: newMarkers,
        includePoints: newIncludePoints
      });
      this.mapCtx.showsCompass({isShowsCompass:false});
      this.mapCtx.showsScale({isShowsScale:false});
    },
    handleSwiper(e){
      console.log("??????????????????????????",e);
      this.setData({
        currentItem:e.detail.current
      })
    },
    // 重置地图
    // demoResetMap() {
    //   this.setData({
    //     scale: 11,
    //     longitude: "121.131229",
    //     latitude: "28.845441",
    //     includePoints: "",
    //     groundOverlays: []
    //   });
    //   if (dd.canIUse("createMapContext.return.clearRoute")) {
    //     this.mapCtx.clearRoute();
    //   }
    // },
    // 获取中心点坐标
    // demoGetCenterLocation() {
    //   if (dd.canIUse("createMapContext")) {
    //     this.mapCtx.getCenterLocation({
    //       success: res => {
    //         console.log(res.longitude, res.latitude, res.scale);
    //       }
    //     });
    //   }
    // },
    // marker动画
    // demoMarkerAnimation() {
    //   if (!dd.canIUse('createMapContext.return.updateComponents')) {
    //     dd.alert({
    //       title: '不支持',
    //       content: mapV2Message
    //     });
    //     return;
    //   }
    //   this.mapCtx.updateComponents({
    //     'markers':animMarker,
    //   });
    //   this.mapCtx.updateComponents({
    //     command:{
    //       markerAnim:[{markerId:1,type:0},],
    //     }
    //   });
    // },
    // 手势的放大与缩小
    demoGesture() {
      if (dd.canIUse("createMapContext")) {
        myGestureEnabled = (myGestureEnabled + 1) % 2;
        this.mapCtx.gestureEnable({ isGestureEnable: myGestureEnabled });
      }
    },
    // 视野发生变化时触发
    regionchange(e) {
      console.log("regionchange", e);
    },
    // 点击 Marker 时触发
    markertap(e) {
      console.log("marker tap", e);
    },
    // 点击地图时触发
    tap() {
      this.getProjectList();
      console.log("tap");
    },
  }
});
