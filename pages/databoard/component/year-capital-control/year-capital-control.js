
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
    this.getist()
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
  console.log(this.data.checkoutPage);
  },
   getist(){
    request.doPostRequest({
      url: confing.API_PAY_POST,
      data: {
        pageNum:1,
        pageSize:10,
        projectName:''
      },
      success: res => {
        console.log(res.data)
        this.setData({
          recordList: res.data.records
        })
      }
    })
   }    
  },
});
