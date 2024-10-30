import { Form } from 'antd-mini/es/Form/form';
import apiApprovalManage from "../../../../server/workServer"
import request from "../../../../utils/request"
Component({
  mixins: [],
  props: {
    onScreenCallBack: function (id) { },
    parameter: {}
  },
  data: {
    basicVisible: false,
    fruit: '',
    form: new Form(),
    list: [],
  },
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    handleRef(ref) {
      this.data.form.addItem(ref);
    },
    async submit() {
      const params = await this.data.form.submit();
      this.props.onScreenCallBack({
        state: 'success',
        jflowAuditUser: JSON.stringify(params)
      })
      this._closePopup()
    },
    async getList() {
      request.doPostRequest({
        url: apiApprovalManage.API_JFLOW_FLOWNODELISTBYTYPE,
        data: this.props.parameter,
        success: res => {
          let data = res.data
          data.forEach(element => {
            element.userList.forEach(item=>{
              item.value = item.userId
              item.label = item.username
            })
          });
          this.setData({
            list: data
          })
        }
      });
    },
    bindCancelTap() {
      this.setData({
        basicVisible: false
      })
      this.props.onScreenCallBack({
        state: 'cancel'
      })
    },
    _openPopup() {
      this.getList()
      this.setData({
        basicVisible: true
      })
    },
    _closePopup() {
      this.setData({
        basicVisible: false
      })
    }
  },
});
