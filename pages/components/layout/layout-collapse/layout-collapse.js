Component({
    mixins: [],

    data: {
    },

    props: {
        borderTop: false,
        borderBottom: false,
        cssStyle: "",
        title: "标题",
        index: -1, //list item index
        isExpanded: false,
        showShadow: false,
        onCollapseChange: function (data) { }
    },

    //组件创建时和更新前触发
    deriveDataFromProps(nextProps) {

    },

    didMount() {

    },

    //组件更新完毕时触发
    //每次组件数据变更的时候都会调用。
    didUpdate(prevProps, prevData) {

    },

    didUnmount() { },

    methods: {
        //bind collapse tap
        _bindCollapseTap: function (e) {
            this.props.onCollapseChange({
                isExpanded: !this.props.isExpanded,
                index: this.props.index
            })
        },
    },
});
