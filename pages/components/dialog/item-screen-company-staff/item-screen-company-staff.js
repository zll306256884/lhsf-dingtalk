import { isEmptyArray } from "../../../../utils/utils";
const app = getApp();

Component({
    mixins: [],
    data: {
    },
    props: {
        itemIndex: -1,
        multiChoose: false,
        isShow: false,
        companyList: [],
        staffList: [],
        onItemChooseCompanyChange: function (indexArray) { },
        onItemChooseUserChange: function (indexArray) { }
    },
    didMount() {
    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        //bind item company tap
        _bindItemCompanyTap: function (e) {
            let index = e.currentTarget.dataset.index;

            if (isEmptyArray(this.props.companyList[index].organizeList) && isEmptyArray(this.props.companyList[index].staffList)) return;

            this.props.onItemChooseCompanyChange([index, this.props.itemIndex]);
        },

        //bind item tap
        _bindItemUserTap: function (e) {
          if(!e.currentTarget.dataset.item.disabled){
            this.props.onItemChooseUserChange([e.currentTarget.dataset.index, this.props.itemIndex]);
          }
        },

        _bindItemChooseCompanyChange: function (arr) {
            this.props.onItemChooseCompanyChange([...arr, this.props.itemIndex]);
        },

        _bindItemChooseUserChange: function (arr) {
            this.props.onItemChooseUserChange([...arr, this.props.itemIndex]);
        },
    },
});