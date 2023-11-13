import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"

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
const longitude = 121.131229;
const latitude = 28.845441;
const includePoints = [{
  latitude: 28.845441,
  longitude: 121.131229,
}];
Component({
  mixins: [],
  data: {
    visibel: false,
    visibelUnit:false,
    info:{},
    scale: 12,
    longitude,
    latitude,
    includePoints,
    markers,
    mapV2Enable: dd.canIUse('map.optimize'),
  },
  props: {
    projectInfo:{}
  },
  didMount() {
    this.mapCtx = dd.createMapContext('map');
    this.getDetail(this.props.projectInfo.projectId)
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
          console.log(res);
          this.setData({
            info:res.data
          })
        }
      })
    },
  },
});
