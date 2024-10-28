import { Form } from 'antd-mini/es/Form/form';
Component({
  mixins: [],
  props: {
    onScreenCallBack: function (id) { }
  },
  data: {
    basicVisible: false,
    fruit: '',
    form: new Form(),
    list: [{
      nodeName:'测试A',
      userList: [
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
        { label: '橙子', value: 'orange' }
      ],
    }],
  },
  didMount() {

  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleRef(ref) {
      this.data.form.addItem(ref);
    },
    async submit() {
      const params = await this.data.form.submit();
      console.log("ddddd======",params)
      this.props.onScreenCallBack({
        id:'12333'
      })
    },
    bindCancelTap(){
      this.setData({
        basicVisible: false
      })
    },
    _openPopup(){
      this.setData({
        basicVisible: true
      })
    }
  },
});
