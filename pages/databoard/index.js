import ddUtils from "../../utils/ddUtils";

Page({
  data: {
    visibel: false,
    navbarData: {
      title: "临海市项目工程数据看板"
    },
    tabs: [
      {
        title: "项目概览"
      },
      {
        title: "年度资金管控"
      },
      {
        title: "年度招标进度"
      }
    ],
    currentTabIndex: 0,

    // 筛选器模拟数据
    options: [
      {
        label: "类型",
        prop: "type",
        value: [],
        type: "select",
        option: [
          {
            id: "1",
            label: "进度看板高考分数",
            selected: false
          },
          {
            id: "2",
            label: "进度看板高考分数",
            selected: false
          },
          {
            id: "3",
            label: "进度看板高考分数",
            selected: false
          }
        ]
      },
      {
        label: "人员",
        value: "",
        prop: "userName",
        type: "input"
      }
    ]
  },
  dialogScreenDateRef: null,
  onLoad() {},
  onTabChange(e) {
    this.setData({
      currentTabIndex: e
    });
  },
  _onSaveDialogScreenDateRef: function(ref) {
    this.dialogScreenDateRef = ref;
  },
  tapName(e) {
    this.setData({
      visibel: true
    });
  },
  _bindScreenDateCallBack(data) {
    console.log(data);
  },
  onDialog(data) {
    this.setData({
      visibel: data
    });
  },
  onBindSureTap(data) {
    console.log(data);
    this.onDialog(false);
  }
});
