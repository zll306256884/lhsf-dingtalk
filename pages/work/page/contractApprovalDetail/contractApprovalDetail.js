import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"
import workService from "../../../../server/workServer";
import ddUtils from "../../../../utils/ddUtils"
import messageServer from "../../../../server/messageServer"
import config from "../../../../utils/config";
import ddFile from "../../../../utils/ddFile";
import approvalServer from "../../../../server/approvalServer/approvalServer"
const app = getApp();
Page({
  data: {
    items: [
      {
        title:"详细信息",
      },{
        title:"审批记录",
      },{
        title:"流程图",
      }
    ],
    current: 0,
    detailInfo: {},
    list: [],
    navbarData: {
      title: "合同详情"
    },
    requestType: null,
    contractId: null,
    examineId: null,
    approvalType: null,
    deleteId: null,
    supplementList: [],
    isCurrentAudit: false,
    dingTalkFormList: [],
    unitPartyModeOptions2: [
      // { value: '1', label: '政府单位(含市属企业)', text: '政府单位(含市属企业)'},
      { value: '2', label: '单位', text: '单位' },
      { value: '3', label: '个人', text:'个人' },
    ],
    currentAccount: null,
    imageUrl: '',
    // recipient: true, // 展示接收人
    // transmit: null, // 是否转发
    userLists:[],
    isCurrentApprover: false, // 接口查询是否为当前审批人
    forwardType: null, // 是否转发
    showType: null, // 1-待办审批 2-已办审批 3-办结审批
  },
  uploadContractImage: null,
  uploadImgRefList:null,
  uploadBasisImgRefList: null,

  onLoad(options) {
    this.setData({
      currentAccount: app.globalData.userInfo.userId,
      // transmit: options.transmit,
      // recipient: options.forwardType == '2' ? false : true,
      forwardType: options.forwardType,
      showType: options.showType,
    })
    if(options.examineId){
      this.setData({
        examineId: options.examineId,
        approvalType: options.approvalType
      })
    }
    if(options.requestType){
      this.setData({
        requestType: options.requestType
      })
    }
    if(options.id){
      this.setData({
        contractId: options.id,
        deleteId: options.deleteId
      })
      // this.getDetail(options.id)
    }
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
    this.getDetail(this.data.contractId)
    this.getMinContract()
    this.getCurrent()
  },
  //查询当前审批人
  getCurrent(){
    request.doPostRequest({
      url: approvalServer.API_NEXT_APPROVAL_NODE,
      data: {keyId: this.data.contractId},
      success: res => {
        console.log('当前审批人：：：',res.data)
        let currentAccount = app.globalData.userInfo.userAccount
        if(res.data.auditUserNameList && res.data.auditUserNameList.includes(currentAccount)){
          this.setData({
            isCurrentApprover: true
          })
        }else{
          this.setData({
            isCurrentApprover: false
          })
        }
      }
    })
  },
  onSelectInfo(e) {
    let string=e.target.dataset.string
    switch (string) {
      case 'project':
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${this.data.detailInfo.projectId}`
        });
      break;
      case 'leader':
        ddUtils.navigateTo({
          url: `/pages/user/page/baseinfo/baseinfo?id=${this.data.detailInfo.projectLeaderId}`
        });
      break;
      case 'contract':
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${this.data.detailInfo.contractId}`
        }); 
      case 'masterContract':
          ddUtils.navigateTo({
            url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${this.data.detailInfo.masterContract}`
      }); 
      break;

    }
  },
  bindApprovalOperateTap(data){
    console.log(data)
    // this.getDetail(this.data.contractId)
  },
  onNavTabChange(e){
    console.log(e);
    this.setData({
      current: e
    })
    if(e == 2){
      this.getImage()
    }
  },
  onSaveUploadImgRef: function (ref) {
    this.uploadImgRefList = ref;
    console.log(this.uploadImgRefList)
  },
  onSaveBasisUploadImgRef: function (ref) {
    this.uploadBasisImgRefList = ref;
  },
  // onSaveUploadContractImgRef(ref){
  //   this.uploadContractImage = ref
  // },
  numberToChinese(num) {
    // const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    // const chineseUnits = ['', '十', '百', '千']
    // if (num === 0) {
    //   return chineseNums[0]
    // }
    // let chineseStr = ''
    // let unitIndex = 0
    // while (num > 0) {
    //   const digit = num % 10
    //   if (digit !== 0) {
    //     // 处理非零数字
    //     chineseStr = chineseNums[digit] + chineseUnits[unitIndex] + chineseStr
    //   } else if (chineseStr.charAt(0) !== chineseNums[0]) {
    //     // 处理连续的零，只保留一个零
    //     chineseStr = chineseNums[0] + chineseStr
    //   }
    //   num = Math.floor(num / 10)
    //   unitIndex++
    // }
    // return chineseStr
    const arr = ['', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛']
    let chineseStr = ''
    chineseStr = arr[num]
    return chineseStr
  },
  getDetail(contractId){
    request.doPostRequest({
      url: projectService.API_CONTRACT_DETAIL,
      data: {id: contractId},
      success: res => {
        console.log(res.data)
        res.data.developmentOrganizationListName = res.data.developmentOrganizationList.map(e => e.developmentOrganizationName).join('、')
        let list = res.data.contractThirdPartyRepList
        if(list){
          list.forEach((e, index)=> {
            e.thirdPartyType = e.thirdPartyType?e.thirdPartyType.toString(): ''
            e.label1 = this.numberToChinese(index + 3) + '方单位:'
            e.label2 = this.numberToChinese(index + 3) + '方服务类型:'
          });
        }
        this.setData({
          detailInfo: res.data,
          list
        })
        let dingTalkFormList = [
          { key:'事项类型：', value: ['','新增合同流程','直接添加合同'][res.data.contractType] },
          { key:'所属项目：', value: res.data.projectName },
          { key:'合同名称：', value: res.data.contractName },
          { key:'合同金额：', value: res.data.contractAmount+'万元' }
        ]
        let userList = res.data.jflowAuditUser?JSON.parse(res.data.jflowAuditUser):{}
        const arr = Object.entries(userList).map(([key,value])=>{return {label:key,value:value }})
        this.setData({
          dingTalkFormList,
          userLists: arr.filter(item =>item.label !== "总经理" && item.label !=="董事长")
        })
        if(res.data.fileList){
          res.data.fileList.forEach(e => {
            e.name = e.fileName
          })
        }
        if(res.data.decisionBasisFileList){
          res.data.decisionBasisFileList.forEach(e => {
            e.name = e.fileName
          })
        }
        setTimeout(() => {
          this.uploadImgRefList._setImageList(res.data.fileList?res.data.fileList:[]) 
          this.uploadBasisImgRefList._setImageList(res.data.decisionBasisFileList?res.data.decisionBasisFileList:[]) 
        }, 0);
        // setTimeout(() => {
        //   this.uploadContractImage._setImageList(res.data.fileList?res.data.fileList:'') 
        // }, 0);
      }
    })
  },
  getMinContract(){
    request.doPostRequest({
      url: projectService.API_CONTRACT_PAGE,
      data: {masterContract: this.data.contractId,pageSize:999,pageNum:1},
      success: res => {
        console.log(res.data)
        if(res.data.records && res.data.records.length){
          let item = this.data.items
          if(item.length === 2){
            item.push({title:"补充协议"})
          }
          this.setData({
            items: item,
            supplementList: res.data.records
          })
        }else{
          let list = [{
            title:"详细信息",
          },{
            title:"审批记录",
          },{
            title:"流程图",
          }]
          this.setData({
            items: list,
            supplementList: []
          })
        }
        // this.setData({
        //   detailInfo: res.data,
        //   list
        // })
        // setTimeout(() => {
        //   this.uploadContractImage._setImageList(res.data.fileList?res.data.fileList:'') 
        // }, 0);
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
      url: `/pages/work/page/contractApprovalCreatAndEdit/contractApprovalCreatAndEdit?id=${this.data.contractId}`
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
            data: {keyId: this.data.contractId},
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
  toDetail(e){
    let {item} = e.currentTarget.dataset
    ddUtils.navigateTo({
      url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${item.id}`
    });
  },
  downloadFile(e){
    let {url} = e.currentTarget.dataset
    ddFile.downloadFile(url)
  },
  async getImage() {
    request.doPostRequest({
      url: config.API_JFLOW_IMAGE,
      data: {templateDict: this.data.detailInfo.contractType==1?'contract_audit_img' : 'contract_jflow_img'},
      success: res => {
        this.setData({
          imageUrl: config.API_IMG_URL2+res.data.url
        })
      }
    })
  }
});
