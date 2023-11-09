
import apiDataBoardServer from "../../../../server/dataBoardServer"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
Component({
  mixins: [],
  data: {
    scale: 10,
    longitude:"121.131229",
    latitude:"28.845441",
    includePoints:"",
    mapV2Enable: dd.canIUse('map.optimize'),
    markers:[],
    projectList:[],
    statusList: [
      {
        title: "全部",
        value: null,
      },
      {
        title: "在建",
        value: 1,
      },
      {
        title: "延期",
        value: 2,
      },
      {
        title: "投入未使用",
        value: 3,
      },
      {
        title: "投入使用",
        value: 4,
      },
    ],
// 滑块
    // indicatorDots: true,
    // autoplay: false,
    // vertical: false,
    // circular: false,
  },
  tabIndex:0,
  props: {},
  didMount() {
     this.mapCtx = dd.createMapContext('map');
     this.getProjectList()
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    onTabChange(e){
      this.setData({
        tabIndex: e
      })
    },
    onSelectItem(e){
      ddUtils.navigateTo({
      url: `/pages/databoard/page/projectInfo/index?json=${JSON.stringify(e.currentTarget.dataset.item)}`
    });
    },
    getProjectList(){
      const params={
        "projectId": "",
        "projectName": "",
        "projectStatus": ""
      }
      request.doPostRequest({
        url: apiDataBoardServer.API_MAP_PROJECT_LIST,
        data:params,
        success: res => {
            this.setData({
              projectList: res.data
            })
        },
      });
      const markers = this.data.projectList.map(item=>{
        return{
          id:item.id,
          latitude:item.cityCapitalX,
          longitude:item.cityCapitalY,
          iconPath:require("../../../../assets/images/map/icon-其他@3x.png"),
        }
      })
      this.setData({
        markers,
      })

    },
    // 重置地图
    demoResetMap() {
      this.setData({
        scale: 11,
        longitude:"121.131229",
        latitude:"28.845441",
        includePoints:"",
        'groundOverlays':[],
      });
      if (dd.canIUse('createMapContext.return.clearRoute')) {
        this.mapCtx.clearRoute();
      }
    },
    // 获取中心点坐标
    demoGetCenterLocation() {
      if (dd.canIUse('createMapContext')) {
        this.mapCtx.getCenterLocation({
          success: (res) => {
            dd.alert({
              content: 'longitude:' + res.longitude + '\nlatitude:' + res.latitude + '\nscale:' + res.scale,
            });
            console.log(res.longitude,res.latitude,res.scale);
          },
        });
      }
    },
    // 回到定位点
    demoMoveToLocation() {
      if (dd.canIUse('createMapContext')) {
        this.mapCtx.moveToLocation();
      }
    },
    // marker动画
    demoMarkerAnimation() {
      if (!dd.canIUse('createMapContext.return.updateComponents')) {
        dd.alert({ 
          title: '不支持',
          content: mapV2Message
        });
        return;
      } 
      this.mapCtx.updateComponents({
        'markers':animMarker,
      });
      this.mapCtx.updateComponents({
        command:{
          markerAnim:[{markerId:1,type:0},],
        }
      });
    },
    // marker-label
    demoMarkerLabel() {
      if (!dd.canIUse('createMapContext.return.updateComponents')) {
        dd.alert({ 
          title: '不支持',
          content: mapV2Message 
        });
        return;
      } 
      this.mapCtx.updateComponents({
        scale: 14,
        longitude,
        latitude,
        includePoints,
        'markers':labelMarker,
      });
    },
    demoMarkerCustomCallout() {
      if (!dd.canIUse('createMapContext.return.updateComponents')) {
        dd.alert({ 
          title: '不支持',
          content: mapV2Message 
        });
        return;
      } 
      this.mapCtx.updateComponents({
        scale: 14,
        longitude,
        latitude,
        includePoints,
        'markers':customCalloutMarker,
      });
    },
    // 文字marker
    demoMarkerAppendStr() {
      if (!dd.canIUse('createMapContext.return.updateComponents')) {
        dd.alert({ 
          title: '不支持',
          content: mapV2Message 
        });
        return;
      }
      this.mapCtx.updateComponents({
        scale: 14,
        longitude,
        latitude,
        includePoints,
        'markers':iconAppendStrMarker,
      });
    },
  
    // 手势的放大与缩小
    demoGesture() {
      if (dd.canIUse('createMapContext')) {
        myGestureEnabled = (myGestureEnabled+1) %2;
        this.mapCtx.gestureEnable({isGestureEnable:myGestureEnabled});
      }
    },
    // 视野发生变化时触发
    regionchange(e) {
      console.log('regionchange', e);
    },
    // 点击 Marker 时触发
    markertap(e) {
      console.log('marker tap', e);
    },
    // 点击 control 时触发
    controltap(e) {
      console.log('control tap', e);
    },
    // 点击地图时触发
    tap() {
      console.log('tap');
    },
    // 点击 Marker 对应的 callout 时触发
    callouttap(e) {
      console.log('callout tap', e);
    },
  },
});
