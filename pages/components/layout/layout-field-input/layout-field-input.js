import { isInt, isEqual, getParseFloat } from '../../../../utils/utils'
Component({
    mixins: [],
    data: {
    },
    props: {
        dataIndex:0,
        borderTop: false,
        borderBottom: false,
        mustFill: false,
        mustFillTransparent: false,
        valueLeft: false,
        inputName: "",
        inputType: "",
        password:false,//默认为false
        showTitle:"",//提示语
        name: "",
        value: "",
        placeholder: "",
        valueColor: "#525966",
        cssStyle: "",
        itemIndex: -1,
        minNum: "",//当inputType=number时，输入框能输入的最小值
        disabled: false,
        maxlength: null,
        onInputChange: function (data) { },
        onBlurChange: function (data) { }
    },
    didMount() {

    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        //bind inout change
        _bindInputChange: function (e) {
            let value = e.detail.value;

            // if (isEqual(this.props.inputType, 'number')) {
            //     if (isInt(this.props.minNum) && getParseFloat(value) < getParseFloat(this.props.minNum)) {
            //         value = this.props.minNum;
            //     }
            // }

            this.props.onInputChange({
                value,
                oldValue: e.detail.value,//此处添加该字段用于判断：当type=number， minNum又存在时，点击输入框自带的上下箭头导致的页面展示的数字和实际的value不匹配
                itemIndex: this.props.itemIndex,
            })
        },

        //bind  blur change
        _bindBlurChange: function (e) {
            this.props.onBlurChange({
              e,
              index:this.props.dataIndex
            })
        },
    },
});
