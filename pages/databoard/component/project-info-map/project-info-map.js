import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"
Component({
  mixins: [],
  data: {
    visibelUnit:false,
    info:{},
    scale:12,
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
   
    initMap(){
      this.mapCtx = dd.createMapContext('map');
      this.getDetail(this.props.projectInfo.projectId)
    },
    toggleShowUnit(){
      let visibelUnit=!this.data.visibelUnit
        this.setData({
          visibelUnit:visibelUnit
        })
    },
    onShowUnit(){
      this.setData({
        visibelUnit:true
      })
    },
    onHideUnit(){
      this.setData({
        visibelUnit:false
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
        scale:12,
        longitude: Number(parseFloat(item.coorX).toFixed(6)),
        latitude: Number(parseFloat(item.coorY).toFixed(6)),
        setting: {
          gestureEnable: 1, // 开启手势功能
          showScale: 0, // 隐藏比例尺
          showCompass: 0, // 隐藏指南针
          tiltGesturesEnabled: 1 // 开启双指下滑手势
        },
        markers: [{
            id: 1,
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
