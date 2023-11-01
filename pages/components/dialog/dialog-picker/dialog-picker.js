import { isEqual, isEmpty, isArrayIndexOutOfBounds } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
const app = getApp();

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
        title: "选择",
        dataList: [], //[{name: '', value: ''}]
        onPickerChange: function (item, index) { }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showDialog: false,
        selectValue: 0
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
            if (isArrayIndexOutOfBounds(this.props.dataList, this.data.selectValue)) return;

            this.props.onPickerChange(this.props.dataList[this.data.selectValue]);

            this._hideDialog();
        },

        //bind picker change
        _bindPickerChange: function (e) {
            this.setData({
                selectValue: e.detail.value[0]
            });
        },

        //judge is show dialog
        _isShowDialog() {
            return this.data.showDialog;
        },

        // 执行动画
        _startAnimation: function (isShow) {
            let duration = 200;

            if (!this.animation)
                this.animation = dd.createAnimation({
                    duration,
                    transformOrigin: "50% 50%",
                    timeFunction: 'linear',
                    delay: 100,
                });

            if (isShow) {
                this.animation.translateY(0).step();

                this.setData({
                    showDialog: isShow,
                    animation: this.animation.export(),
                })
            } else {
                this.animation.translateY(580 / app.globalData.pixelRatio).step();

                this.setData({
                    animation: this.animation.export(),
                });

                this.timeout = setTimeout(res => {
                    this.setData({
                        showDialog: isShow,
                    })
                }, duration);
            }
        },

        //show modal dialog
        _showDialog: function (defaultValue) {
            if (!isEmpty(defaultValue)) {
                for (let i = 0; i < this.props.dataList.length; i++) {
                    if (isEqual(defaultValue, this.props.dataList[i].value)) {
                        this.data.selectValue = i;
                        break;
                    }
                }
            }

            this.setData({
                selectValue: this.data.selectValue,
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