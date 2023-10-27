Component({
  mixins: [],
  data: {
  },
  props: {
    index: 0,
    itemData: {},
    onBindCloseTap: function (e) { }
  },
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    // close 
    _bindCloseTap: function () {
      console.log(11111)
      this.props.onBindCloseTap(this.props.itemData, this.props.index)
    }
  }
});
