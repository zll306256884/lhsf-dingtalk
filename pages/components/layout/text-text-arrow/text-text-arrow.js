Component({
    mixins: [],
    data: {
    },
    props: {
        borderTop: false,
        borderBottom: false,
        mustFill: false,
        mustFillTransparent: false,
        valueLeft: false,
        cssStyle: "",
        name: "",
        value: "",
        valueEmptyColor: "#B8BFCC",
        valueColor: "#525966",
        placeholder: "",
        iconWidth: 28,
        iconHeight: 28,
        arrowIcon: "/images/icon_arrow_gray.png",
        itemIndex: -1,
        onArrowTap: function (e) { }
    },
    didMount() {

    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        //bind arrow tap
        _bindArrowTap: function (e) {
            this.props.onArrowTap(e);
        },
    },
});
