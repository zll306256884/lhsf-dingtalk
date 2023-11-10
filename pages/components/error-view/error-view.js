// pages/common/component/error-view/error-view.js
const defaultTopHeight = 300;
const defaultErrorWidth = 197;
const defaultErrorHeight = 78;
const defaultErrorMsg = "暂无数据";
const defaultErrorSrc = "/images/icon_empty.png";

Component({
    options: {
        pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段,
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    props: {
        topHeight: 300,
        styleLoadMore: "",
        loadMoreSrc: "/images/loadding.gif",
        loadMoreMessage: "正在加载...",
        onErrorRefreshTap: function(e) {},
        onErrorButtonTap: function (e) { }
    },
    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        // empty显示控制
        isShowError: false,
        // empty 图片
        errorSrc: "/images/icon_empty.png",
        // empty 消息内容
        errorMessage: "暂无数据",
        showButton: false,
        buttonText: "",
        //是否是空数据，否则是加载失败
        loadError: false,
        // load more 显示控制
        isShowLoadMore: false,
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
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
        //隐藏 view
        _hideAllView() {
            this._hideEmptyView();
            this._hideLoadMore();
        },

        //隐藏empty view
        _hideEmptyView() {
            if (this.data.isShowError) {
                this.setData({
                    isShowError: false
                })
            }
        },
        //展示empty view
        _showEmptyView(obj) {
            let option = Object.assign({
                errorSrc: defaultErrorSrc,
                errorMessage: defaultErrorMsg,
                loadError: false,
                errorWidth: defaultErrorWidth,
                errorHeight: defaultErrorHeight,
                topHeight: defaultTopHeight,
                showButton: false,
                buttonText: "",
            }, obj);

            this.setData({
                errorSrc: option.errorSrc,
                errorMessage: option.errorMessage,
                loadError: option.loadError,
                errorWidth: option.errorWidth,
                errorHeight: option.errorHeight,
                topHeight: option.topHeight,
                showButton: option.showButton,
                buttonText: option.buttonText
            });

            if (!this.data.isShowError) {
                this.setData({
                    isShowError: true,
                    isShowLoadMore: false
                })
            }
        },

        /**
         * 内部私有方法建议以下划线开头
         * triggerEvent 用于触发事件
         */
        _bindRefresh(e) {
            //触发刷新回调
            if (this.data.loadError) 
                this.props.onErrorRefreshTap(e);
        },

        //隐藏 load more view
        _hideLoadMore() {
            if (this.data.isShowLoadMore) {
                this.setData({
                    isShowLoadMore: false
                })
            }
        },

        //展示 load more view
        _showLoadMore() {
            if (!this.data.isShowLoadMore) {
                this.setData({
                    isShowError: false,
                    isShowLoadMore: true
                })
            }
        },

        //bind button tap
        _bindButtonTap: function (e) {
            this.props.onErrorButtonTap(e);
        },
    }
})