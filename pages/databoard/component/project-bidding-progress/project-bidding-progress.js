import apiDataBoardServer from "../../../../server/dataBoardServer"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
import progressServer from "../../../../server/workServer/progressServer"; //
import projectService from "../../../../server/workServer/projectServer";
Component({
  mixins: [],
  data: {
    dataInfo: null,
    dataContractInfo: null,
    type: '1',
    documentList: [],
    contratList: [],
    listType: '1',
    options: [
      {
        label: "招标方式",
        prop: "biddingType",
        value: [],
        type: 'select',
        option: [
          {
            id: 1,
            label: '公开招标',
            selected: false,
          },
          {
            id: 2,
            label: '邀请招标',
            selected: false,
          },
          {
            id: 3,
            label: '竞争性谈判',
            selected: false,
          },{
            id: 4,
            label: '竞争性磋商',
            selected: false,
          }, {
            id: 5,
            label: '单一来源采购',
            selected: false,
          },
          {
            id: 6,
            label: '协议采购',
            selected: false,
          }
        ],
      },
      {
        label: "项目类别",
        prop: "projectType",
        value: [],
        type: 'select',
        option: [
          {
            id: 1,
            label: '市级年度计划',
            selected: false,
          },
          {
            id: 2,
            label: '集团年度计划',
            selected: false,
          },
          {
            id: 3,
            label: '子公司年度计划',
            selected: false,
          }
        ],
      }
    ],
    optionsTwo: [
      {
        label: "合同类型",
        prop: "supplementAgreement",
        value: [],
        type: 'select',
        option: [
          {
            id: 0,
            label: '主合同',
            selected: false,
          },
          {
            id: 1,
            label: '补充协议',
            selected: false,
          }
        ],
      }
    ]
    ,
    visibel: false,
    visibelTwo: false,
    supplementAgreement: '',
    biddingType: '',
    projectType: ''
  },
  props: {
    projectId: null,
    childrenTab: null
  },
  page: 1,
  callCodeData: {},
  didMount() {
    if(this.props.childrenTab){
      this.setData({
        listType: this.props.childrenTab
      })
      this.getData(this.props.childrenTab)
      if(this.props.childrenTab === '1'){
        this.getDocList()
      }else{
        this.getContratList()
      }
    }else{
      this.getData('1')
      this.getDocList()
    }
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    filterDialog(){
      this.onDialog(true)
    },
    onDialog(data) {
      this.setData({
        visibel: data
      })
    },
    onBindSureTap(data) {
      console.log(data)
      let filterValue1 = data[0].option
      let list1 = filterValue1.filter(e => e.selected === true)

      let filterValue2 = data[1].option
      let list2 = filterValue2.filter(e => e.selected === true)
      this.onDialog(false)
      if(list1 && list1.length){
        if(list1.length > 1){
          ddUtils.showToast({
            title:'只能选一个'
          })
          return
        }else{
          this.setData({
            biddingType: list1[0].id
          })
        }
      }else{
        this.setData({
          biddingType: ''
        })
      }

      if(list2 && list2.length){
        if(list2.length > 1){
          ddUtils.showToast({
            title:'只能选一个'
          })
          return
        }else{
          this.setData({
            projectType: list2[0].id
          })
        }
      }else{
        this.setData({
          projectType: ''
        })
      }
      this.getDocList()
    },

    //合同
    filterDialogTwo(){
      this.onDialogTwo(true)
    },
    onDialogTwo(data) {
      this.setData({
        visibelTwo: data
      })
    },
    onBindSureTapTwo(data) {
      console.log(data)
      let filterValue = data[0].option
      let list = filterValue.filter(e => e.selected === true)
      this.onDialogTwo(false)
      if(list && list.length){
        if(list.length > 1){
          ddUtils.showToast({
            title:'只能选一个'
          })
          return
        }
        this.setData({
          supplementAgreement: list[0].id
        })
      }else{
        this.setData({
          supplementAgreement: ''
        })
      }
      
      this.getContratList()
    },
    getData(type){
      let params = {
        projectId: this.props.projectId,
        type: type
      }
      request.doPostRequest({
        url: apiDataBoardServer.API_BIDDING_PROGRESS,
        data: params,
        success: res => {
          console.log(res);
          this.setData({
            dataInfo: res.data
          })
          console.log(this.data.dataInfo);
        },
      });
    },
    changeTap(e){
      this.setData({
        type: e.currentTarget.dataset.index
      })
      this.getData(this.data.type)
    },
    listChange(e){
      this.page = 1
      this.setData({
        listType: e.currentTarget.dataset.index
      })
      if(e.currentTarget.dataset.index === '1'){
        this.getDocList()
      }else{
        this.getContratList()
      }
    },
    searchDocList(e){
      console.log(e);
      this.getDocList(e.detail.value)
    },
    searchConList(e){
      console.log(e);
      this.getContratList(e.detail.value)
    },
    getDocList(tenderName){
      let params = {
        pageNum: this.page,
        pageSize: 99999,
        projectId: this.props.projectId,
        tenderName: tenderName,
        approvalStatus: 4,
        biddingType: this.data.biddingType,
        projectType: this.data.projectType
      }
      request.doPostRequest({
        url: apiDataBoardServer.API_TENDER_DOCUMENT_LIST,
        data: params,
        success: res => {
          this.setData({
            documentList: res.data.records
          })
        },
      });
    },
    getContratList(contractName){
      let params = {
        pageNum: this.page,
        pageSize: 99999,
        projectId: this.props.projectId,
        contractName: contractName,
        approvalStatus: 4,
        supplementAgreement: this.data.supplementAgreement
      }
      request.doPostRequest({
        url: apiDataBoardServer.API_TENDER_CONTRACT_LIST,
        data: params,
        success: res => {
          this.setData({
            contratList: res.data.records
          })
        },
      });
    },
    toDocDetail(e){
      console.log(e)
      let {item} = e.currentTarget.dataset
      ddUtils.navigateTo({
        url: `/pages/work/page/bidDocumentDetail/bidDocumentDetail?id=${item.id}`
      });
    },
    toConDetail(e){
      let {item} = e.currentTarget.dataset
      ddUtils.navigateTo({
        url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.id}`
      });
    },
    callIt(){
      request.doPostRequest({
        url: projectService.API_SELECTPROJECT_INFO_BYID,
        data:{id:this.props.projectId},
        success: res => {
          console.log(res);
          this.callCodeData = {personId: res.data.personId, projectLeaderName: res.data.projectLeaderName}
          if(this.callCodeData.personId){
            ddUtils.showModal({
              title:'您即将呼叫'+this.callCodeData.projectLeaderName + '?',
              content: "请确认",
              success: res => {
                if (res.confirm) {
                  return new Promise((resolve, reject) => {
                    request.doPostRequest({
                      url: progressServer.API_CALL_CODE,
                      showLoading: true,
                      data: {
                        "userId": this.callCodeData.personId
                      },
                      success: res => {
                        console.log('res.data', res.data)
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
          }
        }
      })
      console.log(this.callCodeData);
      
      
    }
  }
});
