import { isEmpty, isEmptyArray, isEqual } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
import config from "../../../../utils/config"
import request from "../../../../utils/request"
import projectService from "../../../../server/workServer/projectServer";

const app = getApp();

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
      marginTop: 0,
      dataList: [], //[{name: '', value: ''}]
      onScreenCallBack: function (item) { },
      projectId: null
    },

    /**
     * 组件的初始数据
     */
    data: {
        showDialog: false,
        chooseIndex: -1,
        topHeight: 0,
        scrollHeight: 0,
        title:"选择相关单位",
        inputValue: '',
        dataList: []
    },

    //组件创建时触发
    onInit() {
      
    },

    //组件创建时和更新前触发
    deriveDataFromProps(nextProps) {

    },

    //组件创建完毕时触发
    //此时页面已经渲染，通常在这时请求服务端数据。
    didMount() {
      if(this.props.projectId){
        this.getEcological()
      }
      
      app.getSystemInfo(res => {
          this.setData({
              topHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight,
              scrollHeight: app.globalData.appSystemInfo.screenHeight * 0.6
          });
      });
    },

    //组件更新完毕时触发
    //每次组件数据变更的时候都会调用。
    didUpdate(prevProps, prevData) {

    },

    //组件删除时触发
    //每当组件实例从页面卸载的时候都会触发此回调。
    didUnmount() {

    },

    //组件 js 代码抛出错误时触发
    onError(e) {

    },

    /**
     * 组件的方法列表
     */
    methods: {
      getEcological(name){
        request.doPostRequest({
          url: projectService.API_CURRENTUNIT,
          data: {
            pageSize: 9999,
            pageNum: 1,
            unitTypeId: '1710172427167727616',
            proId: this.props.projectId,
            unitName: name
          },
          success: res => {
            this.setData({
              dataList: res.data.records || []
            })
          }
        })
      },
        _bindOnConfirm: function (e) {
          console.log(e,'调接口')
          this.getEcological(e.detail.value)
        },

        //bind input change
        _bindInputChange: function (e) {
          console.log(e)
          this.setData({
            inputValue: e.detail.value
          })
          this.getEcological(e.detail.value)
        },
        _bindCancelTap: function (e) {
            this._hideDialog();
        },

        // 在 mask 上 touchmove
        _bindTouchMove: function (e) {
            this._hideDialog()
            return false
        },
        // 在 content 上 touchmove
        _bindContentTouchMove: function (e) {
            return false
        },
        // scroll-view scroll
        _bindScroll: function (e) {
            return false
        },

        //bind close tap
        _bindCloseTap: function (e) {
            this._hideDialog();
        },

        //bind item tap
        _bindItemTap: function (e) {
            this.setData({
                chooseIndex: e.currentTarget.dataset.index
            });

            this._hideDialog();
            this.props.onScreenCallBack(this.data.dataList[this.data.chooseIndex])
        },

        //judge is show dialog
        _isShowDialog() {
            return this.data.showDialog;
        },

        //show modal dialog
        _showDialog: function (defaultValue) {
            if (this._isShowDialog())
                return
            this.getEcological()
            // for (let i = 0; i < this.data.dataList.length; i++) {
            //     if (isEqual(defaultValue, this.data.dataList[i].value)) {
            //         this.data.chooseIndex = i;
            //         break;
            //     }
            // }

            this.setData({
                // chooseIndex: this.data.chooseIndex,
                chooseIndex: -1,
                showDialog: true
            });
        },

        //hide modal dialog
        _hideDialog: function (e) {
            if (!this._isShowDialog())
                return;

            this.setData({
              showDialog: false
            })
        },
    }
})