import {
    isEmpty,
    isArrayIndexOutOfBounds,
    getYears,
    getMonths,
    getDays,
    getHours,
    getMinutes,
    getSeconds,
} from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
const app = getApp();

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
        title: "选择日期",
        startDate: 1900,
        endDate: null,
        showHourMinuteSecond: false,
        onPickerCallBack: function (data) { }
    },

    paramValue: "",

    /**
     * 组件的初始数据
     */
    data: {
        showDialog: false,
        yearList: [], //年
        monthList: [], //月
        dayList: [], //日
        hourList: [],//时
        minuteList: [],//分
        secondList: [],//秒
        selectValue: [0, 0, 0, 0, 0, 0]
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

        let date = new Date();
        let endDate = this.props.endDate;

        if (isEmpty(endDate)) endDate = date.getFullYear() + 50;

        let yearList = getYears(this.props.startDate, endDate);
        let monthList = getMonths();
        let dayList = getDays(yearList[this.data.selectValue[0]], monthList[this.data.selectValue[1]]);
        let hourList = getHours();
        let minuteList = getMinutes();
        let secondList = getSeconds();

        let selectValue = [yearList.length - 51, 0, 0, 0, 0, 0];

        for (let i = 0; i < monthList.length; i++) {
            if (monthList[i] === date.getMonth() + 1) {
                selectValue[1] = i;
                break;
            }
        }

        for (let i = 0; i < dayList.length; i++) {
            if (dayList[i] === date.getDate()) {
                selectValue[2] = i;
                break;
            }
        }

        this.setData({
            selectValue,
            yearList,
            monthList,
            dayList,
            hourList,
            minuteList,
            secondList
        });
    },

    //组件更新完毕时触发
    //每次组件数据变更的时候都会调用。
    didUpdate(prevProps, prevData) {

    },

    //组件删除时触发
    //每当组件实例从页面卸载的时候都会触发此回调。
    didUnmount() {
        if (this.timeout)
            clearTimeout(this.timeout)
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

        _bindOnTouchMove: function (e) { },

        //bind close tap
        _bindCloseTap: function (e) {
            this._hideDialog();
        },

        //bind sure tap
        _bindSureTap: function (e) {
            if (isArrayIndexOutOfBounds(this.data.yearList, this.data.selectValue[0])) return;
            if (isArrayIndexOutOfBounds(this.data.monthList, this.data.selectValue[1])) return;
            if (isArrayIndexOutOfBounds(this.data.dayList, this.data.selectValue[2])) return;

            let year = this.data.yearList[this.data.selectValue[0]];
            let month = this.data.monthList[this.data.selectValue[1]];
            let day = this.data.dayList[this.data.selectValue[2]];
            let hour = this.props.showHourMinuteSecond ? this.data.hourList[this.data.selectValue[3]] : 23;
            let minute = this.props.showHourMinuteSecond ? this.data.minuteList[this.data.selectValue[4]] : 59;
            let second = this.props.showHourMinuteSecond ? this.data.secondList[this.data.selectValue[5]] : 59;

            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            if (hour < 10) hour = '0' + hour;
            if (minute < 10) minute = '0' + minute;
            if (second < 10) second = '0' + second;

            let dateStr = [year, month, day].join('-');

            this.props.onPickerCallBack({
                date: dateStr + ' ' + [hour, minute, second].join(':'),
                shortDate: dateStr,
                paramValue: this.paramValue
            });

            this._hideDialog();
        },

        //bind picker change
        _bindPickerChange: function (e) {
            if (this.data.selectValue[0] !== e.detail.value[0] || this.data.selectValue[1] !== e.detail.value[1]) { //如果滚动的不是第三个column
                this.data.dayList = getDays(this.data.yearList[e.detail.value[0]], this.data.monthList[e.detail.value[1]]);
                e.detail.value[2] = 0; //重置日期的下标
            }

            this.data.selectValue = e.detail.value;

            this.setData({
                selectValue: this.data.selectValue,
                dayList: this.data.dayList,
            })
        },

        //judge is show dialog
        _isShowDialog() {
            return this.data.showDialog;
        },

        //show modal dialog
        _showDialog: function (value) {
            this.paramValue = value;

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
                showDialog: false,
            })
        },
    }
})