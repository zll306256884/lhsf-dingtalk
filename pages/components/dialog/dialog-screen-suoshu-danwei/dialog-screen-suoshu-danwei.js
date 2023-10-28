import { isEmpty, isEmptyArray, isEqual, isArrayIndexOutOfBounds } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
import config from "../../../../utils/config"
// import apiSuperviseCommend from "../../../../utils/apiSuperviseCommend"
import request from "../../../../utils/request"
const app = getApp();
//apiUrl:
//默认：config.API_SHI_GONG_DAN_WEI_LIST
//监理工作联系单：apiSuperviseCommend.API_SHI_GONG_DAN_WEI_LIST

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
        apiUrl: config.API_SHO_SHU_DAN_WEI_LIST,
        title: "所属单位",
        positionBottom: false,
        marginTop: 0,
        onScreenCallBack: function (item) { },
        onShowRecord: function () { },
    },

    /**
     * 组件的初始数据
     */
    data: {
        showDialog: false,
        chooseIndex: -1,
        dataList: [],
        topHeight: 0,
        scrollHeight: 0
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
        _bindCancelTap: function (e) {
            this._hideDialog();
            this.props.onShowRecord()
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

        //------picker--------
        //bind sure tap
        _bindSureTap: function (e) {
            let index = this.data.chooseIndex;

            if (isArrayIndexOutOfBounds(this.data.dataList, index)) index = 0;

            this._hideDialog();
            this.props.onScreenCallBack(this.data.dataList[index])
        },

        //bind picker change
        _bindPickerChange: function (e) {
            this.setData({
                chooseIndex: e.detail.value[0]
            });
        },

        //judge is show dialog
        _isShowDialog() {
            return this.data.showDialog;
        },

        //show modal dialog
        _showDialog: function (defaultValue) {
            if (this._isShowDialog())
                return

            if (!isEmptyArray(this.data.dataList)) {
                this.setData({
                    chooseIndex: this._getDefaultChooseIndex(this.data.dataList, defaultValue),
                    showDialog: true
                })
                return;
            }

            this._getShiGongUnitList({
                success: res => {
                    this.data.dataList = res.data || [];

                    this.setData({
                        chooseIndex: this._getDefaultChooseIndex(this.data.dataList, defaultValue),
                        showDialog: true,
                        dataList: this.data.dataList
                    })
                }
            });
        },

        _getShiGongUnitList: function (callback) {
            let option = Object.assign({
                showLoading: true,
            }, callback);

            if (option.showLoading) ddUtils.showLoading();

            request.doPostRequest({
                url: this.props.apiUrl,
                showLoading: option.showLoading,
                data: {
                    proId: app.globalData.userInfo.projectId,
                    projectId: app.globalData.userInfo.projectId
                },
                success: res => {
                    if (typeof option.success === "function") option.success(res);
                },
                fail: res => {
                    if (option.showLoading) ddUtils.hideLoading();

                    if (typeof option.fail === "function") option.fail(res);
                }
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

        //设置默认
        _getDefaultChooseIndex: function (list, value) {
            if (isEmpty(value) || isEmptyArray(list)) return -1;

            for (let i = 0; i < list.length; i++) {
                if (isEqual(value, list[i].id)) {
                    return i;
                }
            }
        }
    }
})