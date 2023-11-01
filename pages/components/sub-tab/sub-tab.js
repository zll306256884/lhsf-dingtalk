Component({
  mixins: [], // minxin 方便复用代码
  data: { // 组件内部数据
    eText: '111',
    counter: 1,
    name: 'name'
  },
  props: { // 可给外部传入的属性添加默认值
    edata: '',
    subTabList: [{
        name: '我是默认值1'
      },
      {
        name: '我是默认值2'
      },
    ],
    // 我是父组件传递过来的函数
    // 外部使用自定义组件时，如果传递的参数是函数，一定要以 on 为前缀，否则会将其处理为字符串。
    onOptionData: (data) => console.log(data),
  },
  didMount() {
    //didMount为渲染后回调，此时页面已经渲染，通常在这里请求服务端数据比较合适。

  },
  didUpdate(prevProps, prevData) {
    // didUpdate 为更新后回调，每次组件数据变更的时候都会调用。
    // 组件内部调用 this.setData 会触发 didUpdate
    // 外部调用者调用 this.setData 也会触发 didUpdate
    console.log(prevProps, this.props, prevData, this.data)
  },
  didUnmount() {
    // didUnmount 为删除后回调，每当组件示例从页面删除的时候会触发此回调。
  },
  methods: {
    bindSubTabItemTap2: function (e) {
      console.log('点击了')
      this.setData({
        counter: this.data.counter + 1
      });
    },
    // 给父组件传递数据
    getParent: function (e) {
      const counter = this.data.counter;
      this.props.onOptionData(counter);
    },
    //bind sub tab item tap
    bindSubTabItemTap: function (e) {
      // this.hideAllScreenDialog();
      console.log(1, e);

      // switch (e.currentTarget.dataset.index) {
      //   case 0: //施工单位
      //     if (this.dialogScreenShiGongUnitRef)
      //       this.dialogScreenShiGongUnitRef._showDialog(this.screenShiGongUnitData.id);
      //     break;
      //   case 1: //危险源类型
      //     if (this.dialogScreenTypeRef)
      //       this.dialogScreenTypeRef._showDialog(this.screenDangerousTypeData.type);
      //     break;
      //   case 2: //危险源等级
      //     if (this.dialogScreenLevelRef)
      //       this.dialogScreenLevelRef._showDialog(this.screenDangerousLevelData.value);
      //     break;
      //   case 3: //状态
      //     if (this.dialogScreenStatusRef)
      //       this.dialogScreenStatusRef._showDialog(this.screenStatusData.value);
      //     break;
      //   default:
      //     break;
      // }
    },
  }, // 自定义方法
});