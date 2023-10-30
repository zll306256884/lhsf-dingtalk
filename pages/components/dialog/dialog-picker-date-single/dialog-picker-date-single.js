import ddUtils from "../../../../utils/ddUtils";
import { formatTimeToDay } from "../../../../utils/utils";
const app = getApp();

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
        marginTop: 0,
        onPickerCallBack: function (date) { },
        onShowRecord: function () { }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showDialog: false,
        chooseIndex: -1,
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

        _bindTouchMove: function (e) { 
          return
        },

        //bind close tap
        _bindCloseTap: function (e) {
            this._hideDialog();
        },

        //bind reset tap
        _bindPickerDateRangeSelect: function (arr) {
            this.props.onPickerCallBack({
                startDate: formatTimeToDay(arr[0]) + ' 00:00:00',
                // endDate: formatTimeToDay(arr[1]) + ' 23:59:59'
            });
            this._hideDialog();
        },

        //bind picker date change
        _bindPickerDateChange: function(e) {
            //console.log(e)
        },

        //bind sure tap
        _bindSureTap: function (e) {

        },

        //judge is show dialog
        _isShowDialog() {
            return this.data.showDialog;
        },

        //show modal dialog
        _showDialog: function () {
            if (this._isShowDialog())
                return

            this.setData({
                showDialog: true
            })
        },

        //hide modal dialog
        _hideDialog: function (e) {
            if (!this._isShowDialog())
                return;

            this.setData({
                showDialog: false
            })
        },
        preventTouchMove(){
          console.log(123)
          return
        }
    }
})