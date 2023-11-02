Component({
    mixins: [],
    data: {
    },
    props: {
        hidden:true,
        borderTop: false,
        borderBottom: false,
        mustFill: false,
        mustFillTransparent: false,
        valueLeft: false,
        valueFlexMatck: true,
        name: "",
        value: "",
        placeholder: "",
        nameBold: false,
        nameColor: "#525966",
        valueColor: "#525966",
        valueEmptyColor: "#B8BFCC",
        cssStyle: "",
        datasetValue: "",
        disabled: false,
        onArrowTap: function (e) { }
    },
    didMount() {

    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        //bind arrow tap
        _bindArrowTap: function (e) {
            if (this.props.disabled) return;

            this.props.onArrowTap(e);
        },
    },
});
