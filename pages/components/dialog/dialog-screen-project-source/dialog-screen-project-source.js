import { isEmptyArray, isEqual} from "/utils/utils";
import ddUtils from "/utils/ddUtils";
import config from "/utils/config";
import projectService from "/server/workServer/projectServer";
import request from "/utils/request";

const app = getApp();

Component({
  mixins: [],
  data: {
    showDialog: false,
    scrollHeight: 0,
    dataList: [],
    selectedList:[]
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
    toggleNode(e) {
      console.log('e',e);
      const id = e.currentTarget.dataset.id;
    },
    checkboxChange(e) {
      console.log('e--------------------------',e);
      const item =e.currentTarget.dataset.item;
      if(e.detail.value.length){
        this.data.selectedList.push(item)
      }else{
        this.data.selectedList=this.data.selectedList.filter(i=>i.id!==item.id)
      }
      this.setData({
        selectedList:this.data.selectedList
      })
    },
    getDate() {
      const handleData=(list)=>{
        list.forEach(e => {
          if(this.chooseList.find(s => s.id == e.id)){
            e.checked = true
          }
          if(e.projectSourceConfigTreeRepList && e.projectSourceConfigTreeRepList.length){
            e.projectSourceConfigTreeRepList=handleData(e.projectSourceConfigTreeRepList)
          }
        })
        return list
      }
      request.doPostRequest({
        url: projectService.API_PROJECT_SOURCE,
        success: res => {
          let list = res.data || [];          
          if (!isEmptyArray(list)){
            if(!isEmptyArray(this.chooseList)){
              this.setData({
                dataList: handleData(list)
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
    _bindCancelTap: function(e) {
      this._hideDialog();
      // let list = this.data.dataList.filter(e => e.checked === true)
      // this.props.onScreenCallBack(list);
    },
    //bind sure tap
    _bindSureTap: function(e) {
      console.log('this.data.selectedList--------------',this.data.selectedList);
      this.props.onScreenCallBack(this.data.selectedList);
      this._hideDialog();
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
          e.checked = true
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
