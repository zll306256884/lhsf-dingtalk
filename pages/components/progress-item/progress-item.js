Component({
  mixins: [],
  data: {},
  props: {
    listData: [{
      name: 1,
    }]
  },
  didMount() {
    console.log('this.is组件路径', this.is);
    console.log('$page组件所属页面实例', this.$page);
    console.log('$id 组件 id，在 axml 中也可直接渲染', this.$id);
  },
  didUpdate() {},
  didUnmount() {},
  methods: {},
});