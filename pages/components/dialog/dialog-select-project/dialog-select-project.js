import config from "../../../../utils/config";
import request from "../../../../utils/request";
import { isEmpty, isEmptyArray, isEqual } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";

const app = getApp();

Component({
  mixins: [],
  props: {
    marginTop: 0,
    title: "选择项目",
    onScreenCallBack: function(item) {}
  },
  data: {
    showDialog: false,
    chooseIndex: null,
    dataList: [],
    topHeight: 0,
    scrollHeight: 0,
    keyWords: ""
  },
  didMount() {
    app.getSystemInfo(res => {
      this.setData({
        topHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight,
        scrollHeight: app.globalData.appSystemInfo.screenHeight * 0.6
      });
    });
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 点击蒙层
    _bindTouchMove: function(e) {
      this._hideDialog();
    },
    //bind close tap
    _bindCloseTap: function(e) {
      this._hideDialog();
    },
    //bind item tap
    _bindItemTap: function(e) {
      this.setData({
        chooseIndex: e.currentTarget.dataset.index
      });
    },
    //judge is show dialog
    _isShowDialog() {
      return this.data.showDialog;
    },
    // 搜索回车
    onSearchConfirm: function(value) {
      this.setData({
        keyWords: value
      });
      this.getProjectList();
    },
    // 确定按钮
    onSureTap() {
      if (this.data.chooseIndex === -1) {
        ddUtils.showToast({
          title: "请选择项目"
        });
      } else {
        this._hideDialog();
        this.props.onScreenCallBack(this.data.dataList[this.data.chooseIndex]);
      }
    },
    //show modal dialog
    _showDialog: function(defaultValue) {
      if (this._isShowDialog()) return;
      this.setData({
        showDialog: true,
        chooseIndex: this._getDefaultChooseIndex(
          this.data.dataList,
          defaultValue
        )
      });
      this.getProjectList();
    },
    // 获取数据
    getProjectList() {
      request.doPostRequest({
        url: config.API_PROJECT_NAME,
        data: {
          name: this.data.keyWords
        },
        success: res => {
          this.setData({
            dataList: res.data
          });
        }
      });
    },
    //hide modal dialog
    _hideDialog: function(e) {
      if (!this._isShowDialog()) return;
      this.setData({
        showDialog: false
      });
    },
    //bind picker change
    _bindPickerChange: function(e) {
      this.setData({
        chooseIndex: e.detail.value[0]
      });
    },
    //设置默认
    _getDefaultChooseIndex: function(list, value) {
      if (isEmpty(value) || isEmptyArray(list)) return -1;

      for (let i = 0; i < list.length; i++) {
        if (isEqual(value, list[i].projectId)) {
          return i;
        }
      }
    }
  }
});
