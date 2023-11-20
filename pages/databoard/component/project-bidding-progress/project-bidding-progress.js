import apiDataBoardServer from "../../../../server/dataBoardServer"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
Component({
  mixins: [],
  data: {
    dataInfo: null,
    dataContractInfo: null,
    type: '1',
    documentList: [],
    contratList: [],
    listType: '1'
  },
  props: {
    projectId: null,
    childrenTab: null
  },
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
        pageNum: 1,
        pageSize: 10,
        projectId: this.props.projectId,
        tenderName: tenderName
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
        pageNum: 1,
        pageSize: 10,
        projectId: this.props.projectId,
        contractName: contractName
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
    }
  },
});
