Component({
  mixins: [],
  data: {},
  props: {
    listData: [1, 1, 1, 1],
    projectId:'',
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
      let id = e.target.dataset.planId
      let type = e.target.dataset.type
      let name = e.target.dataset.name
      let projectId = e.target.dataset.projectId
      // return
      dd.navigateTo({
        url: '/pages/work/page/progressEdit/progressEdit?id=' + id + '&type=' + type+ '&name='+name+ '&projectId='+projectId,
      })
    },
  },
});