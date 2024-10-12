import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import workService from "../../../../server/workServer";
import ddUtils from "../../../../utils/ddUtils"
const app = getApp();
Page({
  data: {
    navbarData: {
      title: "支付申请详情",
    },
    items: [
      {
        title: "详细信息",
      }, {
        title: "审批记录",
      }
    ],
    id:"",
    keyId:'',
    examineId:'',
    type:'',
    status:"",
    projectId:'',
    userId:'',
    showType:"",
    current: 0,
    infoData: {},
    isCurrentAudit: false,
    dingTalkFormList: [],
    accumulatedPaymentAmount: 0,
    supplementaryAgreement: []
  },
  uploadContractImage: null,
  onLoad(option) {
    // if (option.id) {
      this.setData({
        examineId:option.examineId,
        id:option.id,
        type:option.type,
        keyId:option.keyId,
        status:option.status,
        projectId:option.projectId,
        showType:option.showType || ''
      })
      // this.getDetail(option.id)
    // }
    console.log(option.account);
    if(option.account){
      let userAccount = app.globalData.userInfo.userAccount
      let list = JSON.parse(option.account)
      list.forEach(e => {
        if(e === userAccount){
          this.setData({
            isCurrentAudit: true
          })
        }
      })
      console.log(this.data.isCurrentAudit)
    }
    this.setData({
      userId:app.globalData.userInfo.userId
    })
  },
  onSaveUploadContractImgRef(ref) {
    this.uploadContractImage = ref
  },
  onShow(){
    this.getDetail(this.data.id)
  },
  onSelectInfo(e) {
    let string=e.target.dataset.string
    switch (string) {
      case 'project':
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${this.data.infoData.projectId}`
        });
      break;
      case 'leader':
        ddUtils.navigateTo({
          url: `/pages/user/page/baseinfo/baseinfo?id=${this.data.infoData.projectLeaderId}`
        });
      break;
      case 'contract':
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${this.data.infoData.contractId}`
        }); 
      break;

    }
  },
  // 切换我的请求tab
  onQueryChange(e) {
    this.setData({
      current: e
    })

    switch (e) {
      case 0:
        this.getDetail(this.data.id)
        break;
      case 1:
        // this.getMessageList(1)
        break;
    }
  },
  bindApprovalOperateTap(){
    this.getDetail(this.data.id)
  },
  // // 打印事件
  // printTop(){
  //   ddUtils.showToast({
  //     title: '暂不支持打印！'
  //   })
  //   window.open(`http://192.168.6.41/prod-api/file/jasper/pdf/payment/${this.data.id}`)
  //   console.log(`http://192.168.6.41/prod-api/file/jasper/pdf/payment/${this.data.id}`);
  // },
  withdrawApplication() {
    request.doPostRequest({
      url: workService.API_JFLOWAUDIT_SELET_INFO,
      data: { keyId: this.data.id },
      success: res => {
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
  },
  getDetail(tenderId) {
    request.doPostRequest({
      url: confing.API_PAY_DETAIL_POST,
      data: { id: tenderId },
      success: res => {
        this.setData({
          infoData: {
            accumulatedPaymentAmount:Number(res.data.payAmount) + Number(res.data.cumulativePayment),
            ...res.data
          }
        }) 
        // 获取补充协议
        request.doPostRequest({
          url: confing.API_SELECT_SUPPLEMENTAL_AGREEMENT,
          data: {
            contractId: res.data.contractId,
          },
          success: res2 => {
            this.data.supplementaryAgreement = res2.data
            this.setData({
              supplementaryAgreement:res2.data
            })
          }
        })
        let dingTalkFormList = [
          { key:'事项类型：', value: '款项支付' },
          { key:'所属项目：', value: res.data.projectName },
          { key:'合同名称：', value: res.data.contractName },
          { key:'支付金额：', value: res.data.payAmount + '万元' },
          { key:'收款单位：', value: res.data.receiverUnit }
        ]
        this.setData({
          dingTalkFormList
        })
        const files= res.data.investmentFileList.map((item)=>{
          return {
            ...item,
            name:item.fileName,
          }
        })
        setTimeout(() => {
          this.uploadContractImage._setImageList(files) 
        }, 0);
        // setTimeout(() => {
        //   this.uploadContractImage._setImageList(res.data.investmentFileList ? res.data.investmentFileList : '')
        // }, 0);
      }
    })
  },
  // 删除
  bindCancelTap(){
    ddUtils.showModal({
      content: "确认删除吗?",
      success: res => {
        if (res.confirm) {
          request.doPostRequest({
            url: confing.API_DELETE_POST,
            data: { ids: [this.data.keyId] },
            success: (res) => {
              if(res.message==="成功"){
                ddUtils.showToast({
                  title: "操作成功"
                })
              }
              // let pages = getCurrentPages(); //获取加载的页面
              // let page = pages[pages.length - 2];
              // page.rightFrPage._getRecordList()
              setTimeout(()=>{
              ddUtils.navigateBack()
              },1000)
            }
          })
        }
      }
    });
  },
  editTap:function(){
    ddUtils.navigateTo({
      url: `/pages/work/page/addPayment/addPayment??id=${this.data.id}&sort=${1}`
    }); 
  }
});
