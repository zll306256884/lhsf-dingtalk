
import apiDataBoardServer from "../../../../server/dataBoardServer"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
const markers = [{
  id: 0,
  longitude:121.131229,
  latitude:28.845441,
  width:64,
  height:64,
  iconPath:"/assets/images/map/1-4.png",
  callout: {
    content: 'callout',
  },
  // require("../../../../assets/images/map/1-4.png"),
}];
const labelMarker = [{
  id: 2,
  longitude:121.131229,
  latitude:28.845441,
  width:64,
  height:64,
  iconPath: '/assets/images/map/1-4.png',
  label:{
    content:"Hello Label",
    color:"#00FF00",
    fontSize:14,
    borderRadius:3,
    bgColor:"#ffffff",
    padding:10,
  },
  markerLevel: 2
}];
const longitude = 121.131229;
const latitude = 28.845441;
const includePoints = [{
  latitude: 28.845441,
  longitude: 121.131229,
}];
Component({
  mixins: [],
  props: {},
  data: {
    scale: 12,
    longitude,
    latitude,
    includePoints,
    markers,
    mapV2Enable: dd.canIUse('map.optimize'),
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
    tabIndex:0,
    params:{
      "projectId": "",
      "projectName": "",
      "projectStatus": ""
    }
  },
  mapCtx:{},
  dialogScreenProject:null,
  didMount() {
    this.initMap()
  // this.mapCtx = dd.createMapContext('map');
  // this.getProjectList()

  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    initMap(){
      this.mapCtx = dd.createMapContext('map');
      this.getProjectList()
    },
    onSaveDialogScreenprojecteRef(ref){
      this.dialogScreenProject = ref
    },
    onSearchProject(){
    console.log(this.dialogScreenProject);
    if (this.dialogScreenProject) this.dialogScreenProject._showDialog()
    },
    onTabChange(e){
      this.setData({
        tabIndex: e
      })
      this.data.params.projectName=""
      if(e===0){
        this.data.params.projectStatus=null
      }else{
      this.data.params.projectStatus=e
      }
      this.setData({
        params:this.data.params
      })
      this.getProjectList()
    },
    onSelectItem(e){
      ddUtils.navigateTo({
      url: `/pages/databoard/page/projectInfo/index?json=${JSON.stringify(e.currentTarget.dataset.item)}`
    });
    },
    bindChooseProjectCallBack(data){
      this.data.params.projectName=data.name
      this.getProjectList()
    },
    getProjectList(){
      request.doPostRequest({
        url: apiDataBoardServer.API_MAP_PROJECT_LIST,
        data:this.data.params,
        success: res => {
            this.setData({
              projectList: res.data
            })
            const newMarkers = this.data.projectList.filter(i=>
             i.cityCapitalX && i.cityCapitalY
            ).map((item,index)=>{
              return {
                id:index,
                width:64,
                height:64,
                latitude:Number(parseFloat(item.cityCapitalX).toFixed(6)),
                longitude:Number(parseFloat(item.cityCapitalY).toFixed(6)),
                // latitude: 121.404079, longitude: 28.842463,
                iconPath:"/assets/images/map/1-4.png",
                callout: {
                  content: 'callout',
                },

              }
            })
            console.log(newMarkers);
            // this.mapCtx.updateComponents({
            //   scale: 12,
            //   longitude,
            //   latitude,
            //   includePoints,
            //   'markers':newMarkers,
            // });
        },
        
      });
     
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
        'markers':markers,
      });
    },
    // demoMarkerCustomCallout() {
    //   if (!dd.canIUse('createMapContext.return.updateComponents')) {
    //     dd.alert({ 
    //       title: '不支持',
    //       content: mapV2Message 
    //     });
    //     return;
    //   } 
    //   this.mapCtx.updateComponents({
    //     scale: 14,
    //     longitude,
    //     latitude,
    //     includePoints,
    //     'markers':customCalloutMarker,
    //   });
    // },
    // 文字marker
    // demoMarkerAppendStr() {
    //   if (!dd.canIUse('createMapContext.return.updateComponents')) {
    //     dd.alert({ 
    //       title: '不支持',
    //       content: mapV2Message 
    //     });
    //     return;
    //   }
    //   this.mapCtx.updateComponents({
    //     scale: 14,
    //     longitude,
    //     latitude,
    //     includePoints,
    //     'markers':iconAppendStrMarker,
    //   });
    // },
  
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
      this.getProjectList()
      console.log('tap');
    },
    // 点击 Marker 对应的 callout 时触发
    callouttap(e) {
      console.log('callout tap', e);
    },
  },
});
