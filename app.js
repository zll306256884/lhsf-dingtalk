App({
    onLaunch(options) {
        // //获取用户token
        this.globalData.userInfo = dd.getStorageSync({
            key: this.globalData.keyUserInfo
        }).data || {};

        this.getSystemInfo()
        
    },
    onShow(options) {
    },

    //小程序技术支持：https://cschannel.alipay.com/newPortal.htm?scene=mt_zczx

    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    getSystemInfo: function (callback) {
        if (this.globalData.appSystemInfo) {
            if (typeof callback === 'function')
                callback(this.globalData.appSystemInfo)

            return;
        }
        dd.getSystemInfo({
            success: res => {
                this.globalData.appSystemInfo = res;
                this.globalData.statusBarHeight = this.globalData.appSystemInfo.statusBarHeight;
                this.globalData.pixelRatio = this.globalData.appSystemInfo.pixelRatio === 0 ? 1 : this.globalData.appSystemInfo.pixelRatio;
                if (typeof callback === 'function') callback(this.globalData.appSystemInfo)
                let modelmes = this.globalData.appSystemInfo.model;
                if (modelmes.search('iPhone X') != -1) {
                    this.globalData.appSystemInfo.isIphoneX = true
                }
            }
        });
    },

    globalData: {
        keyUserInfo: "keyUserInfo",
        keySubscribeMessage: "keySubscribeMessage",
        userInfo: {
            userToken: "", // string
            userAccount: "admin",
            userId: "1",
            avatar: "",
            nickName: "",
            sex: "",
            mobile: "",
            projectId: "1",
            projectName: "浙大二院萧山院区一期项目全过程工程咨询",
            projectRole:false
        },
        showLoading: false,
        isShowSubscribeMessage: "0",//是否显示过订阅消息1-是， 0-否
        platformUnit: "浙江五洲工程项目管理有限公司",
        ROLE_USER: "1",
        ROLE_HN: "2",
        SEX_BOY: "1",
        SEX_GIRL: "2",
        pixelRatio: 1,
        appSystemInfo: null,
        statusBarHeight: 0, // 状态栏高度(默认)
        navbarHeight: 44,
        isDebug: false,
        tokenInvalid: false,
        pageSize: 10,
    }
});
