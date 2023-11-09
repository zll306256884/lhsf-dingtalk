import projectService from "../../../../server/workServer/projectServer";
import request from "../../../../utils/request"
import workService from "../../../../server/workServer";
import ddUtils from "../../../../utils/ddUtils"

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
      title: "合同签订详情"
    },
    requestType: null,
    contractId: null
  },
  uploadContractImage: null,
  onLoad(options) {
    if(options.requestType){
      this.setData({
        requestType: options.requestType
      })
    }
    if(options.id){
      this.setData({
        contractId: options.id
      })
      this.getDetail(options.id)
    }
  },
  onSaveUploadContractImgRef(ref){
    this.uploadContractImage = ref
  },
  numberToChinese(num) {
    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const chineseUnits = ['', '十', '百', '千']
    if (num === 0) {
      return chineseNums[0]
    }
    let chineseStr = ''
    let unitIndex = 0
    while (num > 0) {
      const digit = num % 10
      if (digit !== 0) {
        // 处理非零数字
        chineseStr = chineseNums[digit] + chineseUnits[unitIndex] + chineseStr
      } else if (chineseStr.charAt(0) !== chineseNums[0]) {
        // 处理连续的零，只保留一个零
        chineseStr = chineseNums[0] + chineseStr
      }
      num = Math.floor(num / 10)
      unitIndex++
    }
    return chineseStr
  },
  getDetail(tenderId){
    request.doPostRequest({
      url: projectService.API_CONTRACT_DETAIL,
      data: {id: tenderId},
      success: res => {
        console.log(res.data)
        let list = res.data.contractThirdPartyRepList
        if(list){
          list.forEach((e, index)=> {
            e.thirdPartyType = e.thirdPartyType.toString()
            e.label1 = '第' + this.numberToChinese(index + 3) + '方:'
            e.label2 = '第' + this.numberToChinese(index + 3) + '方服务类型:'
          });
        }
        this.setData({
          detailInfo: res.data,
          list
        })
        setTimeout(() => {
          this.uploadContractImage._setImageList(res.data.fileList?res.data.fileList:'') 
        }, 0);
      }
    })
  },
  //删除
  deletThis(){
    
  },
  //编辑
  editThis(){
    ddUtils.navigateTo({
      url: `/pages/work/page/contractApprovalCreatAndEdit/contractApprovalCreatAndEdit?id=${this.data.contractId}`
    });
  },
  //撤回申请
  withdrawApplication(){
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
  
});
