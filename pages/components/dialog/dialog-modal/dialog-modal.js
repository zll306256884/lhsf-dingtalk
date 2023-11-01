Component({
  mixins: [],
  data: {
    customVisible: false,
  },
  props: {
    option:{
      title:"提示",
      content:"删除后无法恢复",
      primaryButtonText:"删除",
      secondaryButtonText:"取消"
    },
    onCallBack:function(date) {},
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 显示弹窗
    showDialog(){
      this.setData({
        customVisible: true,
      });
    },
    // 隐藏弹窗
    handleClose() {
      this.setData({
        customVisible: false,
      });
    },
    // 确认按钮
    handlePrimaryButtonTap() {
      this.props.onCallBack()
      this.handleClose();
    },
    // 取消按钮
    handleSecondaryButtonTap() {
      this.handleClose();
    },
  },
});
