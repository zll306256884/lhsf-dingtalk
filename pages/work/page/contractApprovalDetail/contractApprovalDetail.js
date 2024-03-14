import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"
import workService from "../../../../server/workServer";
import ddUtils from "../../../../utils/ddUtils"
import messageServer from "../../../../server/messageServer"
import config from "../../../../utils/config";
import ddFile from "../../../../utils/ddFile";
const app = getApp();
Page({
  data: {
    items: [
      {
        title:"详细信息",
      },{
        title:"审批记录",
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
  },
  uploadContractImage: null,
  uploadImgRefList:null,
  onLoad(options) {
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
  },
  bindApprovalOperateTap(data){
    console.log(data)
    this.getDetail(this.data.contractId)
  },
  onNavTabChange(e){
    console.log(e);
    this.setData({
      current: e
    })
  },
  onSaveUploadImgRef: function (ref) {
    this.uploadImgRefList = ref;
    console.log(this.uploadImgRefList)
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
            e.thirdPartyType = e.thirdPartyType.toString()
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
        this.setData({
          dingTalkFormList
        })
        if(res.data.fileList){
          res.data.fileList.forEach(e => {
            e.name = e.fileName
          })
        }
        setTimeout(() => {
          this.uploadImgRefList._setImageList(res.data.fileList?res.data.fileList:'') 
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
  }
});
