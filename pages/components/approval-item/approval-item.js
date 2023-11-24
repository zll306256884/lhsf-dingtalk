// import {
//   isEqual,
//   isEmptyArray
// } from "../../../../utils/utils"
// import ddUtils from "../../../../utils/ddUtils"
// import userServer from "../../../server/userServer"
import approvalServer from "../../../server/approvalServer/approvalServer"
import request from "../../../utils/request"
const app = getApp();

Component({
  mixins: [],
  data: {
    // 已经有的节点
    listData: [],
    // 当前进行的节点
    nextNode: []
  },
  props: {
    projectId: '12019020004',//项目id
    keyId: "1722516061045305346",//keyId
  },
  //组件创建时触发
  onInit() {
  },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) {

  },
  //组件创建完毕时触发
  //此时页面已经渲染，通常在这时请求服务端数据。
  didMount() {
    // console.log('this.is组件路径', this.is);
    // console.log('$page组件所属页面实例', this.$page);
    // console.log('$id 组件 id，在 axml 中也可直接渲染', this.$id);
    this.integrationData()
  },
  //组件更新完毕时触发
  //每次组件数据变更的时候都会调用。
  didUpdate(prevProps, prevData) { },
  //组件删除时触发
  //每当组件实例从页面卸载的时候都会触发此回调。
  didUnmount() {
    console.log('父组件传递过来的projectId', this.props.projectId)
    console.log('keyId', this.props.keyId)
  },
  //组件 js 代码抛出错误时触发
  onError(e) {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取节点
    getList: function () {
      // return
      let param = { "keyId": this.props.keyId }
      console.log('param', param)
      // return
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: approvalServer.API_APPROVAL_LIST,
          showLoading: false,
          data: param,
          success: res => {
            res.data.map((item) => {
              item.annexesUrl = JSON.parse(item.annexesUrl)
            })
            // console.log('res.data', res.data)
            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 获取下一个节点
    getNextNode: function () {
      // return
      let param = { "keyId": this.props.keyId }
      console.log('param', param)
      // return
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: approvalServer.API_NEXT_APPROVAL_NODE,
          showLoading: false,
          data: param,
          success: res => {
            // console.log('res.data', res.data)
            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 整合数据
    async integrationData() {
      // 审核类型（1通过2驳回3待审核）
      var data1 = await this.getList()
      let data2 = await this.getNextNode()
      console.log('data1', data1)
      console.log('data2', data2)
      let obj
      if (data2["auditUserNameList"] && data2["auditUserNameList"].length) {
        obj = {
          operatorsName: data2["auditUserNameList"][0],
          operatorsContent: '进行审批',
          content: '',
          type: 99
        }
        // 下一个审批的数据放在头部
        data1.unshift(obj)
      }
      console.log('obj', obj)
      console.log('data1new', data1)

      this.setData({
        listData: data1
      });
    },
    // toEditPage(e) {
    //   console.log('e', e)
    //   let id = e.target.dataset.planId
    //   let type = e.target.dataset.type
    //   let name = e.target.dataset.name
    //   let projectId = e.target.dataset.projectId
    //   // return
    //   dd.navigateTo({
    //     url: '/pages/work/page/progressEdit/progressEdit?id=' + id + '&type=' + type + '&name=' + name + '&projectId=' + projectId,
    //   })
    // },
  },
});