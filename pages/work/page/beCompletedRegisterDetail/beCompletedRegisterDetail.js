import confing from "../../../../server/workServer/addInvestment"
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
import workService from "../../../../server/workServer";
import config from "/utils/config";
Page({
  data: {
    navbarData: {
      title: "竣工结算登记",
    },
    infoData:{},
    id:'',
    keyId:'',
    examineId: '',
    approvalType: null,
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
    dingTalkFormList: [],
    imageUrl:'',
    recipient: true, // 展示接收人
    transmit: null, // 是否转发
    userLists: []
  },
  uploadContractImage: null,
  onLoad(option) {
    this.setData({
      transmit: option.transmit,
      recipient: option.forwardType == '2' ? false : true
    })
    if(option.id){
      // this.getDetail(option.id)
      this.setData({
        id:option.id,
        keyId:option.keyId
      })
    }
    if(option.examineId){//审批
      this.setData({
        examineId: option.examineId,
        approvalType: option.approvalType
      })
    }
  },
  onNavTabChange(e){
    this.setData({
      current: e
    })
    if(e == 2){
      this.getImage()
    }
  },
  onSaveUploadContractImgRef(ref){
    this.uploadContractImage = ref
  },
  onShow(){
    this.getDetail(this.data.id)
  },
  getDetail(tenderId){
    request.doPostRequest({
      url: confing.API_BE_DETAIL_POST ,
      data: {id: tenderId},
      success: res => {
        console.log(res.data)
        let userList = res.data.jflowAuditUser?JSON.parse(res.data.jflowAuditUser):{}
        const arr = Object.entries(userList).map(([key,value])=>{return {label:key,value:value }})
        this.setData({
          infoData: res.data,
          userLists: arr
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

        let dingTalkFormList = [
          { key:'事项类型：', value:'竣工结算会签' },
          { key:'所属项目：', value: res.data.projectName },
          { key:'合同名称：', value: res.data.contractName },
          { key:'审定总价：', value: res.data.approveTotalPrice+'万元' }
        ]
        this.setData({
          dingTalkFormList
        })
        // setTimeout(() => {
        //   this.uploadContractImage._setImageList(res.data.investmentFileList?res.data.investmentFileList:'') 
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
              setTimeout(()=>{
              ddUtils.navigateBack()
              },500)
            }
          })
        }
      }
    });
  },
  onSelectInfo(e) {
    console.log('触发',e);
    let string=e.target.dataset.value
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
  editTap:function(){
    ddUtils.navigateTo({
      url: `/pages/work/page/beCompletedRegister/beCompletedRegister??id=${this.data.id}&sort=${1}`
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
            data: {keyId: this.data.id},
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
  async getImage() {
    request.doPostRequest({
      url: config.API_JFLOW_IMAGE,
      data: {templateDict: 'completed_jflow_img '},
      success: res => {
        this.setData({
          imageUrl: config.API_IMG_URL2+res.data.url
        })
      }
    })
  }
});
