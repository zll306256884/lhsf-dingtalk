Component({
  mixins: [],
  data: {},
  props: {
    listData: [1, 1, 1, 1],
    projectId: '',
    formPage: 'work',// databoard 数据看板 work 工作台
  },
  didMount() {
    console.log('this.is组件路径', this.is);
    console.log('$page组件所属页面实例', this.$page);
    console.log('$id 组件 id，在 axml 中也可直接渲染', this.$id);
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    toEditPage(e) {
      console.log('e', e)
      // 工作台的节点
      if (this.props.formPage === 'work') {
        // console.log('工作台的节点')
        let id = e.target.dataset.planId
        let type = e.target.dataset.type
        let name = e.target.dataset.name
        let projectId = e.target.dataset.projectId
        // return
        dd.navigateTo({
          url: '/pages/work/page/progressEdit/progressEdit?id=' + id + '&type=' + type + '&name=' + name + '&projectId=' + projectId,
        })
      }
      // 数据看板的节点
      if (this.props.formPage === 'databoard') {
        // console.log('数据看板的节点')
        // let id = e.target.dataset.planId
        // let type = e.target.dataset.type
        // let name = e.target.dataset.name
        // let projectId = e.target.dataset.projectId
        // // return
        dd.navigateTo({
          // 
          url: '/pages/databoard/page/progressTaskDetails/progressTaskDetails'
        })
      }
    },
  },
});