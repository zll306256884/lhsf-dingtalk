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
    showType:"",
    current: 0,
    infoData: {},
    isCurrentAudit: false,
    dingTalkFormList: [],
  },
  uploadContractImage: null,
  onLoad(option) {
    console.log(option,111111111);
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
      this.getDetail(option.id)
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
  },
  onSaveUploadContractImgRef(ref) {
    this.uploadContractImage = ref
  },
  onShow(){
    this.getDetail(this.data.id)
  },
  // 切换我的请求tab
  onQueryChange(e) {
    console.log(e);
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
  },
  getDetail(tenderId) {
    request.doPostRequest({
      url: confing.API_PAY_DETAIL_POST,
      data: { id: tenderId },
      success: res => {
        console.log(res.data)
        this.setData({
          infoData: res.data
        })
        let dingTalkFormList = [
          { '事项类型': '款项支付' },
        { '所属项目': res.data.projectName },
        { '合同名称': res.data.contractName },
        { '支付金额': res.data.payAmount + '万元' },
        { '收款单位': res.data.receiverUnit }
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
