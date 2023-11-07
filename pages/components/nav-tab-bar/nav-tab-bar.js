import utils from "../../../utils/utils";
import ddUtils from "../../../utils/ddUtils";
const app = getApp();

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
        tabIndex: 0,
        subTabIndex: 0,
        tabList: [], //[{name: "", value: ""}],
        subTabList: [],
        onNavTabChange: function (tabIndex) {},
        onNavSubTabChange: function (subTabIndex) { },
    },

    /**
     * 组件的初始数据
     */
    data: {
        navPlacherHeight: 0,
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
                navPlacherHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight
                // navPlacherHeight: 4
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
        //bind tab item tap
        _bindTabItemTap: function (e) {
            this._setTabIndex(e.currentTarget.dataset.index)
        },

        //set tab index
        _setTabIndex: function (index) {
            if (utils.isArrayIndexOutOfBounds(this.props.tabList, index)) return;

            if (!this.animation)
                this.animation = dd.createAnimation({
                    duration: 200
                });

            this.animation.translateX(app.globalData.appSystemInfo.windowWidth / this.props.tabList.length * index).step();

            this.setData({
                tabIndex: index,
                animation: this.animation.export()
            });

            this.props.onNavTabChange(index)
        },

        //bind sub tab item tap
        _bindSubTabItemTap: function(e) {
            let index = e.currentTarget.dataset.index;
            // let targetCode=this.data.

            this.setData({
                subTabIndex: index
            });

            this.props.onNavSubTabChange(index)
        },
    }
})