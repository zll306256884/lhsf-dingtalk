Component({
    data: {
    },
    props: {
        multiChoose: false,
        disabled: false,
        checkIndex: null,
        itemIndex: 0,
        checkList: [{
            name: "是",
            value: "1"
        }, {
            name: "否",
            value: "0"
        }], //[{name: '',value: ''}]
        onSwitchCheckChange: function (data) { },
    },
    didMount() {
    },

    //组件创建时和更新前触发
    deriveDataFromProps(nextProps) {
    },

    //组件更新完毕时触发
    //每次组件数据变更的时候都会调用。
    didUpdate(prevProps, prevData) {

    },

    didUnmount() { },

    methods: {
        //bind switch check tap
        _bindSwitchCheckTap: function (e) {
            if (this.props.disabled) return;

            let index = e.currentTarget.dataset.index;

            this.props.onSwitchCheckChange({
                checkData: this.props.checkList[index],
                checkIndex: index,
                itemIndex: this.props.itemIndex
            });
        },

    },
});
