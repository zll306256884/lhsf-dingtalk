Component({
  mixins: [],
  data: {
  },
  props: {
    listData: [
      // 默认数据
      {
        "id": "1722131213705154561",
        "createTime": "2023-11-08 13:57:32",
        "updateTime": "2023-11-08 13:57:32",
        "delFlag": 0,
        "operatorsId": "1715236939407294464",
        "operatorsName": "任学锦",
        "operatorsAccount": "任学锦",
        "operatorsContent": "提交审核",
        "keyId": "1722131213185085441",
        "projectId": "1719174362822606848",
        "projectName": "测试小程序",
        "type": 3,
        "jflowWorkid": 16232,
        "jflowNo": "068",
        "vueUrl": "ApproveContractApprovalDetail,ApproveContractApprovalCreatAndEdit",
        "belongModule": 3,
        "taskName": "合同审批流程：简介-测试合同",
        "annexesUrl": null,
        "content": null,
        "auditUser": "任学锦",
        "jflowNodeId": null,
        "urlParameter": "{\"id\":\"1722131213185085441\"}"
      }
    ],

    projectId: '',
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
      let id = e.target.dataset.planId
      let type = e.target.dataset.type
      let name = e.target.dataset.name
      let projectId = e.target.dataset.projectId
      // return
      dd.navigateTo({
        url: '/pages/work/page/progressEdit/progressEdit?id=' + id + '&type=' + type + '&name=' + name + '&projectId=' + projectId,
      })
    },
  },
});