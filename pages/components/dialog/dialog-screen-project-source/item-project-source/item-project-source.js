import { isEmptyArray } from "/utils/utils";
const app = getApp();

Component({
    mixins: [],
    data: {
    },
    props: {
        itemIndex: -1,
        multiChoose: false,
        isShow: false,
        dataList:[],
        onItemChooseChange: function (indexArray) { },
    },
    didMount() {
    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        _bindItemTap: function (e) {
          console.log('e',e);
            this.props.onItemChooseChange([e.currentTarget.dataset.index, this.props.itemIndex]);
        },
    },
});