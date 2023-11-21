// import utils from "../../../../utils/utils"
// import ddUtils from "../../../../utils/ddUtils"
import ddUtils from "../../../utils/ddUtils"
// import request from "../../../../utils/request"
import request from "../../../utils/request"
// import config from "../../../../utils/config"
import progressServer from "../../../server/workServer/progressServer"; //
// import progressServer from "../../../../server/workServer/progressServer";
// import { Form } from 'antd-mini/es/Form/form';



Component({
  mixins: [],
  data: {
    showCall: false
  },
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
        console.log('工作台的节点')
        let id = e.target.dataset.planId
        let type
        if (e.target.dataset.delayDays > 0) {
          type = 1
        } else {
          type = 0
        }

        // let type = e.target.dataset.type
        let name = e.target.dataset.name
        let projectId = e.target.dataset.projectId
        // return
        dd.navigateTo({
          url: '/pages/work/page/progressEdit/progressEdit?id=' + id + '&type=' + type + '&name=' + name + '&projectId=' + projectId,
        })
      }
      // 数据看板的节点
      if (this.props.formPage === 'databoard') {
        console.log('数据看板的节点')
        let taskId = e.target.dataset.planId
        // let id = e.target.dataset.planId
        // let type = e.target.dataset.type
        // let name = e.target.dataset.name
        // let projectId = e.target.dataset.projectId
        // // return
        dd.navigateTo({
          url: '/pages/databoard/page/progressTaskDetails/progressTaskDetails?taskId=' + taskId,
        })
      }
    },
    // 电话
    callIt() {
      // console.log('打电话')
      if (this.props.listData && !this.props.listData.length) {
        return
      }
      let callCode = (JSON.parse(this.props.listData[0].responsible))[0].id
      let name = (JSON.parse(this.props.listData[0].responsible))[0].name
      console.log(JSON.parse(this.props.listData[0].responsible))
      let str = '您即将呼叫：' + name + '?'
      ddUtils.showModal({
        // title: '您即将呼叫？',
        title: str,
        content: "请确认",
        success: res => {
          if (res.confirm) {

            // let callCode='1715236940858523649'
            return new Promise((resolve, reject) => {
              request.doPostRequest({
                url: progressServer.API_CALL_CODE,
                showLoading: true,
                data: {
                  "userId": callCode
                },
                success: res => {
                  console.log('res.data', res.data)
                  dd.callUsers({
                    users: [res.data.dingTalkId],
                    // users: ['01460242357481712'],
                    corpId: 'ding1d9d54bb1a36aca6f5bf40eda33b7ba0',
                    success: () => { },
                    fail: (res) => {
                      console.log(res)
                      ddUtils.showToast({
                        title: 'errorCode：' + res.error + ',' + res.errorMessage
                      });
                    },
                    complete: () => { },
                  });

                },
                fail: res => {
                  reject(res)
                }
              });
            })

          }
        }
      })

    },
  },
});