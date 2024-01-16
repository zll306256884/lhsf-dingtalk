import { isEmptyArray, isEqual} from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
import config from "../../../../utils/config";
import request from "../../../../utils/request";

const app = getApp();

Component({
  mixins: [],
  data: {
    selectedStaff: [],
    showDialog: false,
    scrollHeight: 0,
    dataList: []
  },
  props: {
    title: "选择分管领导",
    positionBottom: false,
    marginTop: 0,
    multiChoose: false,
    screenDangerousName: "",
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
        url: config.API_QUERY_USER_BY_ROLR,
        data: {username:username},
        success: res => {
          res.data.forEach(e => {
            e.userId = e.id
          })
          let list = res.data || [];
          // list[0].isCheck = true;
          
          if (!isEmptyArray(list)){
            if(!isEmptyArray(this.chooseList)){
              list.forEach(e => {
                if(this.chooseList.find(s => s.userId === e.userId)){
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
      // this.data.screenDangerousName = value;
      // const openOrganizeList = list=>{
      //   if (!isEmptyArray(list)){
      //     list[0].isCheck = true;  
      //     list.map(item=>{if(!isEmptyArray(item.organizeList)){
      //       openOrganizeList(item.organizeList)
      //     }
      //     })
      //   } 
      //   return list
      // };
      // request.doPostRequest({
      //   url: config.API_OA_COMPANY_NAME,
      //   data: {
      //     username: value
      //   },
      //   success: res => {
      //     let list =openOrganizeList(res.data) || [];
      //     this.setData({
      //     dataList:!isEmptyArray(this.data.selectedStaff)? this.ergodic(list, this.data.selectedStaff):list
      //     });
      //   }
      // });
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
          // e.disabled = true
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
