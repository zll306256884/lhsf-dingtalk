import apiDataBoardServer from "../../../../server/dataBoardServer";
import request from "../../../../utils/request";
import ddUtils from "../../../../utils/ddUtils";
import map from "../../../../utils/map";

const mapV2Message = '客户端版本过低，请升级客户端并开启V2引擎。'
const markers = [
  // {
  //   longitude: 121.131229,
  //   latitude: 28.845441,
  //   id:1,
  //   width: 64,
  //   height: 64,
  //   iconPath: `/assets/images/map/1-1.png`,
  //   callout: {
  //     content: '你好'
  //   }
  // }
];
const settings ={
  // 手势
  gestureEnable: 1,
  // 比例尺
  showScale: 0,
  // 指南针
  showCompass: 0,
  //双手下滑
  tiltGesturesEnabled: 1,
  // 交通路况展示
  trafficEnabled: 0,
  // 地图 POI 信息
  showMapText: 0,
  // 高德地图 logo 位置
  logoPosition: {
   centerX: 150,
   centerY: 90
  }
 }
const longitude = 121.131229;
const latitude = 28.845441;
const includePoints = [
  // {
  //   latitude: 28.845441,
  //   longitude: 121.131229
  // }
];
Component({
  mixins: [],
  props: {},
  data: {
    scale: 9,
    longitude,
    latitude,
    includePoints,
    markers,
    settings,
    mapV2Enable: dd.canIUse("map.optimize"),
    projectList: [],
    statusList: [
      {
        title: "全部",
        value: null
      },
      {
        title: "在建",
        value: 0
      },
      {
        title: "延期",
        value: 0
      },
      {
        title: "投入未使用",
        value: 0
      },
      {
        title: "投入使用",
        value: 0
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
  mapCtx: null,
  didMount() {
    this.initMap();
    // dd.alert({
    //   content: dd.ExtSDKVersion || dd.SDKVersion,
    // });
  },
  didUpdate() {
  },
  didUnmount() {},
  methods: {
    initMap() {
      this.mapCtx = dd.createMapContext("map");
      this.getProjectList();
    },
    onSaveDialogScreenprojecteRef(ref) {
      this.dialogScreenProject = ref;
    },
    onSearchProject() {
      console.log(this.dialogScreenProject);
      if (this.dialogScreenProject) this.dialogScreenProject._showDialog();
    },
    onBlowUp(){
      this.setData({
        scale:this.data.scale + 1
      })
      this.updateComponents();
    },
    onBlowDown(){
      this.setData({
        scale:this.data.scale - 1
      })
      this.updateComponents();
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
      });
    },
    bindChooseProjectCallBack(data) {
      this.data.params.projectName = data.name;
      this.getProjectList();
    },
    getProjectList() {
      request.doPostRequest({
        url: apiDataBoardServer.API_MAP_PROJECT_COUNT_STAGE,
        data: this.data.params,
        success: res => {
          this.data.statusList[1].value=res.data.doingNum
          this.data.statusList[2].value=res.data.delayNum
          this.data.statusList[3].value=res.data.unUseNum
          this.data.statusList[4].value=res.data.useNum
          this.setData({
            statusList: this.data.statusList
          });
        }
      })
     
      request.doPostRequest({
        url: apiDataBoardServer.API_MAP_PROJECT_LIST,
        data: this.data.params,
        success: res => {
         const list = res.data.map((item,index)=>{
            return{
              ...item,
              index:index,
              xy: map.wgs84togcj02(item.cityCapitalX, item.cityCapitalY),
              mainImgUrl:item.mainImg?JSON.parse(item.mainImg).url:null
            }
          })
          this.setData({
            projectList: list
          });
          this.updateComponents();
        }
      });
    },

    updateComponents() {
      if (!dd.canIUse('createMapContext.return.updateComponents') && dd.canIUse('map.makers.customCallout')) {
        ddUtils.showToast({
          title: mapV2Message
        });
        return;
      }
      const newMarkers = this.data.projectList
      .filter(i => i.cityCapitalX && i.cityCapitalY)
      .map(item => {
          return {
            id:item.id,
            width: 64,
            height: 64,
            longitude: Number(parseFloat(item.xy.lng).toFixed(6)),
            latitude: Number(parseFloat(item.xy.lat).toFixed(6)),
            iconPath: `/assets/images/map/${item.projectType}-${item.projectStatus}.png`,
            callout: {
              content: item.projectName
            },
            customCallout: { 
              "type": 2,
              "descList": [{ 
                  "desc": item.projectName,
                  "descColor": "#333333" 
              }],
              isShow: this.data.currentItem === item.index? 1:0
          },
          markerLevel: 2
          };
        });
      const newIncludePoints = newMarkers.map(item => {
        return {
          latitude: item.latitude,
          longitude: item.longitude
        };
      });
      this.mapCtx.updateComponents({
        scale:this.data.scale,
        longitude: 121.131229,
        latitude: 28.845441,
        setting: this.data.settings,
        markers: newMarkers,
        includePoints: newIncludePoints
      });
    },
    handleSwiper(e){
      this.setData({
        currentItem:e.detail.current
      })
      this.updateComponents();

      // const newMarkers = this.data.projectList
      // .filter(i => i.cityCapitalX && i.cityCapitalY)
      // .map(item => {
      //   if(this.data.currentItem === item.index){
      //     return {
      //       id:item.id,
      //       width: 64,
      //       height: 64,
      //       longitude: Number(parseFloat(item.xy.lng).toFixed(6)),
      //       latitude: Number(parseFloat(item.xy.lat).toFixed(6)),
      //       iconPath: `/assets/images/map/${item.projectType}-${item.projectStatus}.png`,
      //       markerLevel: 2,
      //       label:{
      //         content:item.projectName,
      //         color:"#000000",
      //         fontSize:16,
      //         borderRadius:8,
      //         bgColor:"#ffffff",
      //         padding:10,
      //       },
      //     };
      //   }else{
      //     return {
      //       id:item.id,
      //       width: 64,
      //       height: 64,
      //       longitude: Number(parseFloat(item.xy.lng).toFixed(6)),
      //       latitude: Number(parseFloat(item.xy.lat).toFixed(6)),
      //       iconPath: `/assets/images/map/${item.projectType}-${item.projectStatus}.png`,
      //       callout: {
      //         content: item.projectName
      //       },
      //     };
      //   } 
      //   });
      //     this.mapCtx.changeMarkers({
      //       update:newMarkers,
      //     });
    },
    // 点击 Marker 时触发
    markertap(e) {
      let index = this.data.projectList.findIndex(item=>item.id===e.markerId)
      this.setData({
        currentItem:index
      })
    },
   // 手势的放大与缩小
    demoGesture() {
      if (dd.canIUse("createMapContext")) { 
        myGestureEnabled = (myGestureEnabled + 1) % 2;
        this.mapCtx.gestureEnable({ isGestureEnable: myGestureEnabled });
      }
    },
  }
});
