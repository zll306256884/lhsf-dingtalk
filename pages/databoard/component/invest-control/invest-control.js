
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
    searchName:'',
    changeType:null,
    checkoutPage:2,
    typePage:1,
    infoData:{},
    recordList:[]
  },
  props: {
    projectId: null
  },
  didMount() {
    this.getTopMoney(1)
    this.getList(2)
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 头部tab切换
  topClick(index){
    let mold = index.target.dataset.id
    switch (mold) {
      case 1:
        this.getTopMoney(1)
        break;
      case 2:
        this.getTopMoney(2)
        break;
    }
    this.setData({
      typePage:index.target.dataset.id === 1? 1:2
    })
  },
  getTopMoney(e){
    request.doPostRequest({
      url: confing.API_CONTROL_POST,
      data: {
         type:e ,
         projectId:this.props.projectId
      },
      success: res => {
        console.log(res.data)
        this.setData({
          infoData: res.data
        })
      }
    })
  },
  
  oclick(index){
    let type = index.target.dataset.id 
    console.log(type);
    this.setData({
      changeType:type
    })
    console.log(this.data.changeType);
    switch (type) {
      case 2:
        this.getList(2)
        break;
      case 4:
        this.getList(4)
        break;
        case 5:
          this.getAlteration()
          break;
    }
    this.setData({
      checkoutPage:index.target.dataset.id === 2? 2:index.target.dataset.id=== 4 ? 4 :5
    })
    // if(this.data.checkoutPage===2){
    //  this.getAlteration()
    // }else{
    //   this.getList()
    // }
  },
  searchDocList(e){
    console.log(e);
   
    this.data.searchName = e.detail.value
    this.getList()
    this.getAlteration(e.detail.value)
  },
   getList(i){
    request.doPostRequest({
      url: confing.API_ROUTE_POST,
      data: {
        pageNum:1,
        pageSize:9999,
        contractName:this.data.searchName,
        approvalStatus:i,
        projectId:this.props.projectId
      },
      success: res => {
        console.log(res.data)
        this.setData({
          recordList: res.data.records
        })
      }
    })
   },   
   getAlteration(name){
    request.doPostRequest({
      url: confing.API_CHANGE_POST,
      data: {
        pageNum:1,
        pageSize:9999,
        projectName:name,
        projectId:this.props.projectId
      },
      success: res => {
        console.log(res.data,333333333333333333)
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
    url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${item.id}&projectId=${item.projectId}`
  });
  if(this.data.changeType===5){
    console.log(121212121212);
    ddUtils.navigateTo({
      url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${item.id}&isShow=${false}`
    });
  }
   }
  },
});
