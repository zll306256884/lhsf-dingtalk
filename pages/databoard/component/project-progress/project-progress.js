import utils from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import progressServer from "../../../../server/workServer/progressServer";


Component({
  mixins: [],
  data: {
    navbarData: {
      title: "进度计划详情",
    },
    listData: [1, 2, 3, 4, 5],
    // projectId: '12019020004',//项目id
    flagNode: '',//是否为里程碑节点
    status: '',//筛选的状态
    // new
    currentOpen: -1,
    items: [
      {
        title: '全部',
        options: [
          {
            text: '全部',
            value: '',
          },
          {
            text: '延期',
            value: 3,
          },
          {
            text: '进行中',
            value: 2,
          },
          {
            text: '未开始',
            value: 1,
          },
          {
            text: '已完成',
            value: 4,
          },
        ],
      },
      {
        title: '里程碑节点',
        options: [
          // {
          //   text: '选项一',
          //   value: '1',
          // },
          // {
          //   text: '选项二',
          //   value: '2',
          // },
          // {
          //   text: '选项三',
          //   value: '3',
          // },
        ],
      },
    ],
  },
  props: {
    projectId: '12019020004',//项目id
  },
  //组件创建时触发
  onInit() { },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) { },
  //组件创建完毕时触发
  //此时页面已经渲染，通常在这时请求服务端数据。
  didMount() {
    this.getList()
  },
  //组件更新完毕时触发
  //每次组件数据变更的时候都会调用。
  didUpdate(prevProps, prevData) { },
  //组件删除时触发
  //每当组件实例从页面卸载的时候都会触发此回调。
  didUnmount() { },
  methods: {
    // 二级选项更改
    handleChange(value, items, e) {
      console.log(value, items, e, 1);
      this.data.status = value
      this.setData({ status: value });
      this.getList()
      // this.data.currentOpen = -1;
      this.setData({ currentOpen: -1 });
    },
    // 一级选项更改
    onTapItem(e) {
      // console.log(e, 2);
      // console.log(e.currentTarget.dataset.index);
      const { index } = e.target.dataset;
      if (index === 1) {
        this.milestoneNode(e)
      }
      console.log('index', index);
      const { currentOpen } = this.data;
      let value = index;
      if (currentOpen === index) {
        value = -1;
      }
      this.setData({ currentOpen: value });

    },
    // 获取基本信息
    getList: function () {
      let param = {
        "projectId": this.props.projectId,
        'status': this.data.status,
        // "projectId": '12019020004',
        'flagNode': this.data.flagNode,
        'enable': 1
      }
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: progressServer.API_PROGRESS_LIST,
          showLoading: false,
          data: param,
          success: res => {
            console.log('res.data', res.data)
            this.setData({
              listData: res.data
            });
            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
    },
    // 点击里程碑节点
    milestoneNode(e) {
      console.log(2333)
      let code
      // 1  里程碑  0  非里程碑   空字符串   全量
      if (this.data.flagNode) {
        this.setData({
          flagNode: ''
        });
      } else {
        this.setData({
          flagNode: 1
        });
      }
      this.getList()
    },
    // 

  },
});
