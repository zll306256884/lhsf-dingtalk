Component({
    mixins: [],
    data: {
    },
    props: {
        cssStyle: "",
        placeholder: "搜索",
        onSearchConfirm: function (value) { },
        onSearchInputChange: function (value) { }
    },
    didMount() {

    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        //bind input confirm
        _bindOnConfirm: function (e) {
            this.props.onSearchConfirm(e.detail.value)
        },

        //bind input change
        _bindInputChange: function (e) {
            this.props.onSearchInputChange(e.detail.value);
        },
        _bindBlurChange(){

        }
    },
});
