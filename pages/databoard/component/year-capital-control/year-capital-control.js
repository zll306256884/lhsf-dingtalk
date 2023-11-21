
import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
Component({
  mixins: [],
  data: {
    items:[
      {title:"支付",},
      {title:"变更",},
    ],
    checkoutPage:1,
    alert:0,
    infoData:{},
    recordList:[],
    projectName:''
  },
  props: {},
  didMount() {
    this.getCapital()
    this.getList()
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
  getCapital(){
    request.doPostRequest({
      url: confing.API_MONEY_POST,
      data: {},
      success: res => {
        console.log(res.data)
        this.setData({
          infoData: res.data
        })
      }
    })
  },
  oclick(index){
    this.setData({
      checkoutPage:index.target.dataset.id === 1? 1:2
    })
    if(this.data.checkoutPage===2){
      this.setData({
        alter : 5 
      })
     this.getAlteration()
    }else{
      this.setData({
        alter : 0 
      })
      this.getList()
    }
  },
  searchDocList(e){
    console.log(e);
    this.setData({
      projectName:e.detail.value
    })
    if(this.data.checkoutPage === 1){
      this.getList()
    }else{
      this.getAlteration()
    }
  },
   getList(){
    request.doPostRequest({
      url: confing.API_PAY_POST,
      data: {
        pageNum:1,
        pageSize:9999,
        projectName:this.data.projectName
      },
      success: res => {
        console.log(res.data)
        this.setData({
          recordList: res.data.records
        })
      }
    })
   },   
   getAlteration(){
    request.doPostRequest({
      url: confing.API_ALTER_POST,
      data: {
        pageNum:1,
        pageSize:9999,
        projectName:this.data.projectName
      },
      success: res => {
        console.log(res.data)
        this.setData({
          recordList: res.data.records
        })
      }
    })
   },
   // 跳转
   clickCapital(value){
     console.log(value);
    let item = value.target.dataset.item
    if(this.data.checkoutPage === 2){
    }
   ddUtils.navigateTo({
    url: `/pages/databoard/page/projectInfo/index?projectId=${item.projectId}&projectName=${item.projectName}&current=${3}&alter=${this.data.alter}&dingTalkId=${item.dingTalkId}&userName=${item.userName}`
  });
   }
  },
});
