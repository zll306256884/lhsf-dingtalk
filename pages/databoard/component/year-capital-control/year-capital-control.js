
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
    infoData:{},
    recordList:[]
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
     this.getAlteration()
    }else{
      this.getList()
    }
  },
  searchDocList(e){
    console.log(e);
    this.getList(e.detail.value)
    this.getAlteration(e.detail.value)
  },
   getList(name){
    request.doPostRequest({
      url: confing.API_PAY_POST,
      data: {
        pageNum:1,
        pageSize:10,
        projectName:name
      },
      success: res => {
        console.log(res.data)
        this.setData({
          recordList: res.data.records
        })
      }
    })
   },   
   getAlteration(proName){
    request.doPostRequest({
      url: confing.API_ALTER_POST,
      data: {
        pageNum:1,
        pageSize:10,
        projectName:proName
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
   ddUtils.navigateTo({
    url: `/pages/databoard/page/projectInfo/index?projectId=${item.projectId}&projectName=${item.projectName}&current=${3}`
  });
   }
  },
});
