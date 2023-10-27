Component({
    mixins: [],
    data: {
    },
    props: {
        borderTop: false,
        borderBottom: false,
        mustFill: false,
        mustFillTransparent: false,
        name: "",
        nameColor: "#525966",
        iconRes: "/images/icon_ques_mark_gray.png",
        showIcon: true,
        iconWidth: 32,
        iconHeight: 32,
        cssStyle: "",
        showSwitchCheck: false,
        itemIndex: -1,
        checkList: [],
        checkIndex: -1,
        onIconTap: function (e) { },
        onSwitchCheckChange: function (data) { },
    },
    didMount() {

    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        //bind icon tap
        _bindIconTap: function (e) {
            this.props.onIconTap(e)
        },

        _bindSwitchCheckChange: function (data) {
            this.props.onSwitchCheckChange(data)
        },
    },
});
