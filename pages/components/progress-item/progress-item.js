Component({
  mixins: [],
  data: {},
  props: {
    listData: [1, 1, 1, 1]
  },
  didMount() {
    console.log('this.is组件路径', this.is);
    console.log('$page组件所属页面实例', this.$page);
    console.log('$id 组件 id，在 axml 中也可直接渲染', this.$id);
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    toEditPage(e) {
      console.log('e', e)
      let id = e.target.dataset.id
      let type = e.target.dataset.type
      dd.navigateTo({
        url: '/pages/work/page/progressEdit/progressEdit?id=' + id + '&type=' + type,
      })
    },
  },
});