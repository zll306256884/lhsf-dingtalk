
import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
import progressServer from "../../../../server/workServer/progressServer"; //
import projectServer from "../../../../server/workServer/projectServer";
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
    recordList:[],
    userNameInfo:'',
    customVisible: false,
    personList: []
  },
  props: {
    projectId: null,
    alter:'',
    dingTalkId:"1",
    
  },
  didMount() {
    if(this.props.alter === '5'){
      this.data.checkoutPage = 5
       this.getAlteration()
       this.getTopMoney(1)
    }else{
      this.getTopMoney(1)
    this.getList(2)
    }
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
    this.setData({
      searchName:e.detail.value
    })
    this.getList()
    this.getAlteration()
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
   getAlteration(){
    request.doPostRequest({
      url: confing.API_CHANGE_POST,
      data: {
        pageNum:1,
        pageSize:9999,
        contractName:this.data.searchName,
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
    // 电话
    callIt() {
      console.log('打电话invest：', this.props.projectId);
      // 通过项目ID查询项目负责人
      request.doPostRequest({
        url: projectServer.API_PROJECT_LEADER,
        data: { projectId: this.props.projectId },
        success: res => {
          console.log('项目负责人:', res.data)
          this.setData({
            personList: res.data,
            customVisible: true
          })
        }
      })
      // request.doPostRequest({
      //   url: projectService.API_SELECTPROJECT_INFO_BYID,
      //   data:{id:this.props.projectId},
      //   success: res => {
      //     console.log(res.data,333333333333333333)
      //     this.setData({
      //       userNameInfo: res.data.projectLeaderName
      //     })
      //      // console.log('打电话')
      //    ddUtils.showModal({
      //   title:`您即将呼叫：${res.data.projectLeaderName}`,
      //   content: '请确认',
      //   success: res => {
      //     if (res.confirm) {
      //       dd.callUsers({
      //         users: [this.props.dingTalkId],
      //         // users: ['0146024235748171'],
      //         corpId: 'ding1d9d54bb1a36aca6f5bf40eda33b7ba0',
      //         success: () => { },
      //         fail: (res) => {
      //           console.log(res)
      //           ddUtils.showToast({
      //             title: 'errorCode：' + res.error + ',' + res.errorMessage
      //           });
      //         },
      //         complete: () => { },
      //       });
      //     }
      //   }
      // });
      //   }
      // })
     
      // return
      // if (this.props.listData && !this.props.listData.length) {
      //   return
      // }
      // let callCode = this.props.dingTalkId
      // // let callCode='1715236940858523649'
      // return new Promise((resolve, reject) => {
      //   request.doPostRequest({
      //     url: progressServer.API_CALL_CODE,
      //     showLoading: true,
      //     data: {
      //       "userId": callCode
      //     },
      //     success: res => {
      //       console.log('res.data', res.data)
            
      //     },
      //     fail: res => {
      //       reject(res)
      //     }
      //   });
      // })
    },
    callPhone(e) {
      console.log('callPhone---e:', e);
      let name = ''
      let callCode = ''
      let info = e.currentTarget.dataset.info
      name = info.name
      callCode = info.personId
      let str = '您即将呼叫' + name + '?'
      ddUtils.showModal({
        // title: '您即将呼叫？',
        title: str,
        content: "请确认",
        success: res => {
          if (res.confirm) {
            return new Promise((resolve, reject) => {
              request.doPostRequest({
                url: progressServer.API_CALL_CODE,
                showLoading: true,
                data: {
                  "userId": callCode
                },
                success: res => {
                  console.log('获取电话ID---res.data', res.data)
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
    handleClose() {
      this.setData({
        customVisible: false,
      });
    },

   // 跳转
   clickCapital(value){
     console.log(value);
    let item = value.target.dataset.item
    if(this.data.changeType===2 || this.data.changeType===4){
      ddUtils.navigateTo({
        url: `/pages/work/page/addPaymentDetail/addPaymentDetail?id=${item.id}&projectId=${item.projectId}&keyId=${item.id}`
      });
    }
  if(this.data.changeType===5){
    console.log(121212121212);
    ddUtils.navigateTo({
      url: `/pages/work/page/alterationRegisterDetail/alterationRegisterDetail?id=${item.id}&isShow=${false}&keyId=${item.id}`
    });
  }
   }
  },
});
