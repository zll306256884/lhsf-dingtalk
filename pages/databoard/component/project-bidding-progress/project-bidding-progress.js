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
    projectId: null
  },
  didMount() {
    this.getData('1')
    this.getDocList()
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
    },
    searchConList(e){
      console.log(e);
    },
    getDocList(){
      let params = {
        pageNum: 1,
        pageSize: 10,
        projectId: this.props.projectId
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
    getContratList(){
      let params = {
        pageNum: 1,
        pageSize: 10,
        projectId: this.props.projectId,
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
    }
  },
});
