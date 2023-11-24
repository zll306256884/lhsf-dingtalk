import apiDataBoardServer from "../../../../server/dataBoardServer"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"

Component({
  mixins: [],
  data: {
    dataInfo: null,
    dataContractInfo: null,
    docList: [],
    conList: [],
    listType: '1',
    projectName: ''
  },
  props: {},
  didMount() {
    this.getData()
    this.getDocumentDataList()
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    toProject(e){
      let {item} = e.currentTarget.dataset
      ddUtils.navigateTo({
        url: `/pages/databoard/page/projectInfo/index?projectId=${item.projectId}&projectName=${item.projectName}&type=4&childrenTab=${this.data.listType}`
      });
    },
    getData(){
      request.doPostRequest({
        url: apiDataBoardServer.API_TENDER_PROGRESS,
        data: {},
        success: res => {
          console.log(res);
          res.data.tenderAllPrice = parseInt(res.data.tenderAllPrice)
          this.setData({
            dataInfo: res.data
          })
          console.log(this.data.dataInfo);
        },
      });
      
      request.doPostRequest({
        url: apiDataBoardServer.API_AMOUNTCONTROL,
        data: {},
        success: res => {
          res.data.allContractPrice = parseInt(res.data.allContractPrice)
          this.setData({
            dataContractInfo: res.data
          })
        },
      });
    },
    listChange(e){
      this.setData({
        listType: e.currentTarget.dataset.index
      })
      if(e.currentTarget.dataset.index === '1'){
        this.getDocumentDataList()
      }else{
        this.getContractDataList()
      }
    },
    searchList(e){
      this.setData({
        projectName: e.detail.value
      })
      if(this.data.listType === '1'){
        this.getDocumentDataList()
      }else{
        this.getContractDataList()
      }
    },
    getDocumentDataList(){
      let params = {
        pageNum: 1,
        pageSize: 99999,
        projectName: this.data.projectName
      }
      request.doPostRequest({
        url: apiDataBoardServer.API_ANNUAL_PROJECTDOCUMENT,
        data: params,
        success: res => {
          this.setData({
            docList: res.data.records
          })
        },
      });
    },
    getContractDataList(){
      let params = {
        pageNum: 1,
        pageSize: 99999,
        projectName: this.data.projectName
      }
      request.doPostRequest({
        url: apiDataBoardServer.API_ANNUAL_PROJECTCONTRACT,
        data: params,
        success: res => {
          this.setData({
            conList: res.data.records
          })
        },
      });
    }
  },
});
