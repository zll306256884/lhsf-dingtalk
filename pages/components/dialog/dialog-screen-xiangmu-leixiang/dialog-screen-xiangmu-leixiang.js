import { isEmpty, isEmptyArray, isEqual, isArrayIndexOutOfBounds } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
import { API_PROJECT_TYPE } from "../../../../utils/config"
import request from "../../../../utils/request"
const app = getApp();

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
        marginTop: 0,
        positionBottom: false,
        showAllText: false,
        title: "项目",
        code: "investment_project_type",
        onScreenCallBack: function (item) { }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showDialog: false,
        chooseIndex: 0,
        dataList: [],
        topHeight: 0,
        scrollHeight: 0,
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
        },

        _bindTouchMove: function (e) { },

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
            let index = isArrayIndexOutOfBounds(this.data.dataList, this.data.chooseIndex) ? 0 : this.data.chooseIndex;

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

            request.doPostRequest({
                url: API_PROJECT_TYPE.API_PROJECT_TYPE +this.props.code ,
                data: {
                  dictCode: this.props.code,
                },
                success: res => {
                    this.data.dataList = [];

                    // if (this.props.showAllText) {
                    //     this.data.dataList.push({
                    //         projectName: "全部",
                    //         projectId: ""
                    //     })
                    // }

                    this.data.dataList = this.data.dataList.concat(res.data || []);

                    this.setData({
                        chooseIndex: this._getDefaultChooseIndex(this.data.dataList, defaultValue),
                        showDialog: true,
                        dataList: this.data.dataList
                    })
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
                if (isEqual(value, list[i].projectId)) {
                    return i;
                }
            }
        }
    }
})