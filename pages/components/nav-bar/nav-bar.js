import ddUtils from "../../../utils/ddUtils";
const app = getApp();

Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
        navbarData: {
            title: "监理",
            titleColor: "#333333",
            navBackgroundColor: "white",
            showNavbarBack: false,
            navBackRes: "/images/icon_back_black.png",
            noBackgroundColor: false,
            titleLeft: false,
            noPlaceholder: false, //导航栏不占顶部位置
            isCatchtap: false, //catch tap by navgationbar back
            backWidth: 8,
            backHeight: 16
        },
        onNavBack: function () { }
    },

    /**
     * 组件的初始数据
     */
    data: {
        _isNavClick: false, //防止返回按钮快速点击
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
      my.setNavigationBar({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      })
        app.getSystemInfo(res => {
            this.setData({
                statusBarHeight: app.globalData.statusBarHeight,
                navbarHeight: app.globalData.navbarHeight
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
        _bindNavBack: function (e) {
            if (this.data._isNavClick) return;

            this.setData({
                _isNavClick: true
            });

            if (this.props.navbarData && this.props.navbarData.isCatchtap) {
                //触发返回回调
                this.onNavBack();
            } else {
                ddUtils.navigateBack({
                    delta: 1
                });
            }
        }
    }
})