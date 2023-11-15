import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"

// const markers = [];
// const longitude = 121.131229;
// const latitude = 28.845441;
// const includePoints = [{
//   latitude: 28.845441,
//   longitude: 121.131229,
// }];
Component({
  mixins: [],
  data: {
    visibelUnit:false,
    info:{},
    scale: 12,
    longitude:null,
    latitude:null,
    includePoints:[],
    markers:[],
    mapV2Enable: dd.canIUse('map.optimize'),
  },
  props: {
    projectInfo:{}
  },
  didMount() {
    this.initMap()
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    // onPageScroll(){
    //   if(!this.data.visibelUnit){
    //     this.setData({
    //       visibelUnit:true
    //     })
    //   }
    // },
    // onPullDownRefresh(){
    //   if(this.data.visibelUnit){
    //     this.setData({
    //       visibelUnit:false
    //     })
    //   }
    // },
    initMap(){
      this.mapCtx = dd.createMapContext('map');
      this.getDetail(this.props.projectInfo.projectId)
    },
    onShowUnit(){
      this.data.visibelUnit=!this.data.visibelUnit
        this.setData({
          visibelUnit:this.data.visibelUnit
        })
    },
    onTabChange(e){
      this.setData({
        currentTabIndex:e
      })
    },
    getDetail(id){
      request.doPostRequest({
        url: projectService.API_SELECTPROJECT_INFO_BYID,
        data:{id},
        success: res => {
          this.setData({
            info:res.data
          })
          this.updateComponents()
        }
      })
    },
    updateComponents() {
      let item = this.data.info
      this.mapCtx.updateComponents({
        scale: 12,
        longitude: Number(parseFloat(item.coorX).toFixed(6)),
        latitude: Number(parseFloat(item.coorY).toFixed(6)),
        setting: {
          gestureEnable: 1, // 开启手势功能
          showScale: 0, // 隐藏比例尺
          showCompass: 0, // 隐藏指南针
          tiltGesturesEnabled: 1 // 开启双指下滑手势
        },
        markers: [{
            id: item.id,
            width: 64,
            height: 64,
            longitude: Number(parseFloat(item.coorX).toFixed(6)),
            latitude: Number(parseFloat(item.coorY).toFixed(6)),
            iconPath: require(`../../../../assets/images/map/${item.projectClassification}-${item.projectStatus}.png`),
            callout: {
              content: item.name
            }
        }],
        includePoints: [{
          longitude: Number(parseFloat(item.coorX).toFixed(6)),
          latitude: Number(parseFloat(item.coorY).toFixed(6)),
        }]
      });
    },
  },
});
