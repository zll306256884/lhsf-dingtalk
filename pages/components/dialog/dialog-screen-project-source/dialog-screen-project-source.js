import { isEmptyArray, isEqual} from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
import config from "../../../../utils/config";
import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request";

const app = getApp();

Component({
  mixins: [],
  data: {
    showDialog: false,
    scrollHeight: 0,
    dataList: []
  },
  props: {
    title: "选择项目来源",
    positionBottom: false,
    marginTop: 0,
    multiChoose: false,
    onScreenCallBack: function(chooseList) {}
  },
  chooseList: [],
  onInit() {},
  deriveDataFromProps(nextProps) {},
  didMount() {
    app.getSystemInfo(res => {
      this.setData({
        topHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight,
        scrollHeight: app.globalData.appSystemInfo.screenHeight * 0.65
      });
    });
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    getDate(username) {
      request.doPostRequest({
        url: projectService.API_PROJECT_SOURCE,
        success: res => {
          let list = res.data || [];          
          if (!isEmptyArray(list)){
            if(!isEmptyArray(this.chooseList)){
              list.forEach(e => {
                if(this.chooseList.find(s => s.id === e.id)){
                  e.isCheck = true
                }
              })
              this.setData({
                dataList: list
              })
            }else{
              this.setData({
                dataList: list
              })
            }
          }
        }
      });
    },
    _bindItemTap: function(e) {
      let list = this.data.dataList.concat([]);
      let index = e.currentTarget.dataset.index;
      let item = list[index];
      item.isCheck = !item.isCheck;
      this.setData({
        dataList: list
      });
    },
    _bindCancelTap: function(e) {
      this._hideDialog();
      let list = this.data.dataList.filter(e => e.isCheck === true)
      this.props.onScreenCallBack(list);
    },
    _bindTouchMove: function(e) {},

    //bind sure tap
    _bindSureTap: function(e) {
      console.log(this.data.dataList)
      let list = this.data.dataList.filter(e => e.isCheck === true)
      console.log(list)
      this.props.onScreenCallBack(list);
      this._hideDialog();
    },
    //搜索
    seachHandle(value){
      this.getDate(value)
    },
    onSearchConfirm: function(value) {
      this.seachHandle(value)
    },

    //judge is show dialog
    _isShowDialog() {
      return this.data.showDialog;
    },

    //show modal dialog
    _showDialog: function(defaultList) {
      if (this._isShowDialog()) return;
      this.setData({
        showDialog: true,
      });
      if(defaultList){
        defaultList.forEach(e => {
          e.isCheck = true
        })
        this.chooseList = defaultList;
      }
      this.getDate()
    },

    //hide modal dialog
    _hideDialog: function(e) {
      if (!this._isShowDialog()) return;
      this.setData({
        showDialog: false
      });
    }
  },
});
