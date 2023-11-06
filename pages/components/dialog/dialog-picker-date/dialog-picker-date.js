import dayjs from "dayjs";
const app = getApp();

Component({
  mixins: [],
  props: {
    formatDate:"YYYY-MM-DD HH:mm:ss",//默认YYYY-MM-DD HH:mm:ss
    selectionMode:"single",// single，range 默认single
    marginTop: 0,
    onPickerCallBack: function(date) {},
  },
  data: {
    options: {
      title: dayjs(new Date().getTime()).format("YYYY-MM"),
      monthRange: [new Date().getTime(), new Date().getTime()],
      visible: true
    },
    showDialog: false,
    startDate:"",
    endDate:""
  },
  didMount() {
    app.getSystemInfo(res => {
      this.setData({
        topHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight
      });
    });
  },
  didUpdate(prevProps, prevData) {},
  didUnmount() {},
  onError(e) {},
  methods: {
    // 下一月
    nextMonth: function() {
      var current = this.data.options.monthRange[0];
      var newMonth = dayjs(current)
        .add(1, "month")
        .toDate()
        .getTime();
      this.setData({
        "options.title": dayjs(newMonth).format("YYYY-MM-DD"),
        "options.monthRange": [newMonth, newMonth]
      });
    },
    // 前一月
    previousMonth: function() {
      var current = this.data.options.monthRange[0];
      var newMonth = dayjs(current)
        .add(-1, "month")
        .toDate()
        .getTime();
      this.setData({
        "options.title": dayjs(newMonth).format("YYYY-MM-DD"),
        "options.monthRange": [newMonth, newMonth]
      });
    },
    // 下一年
    nextYear: function() {
      var current = this.data.options.monthRange[0];
      var newMonth = dayjs(current)
        .add(1, "year")
        .toDate()
        .getTime();
      this.setData({
        "options.title": dayjs(newMonth).format("YYYY-MM-DD"),
        "options.monthRange": [newMonth, newMonth]
      });
    },
    // 前一年
    previousYear: function() {
      var current = this.data.options.monthRange[0];
      var newMonth = dayjs(current)
        .add(-1, "year")
        .toDate()
        .getTime();
      this.setData({
        "options.title": dayjs(newMonth).format("YYYY-MM-DD"),
        "options.monthRange": [newMonth, newMonth]
      });
    },
    // 时间改变
    onChange(date) {
      if(this.props.selectionMode==="single"){
        this.setData({
          startDate:dayjs(date).format(this.props.formatDate)
        });
      }else{
        this.setData({
          startDate:dayjs(date[0]).format(this.props.formatDate),
          endDate:this.props.formatDate==='YYYY-MM-DD HH:mm:ss'?dayjs(date[1]).format("YYYY-MM-DD") + ' 23:59:59':dayjs(date[1]).format(this.props.formatDate)
        }); 
      }
    },
    // 点击确定
    handleTap(){
      if(this.props.selectionMode==="single"){
        this.props.onPickerCallBack({
          startDate:this.data.startDate,
        });
      }else{
        this.props.onPickerCallBack({
          startDate:this.data.startDate,
          endDate:this.data.endDate
        });
      }
      this._hideDialog();
    },
    // 点击蒙层移除弹框
    _bindCancelTap(){
      this._hideDialog();
    },
    _bindTouchMove: function(e) {
      return;
    },
    //judge is show dialog
    _isShowDialog() {
      return this.data.showDialog;
    },
    //show modal dialog
    _showDialog: function() {
      if (this._isShowDialog()) return;
      this.setData({
        showDialog: true
      });
    },

    //hide modal dialog
    _hideDialog: function(e) {
      if (!this._isShowDialog()) return;
      this.setData({
        showDialog: false
      });
    },
  }
});
