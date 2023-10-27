Component({
  mixins: [],
  data: {
    currentNum: 1,
  },

  props: {
    value: null,
    cssStyle: "",
    miniNum: 1,
    maxNum: Number.MAX_VALUE,
    onInputChangeTap: function (value) { }
  },

  didMount() {
    if (this.props.value && typeof this.props.value === 'number') {
      this.setData({
        currentNum: this.props.value
      });
    }
    this.props.onInputChangeTap(this.data.currentNum)
  },

  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) {

  },

  //组件更新完毕时触发
  //每次组件数据变更的时候都会调用。
  didUpdate(prevProps, prevData) {

  },

  //组件删除时触发
  //每当组件实例从页面卸载的时候都会触发此回调。
  didUnmount() {

  },

  didUnmount() { },

  methods: {
    //bind subtract tap
    _bindSubtractTap: function () {
      this.setData({
        currentNum: Math.max(--this.data.currentNum, this.props.miniNum)
      });

      this.props.onInputChangeTap(this.data.currentNum)
    },

    //bind plus tap
    _bindPlusTap: function (e) {
      this.setData({
        currentNum: Math.min(++this.data.currentNum, this.props.maxNum)
      });

      this.props.onInputChangeTap(this.data.currentNum)
    },

    //bind input change
    _bindInputChange: function (e) {
      this.data.currentNum = e.detail.value;

      this.props.onInputChangeTap(this.data.currentNum)
    },
  },
});
