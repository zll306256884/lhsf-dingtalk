import dayjs from "dayjs";
const app = getApp();

Component({
  mixins: [],
  props: {
    selectionMode:"single",
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
    onChange(date) {
      if(this.props.selectionMode==="single"){
        this.setData({
          startDate:dayjs(date).format("YYYY-MM-DD")
        });
      }else{
        this.setData({
          startDate:dayjs(date[0]).format("YYYY-MM-DD"),
          endDate:dayjs(date[1]).format("YYYY-MM-DD")
        }); 
      }
    },
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
