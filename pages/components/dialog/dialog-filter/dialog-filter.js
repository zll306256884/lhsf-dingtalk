const app = getApp();

Component({
  mixins: [],
  data: {
    options:[
      {
        label:"类型",
        prop:"type",
        value:[],
        type:'select',
        option: [
          {
              id:"1",
              label: '意外医疗',
              selected: false,
          },
          {
              id:"2",
              label: '疾病医疗',
              selected: false,
          },
          {
              id:"3",
              label: '疾病住院',
              selected: false,
          },
      ],
      },
      {
        label:"人员",
        value:"",
        prop:"userName",
        type:'input' 
      },
    ],
    scrollHeight: 0,
    topHeight: 0,
  },
  props: {
    showDialog:false,
    marginTop: 0,
    positionBottom: true,
    title: "筛选器",
    onBindSureTap: function (data) { },
    onDialog: function (data) { },  
  },
  didMount() {
    app.getSystemInfo(res => {
        this.setData({
            topHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight,
            scrollHeight: app.globalData.appSystemInfo.screenHeight * 0.6
        });
    });
},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 点击取消按钮
    _bindCloseTap(){
      this.props.onDialog(false)
    },
    // 点击确认按钮
    _bindSureTap(){
      this.props.onBindSureTap({
        options:this.data.options
      })
      this.props.onBindSureTap(this.data.options)
      console.log('this.data.options',this.data.options);
    },
    // 点击重置按钮
    _bindResetTap(){
      this.data.options.map(opt=>{
        if(opt.type==='select'){
        opt.option.map(item=>item.selected=false)
        }
        opt.value=""
      })
      this.setData({
      options:this.data.options
      });
    },
    // tag项选中状态改变
    _onChange(e) {
      let Index=e.currentTarget.dataset.Index
      let sunIndex=e.currentTarget.dataset.index
      this.data.options[Index].option[sunIndex].selected = !e.currentTarget.dataset.selected;
      this.data.options[Index].value=this.data.options[Index].option.filter(item => item.selected);
      this.setData({
         options:this.data.options
      });
    },
    // 鼠标失焦事件
    _bingBlurChange(data){
      this.data.options[data.index].value=data.e.detail.value
      this.setData({
        options:this.data.options
    });
    console.log(this.data.options);
    },
    // 点击蒙层事件
    _bindCancelTap(){
      this.props.onDialog(false)
    }
  },
});
