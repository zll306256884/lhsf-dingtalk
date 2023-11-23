import {
  isEmpty,
  isEmptyArray,
  isEqual,
  isArrayIndexOutOfBounds
} from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
import config from "../../../../utils/config";
import request from "../../../../utils/request";
const app = getApp();
//筛选OA组织下人员列表
Component({
  mixins: [], // mixins 方便复用代码
  props: {
    // showDialog:false,
    title: "选择人员",
    positionBottom: false,
    marginTop: 0,
    multiChoose: false,
    screenDangerousName: "",
    onScreenCallBack: function(chooseList) {}
  },
  chooseList: [], //[{account: '',headImg: '',userId: '',username: ''}]
  data: {
    selectedStaff: [],
    showDialog: false,
    scrollHeight: 0,
    dataList: []
  },
  //组件创建时触发
  onInit() {},
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) {},
  didMount() {
    app.getSystemInfo(res => {
      this.setData({
        topHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight,
        scrollHeight: app.globalData.appSystemInfo.screenHeight * 0.65
      });
    });
    this.getDate();
    this.chooseList = [];
  },
  didUpdate(prevProps, prevData) {},
  didUnmount() {},
  onError(e) {},
  methods: {
    getDate() {
      request.doPostRequest({
        url: config.API_OA_COMPANY_STAFF_LIST,
        data: {},
        success: res => {
          let list = res.data || [];
          list[0].isCheck = true;
          if (!isEmptyArray(list))
            this.setData({
              dataList: this.ergodic(list, this.data.selectedStaff)
            });
        }
      });
    },
    _bindCancelTap: function(e) {
      this._hideDialog();
      this.props.onScreenCallBack();
    },

    _bindTouchMove: function(e) {},

    //bind sure tap
    _bindSureTap: function(e) {
      if (isEmptyArray(this.chooseList)) return;
      let newList =arr=>{
        let list = [];
        return arr.filter(item => !list.includes(item.userId) && list.push(item.userId))
      }
      this.props.onScreenCallBack(newList(this.chooseList));
      this._hideDialog();
    },

    //bind item tap
    _bindItemTap: function(e) {
      let list = this.data.dataList.concat([]);

      let index = e.currentTarget.dataset.index;
      let item = list[index];

      item.isCheck = !item.isCheck;

      this.setData({
        dataList: list
      });
    },

    bindInputChange: function(value) {
      this.screenDangerousName = value;
    },

    onSearchConfirm: function(value) {
      this.data.screenDangerousName = value;
      const openOrganizeList = list=>{
        if (!isEmptyArray(list)){
          list[0].isCheck = true;  
          list.map(item=>{if(!isEmptyArray(item.organizeList)){
            openOrganizeList(item.organizeList)
          }
          })
        } 
        return list
      };
      request.doPostRequest({
        url: config.API_OA_COMPANY_NAME,
        data: {
          username: value
        },
        success: res => {
          let list =openOrganizeList(res.data) || [];
          if (this.data.selectedStaff && this.data.selectedStaff.length !== 0) {
            this.setData({
              dataList: this.ergodic(list, this.data.selectedStaff)
            });
          }else{
            this.setData({
              dataList: list
            });
          }
        }
      });
    },
    _bindItemChooseCompanyChange: function(indexArray) {
      if (isEmptyArray(indexArray)) return;
      indexArray.reverse();
      let list = JSON.parse(JSON.stringify(this.data.dataList));
      let i = 0;
      this._getChooseCompanyItem(
        list[indexArray[i]],
        indexArray,
        i,
        indexArray.length - 1
      );
      this.setData({
        dataList: list
      });
    },

    _bindItemChooseUserChange: function(indexArray) {
      if (isEmptyArray(indexArray)) return;
      indexArray.reverse();
      let list = JSON.parse(JSON.stringify(this.data.dataList));
      list[0].isCheck = true;
      let i = 0;
      let item = this._getChooseUserItem(
        list[indexArray[i]],
        indexArray,
        i,
        indexArray.length - 2
      );
      if (!this.props.multiChoose) {
        this.props.onScreenCallBack([item]);
        this._hideDialog();
        return;
      }
      this._addChooseUserList(item);
      this.setData({
        dataList: list
      });
    },

    _getChooseCompanyItem: function(item, indexArray, index, total) {
      if (index < total) {
        index++;
        return this._getChooseCompanyItem(
          item.organizeList[indexArray[index]],
          indexArray,
          index,
          total
        );
      }
      item.isCheck = !item.isCheck;
      return item;
    },

    _getChooseUserItem: function(item, indexArray, index, total) {
      if (index < total) {
        index++;
        return this._getChooseUserItem(
          item.organizeList[indexArray[index]],
          indexArray,
          index,
          total
        );
      }
      let itemUser = item.staffList[[indexArray[index + 1]]];
      itemUser.isCheck = !itemUser.isCheck;
      return itemUser;
    },

    _addChooseUserList: function(item) {
      if (!this.chooseList) this.chooseList = [];
      for (let i = 0; i < this.chooseList.length; i++) {
        if (isEqual(item.userId, this.chooseList[i].userId)) {
          this.chooseList.splice(i, 1);
          break;
        }
      }
      if (item.isCheck) this.chooseList.push(item);
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
        selectedStaff: defaultList
      });
      this.chooseList = [];
      this.getDate()
    },
    ergodic(list, selected) {
      const newList = list.map(item => {
        if (item.organizeList && item.organizeList.length !== 0) {
          this.ergodic(item.organizeList, selected);
        }
        if (item.staffList && item.staffList.length !== 0) {
          return item.staffList.map(s => {
            selected.map(sed => {
              if (sed.userId === s.userId) {
                s.isCheck = true;
                if (sed.disabled) {
                  s.disabled = sed.disabled;
                }
                this.chooseList.push(s);
              }
            });
            return s;
          });
        } else {
          return item;
        }
      });
      return newList;
    },

    //hide modal dialog
    _hideDialog: function(e) {
      if (!this._isShowDialog()) return;
      this.setData({
        showDialog: false
      });
    }
  }
});
