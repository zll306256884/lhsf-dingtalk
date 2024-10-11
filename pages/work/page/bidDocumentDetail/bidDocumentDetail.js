import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
import workService from "../../../../server/workServer";
import messageServer from "../../../../server/messageServer"
import config from "../../../../utils/config";
import ddFile from "../../../../utils/ddFile";
const app = getApp();
Page({
  data: {
    navbarData: {
      title: "招标文件详情"
    },
    items: [
      {
        title:"详细信息",
      },{
        title:"审批记录",
      },{
        title:"流程图",
      }
    ],
    requestType: null,
    current: 0,
    detailInfo: {},
    tenderId: null,
    examineId: null,
    approvalType: null,
    deleteId: null,
    isCurrentAudit: false,
    dingTalkFormList: [],
    currentAccount: null,
    imageUrl: ''
  },
  tenderDocumentRef: null,
  otherDocumentRef: null,
  uploadImageList: null,
  
  onLoad(options) {
    this.setData({
      currentAccount: app.globalData.userInfo.userAccount
    })
    if(options.examineId){//审批
      this.setData({
        examineId: options.examineId,
        approvalType: options.approvalType
      })
    }
    if(options.requestType){//我的请求
      this.setData({
        requestType: options.requestType
      })
    }
    if(options.id){
      this.setData({
        tenderId: options.id,
        deleteId: options.deleteId
      })
      // this.getDetail(options.id)
    }
    console.log(options.account);
    if(options.account){
      let userAccount = app.globalData.userInfo.userAccount
      let list = JSON.parse(options.account)
      list.forEach(e => {
        if(e === userAccount){
          this.setData({
            isCurrentAudit: true
          })
        }
      })
      console.log(this.data.isCurrentAudit)
    }
  },
  onShow(){
    this.getDetail(this.data.tenderId)
  },
  onSaveTenderDocumentRef(ref){
    this.tenderDocumentRef = ref
  },
  onSaveOtherDocumentRef(ref){
    this.otherDocumentRef = ref
  },
  onSaveBasisDocumentRef(ref){
    this.basisDocumentRef = ref
  },
  bindApprovalOperateTap(data){
    console.log(data)
    this.getDetail(this.data.tenderId)
  },
  onNavTabChange(e){
    this.setData({
      current: e
    })
    if(e == 2){
      this.getImage()
    }
  },
  getDetail(tenderId){
    request.doPostRequest({
      url: projectService.API_TENDER_DETAIL,
      data: {id: tenderId},
      success: res => {
        console.log(res.data)
        this.setData({
          detailInfo: res.data
        })
        let dingTalkFormList = [
          { key:'事项类型：', value:'招标文件会签' },
          { key:'所属项目：', value: res.data.projectName },
          { key:'合同名称：', value: res.data.tenderName },
          { key:'招标标的额：', value: res.data.tenderAmount+'万元' }
        ]
        this.setData({
          dingTalkFormList
        })
        if(res.data.tenderDocumentList){
          res.data.tenderDocumentList.forEach(e => {
            e.name = e.fileName
          })
        }
        if(res.data.otherDocumentList){
          res.data.otherDocumentList.forEach(e => {
            e.name = e.fileName
          })
        }
        setTimeout(() => {
          this.tenderDocumentRef._setImageList(res.data.tenderDocumentList?res.data.tenderDocumentList:[]) 
          this.otherDocumentRef._setImageList(res.data.otherDocumentList?res.data.otherDocumentList:[]) 
          this.basisDocumentRef._setImageList(res.data.decisionBasisFileList?res.data.decisionBasisFileList:[])
        }, 0);
      }
    })
  },
  //删除
  deletThis(){
    ddUtils.showModal({
      title:'确认删除所选数据？',
      content: "删除后不可恢复，请确认",
      success: res => {
        if (res.confirm) {
          request.doPostRequest({
            url: messageServer.API_REQUEST_DELETE,
            data: {ids: [this.data.deleteId]},
            success: res => {
              console.log(res.data)
              ddUtils.showToast({
                title: "删除成功！"
              });
              ddUtils.navigateBack();
            }
          })
        }
      }
    });
  },
  //编辑
  editThis(){
    ddUtils.navigateTo({
      url: `/pages/work/page/bidDocumentCreatAndEdit/bidDocumentCreatAndEdit?id=${this.data.tenderId}`
    });
  },
  //撤回申请
  withdrawApplication(){
    ddUtils.showModal({
      content: "确认撤回申请吗?",
      success: res => {
        if (res.confirm) {
          request.doPostRequest({
            url: workService.API_JFLOWAUDIT_SELET_INFO,
            data: {keyId: this.data.tenderId},
            success: res => {
              console.log(res.data)
              let params = {
                account: res.data.account,
                no: res.data.jflowNo,
                workId: res.data.jflowWorkid
              }
              request.doPostRequest({
                url: workService.API_AUDIT_WITHDRAW,
                data: params,
                success: res => {
                  console.log(res.data)
                  ddUtils.showToast({
                    title: "操作成功"
                  });
                  ddUtils.navigateBack();
                }
              })
            }
          })
        }
      }
    });
  },
  //打印
  printThis(){
    ddUtils.showToast({
      title: '暂不支持打印！'
    })
  },
  downloadFile(e){
    let {url} = e.currentTarget.dataset
    ddFile.downloadFile(url)
  },
  async getImage() {
    request.doPostRequest({
      url: config.API_JFLOW_IMAGE,
      data: {templateDict: 'tender_jflow_img'},
      success: res => {
        this.setData({
          imageUrl: config.API_IMG_URL2+res.data.url
        })
      }
    })
  }
});
