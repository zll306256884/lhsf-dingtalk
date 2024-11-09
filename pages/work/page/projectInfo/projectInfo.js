import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import config from "../../../../utils/config"
import projectService from "../../../../server/workServer/projectServer";
import workService from "../../../../server/workServer";
import messageServer from "../../../../server/messageServer"
import approvalServer from "../../../../server/approvalServer/approvalServer"
const app = getApp();
Page({
  data: {
    navbarData:{
      title: "项目详情"
    },
    items: [
      {
        title:"详细信息",
      },{
        title:"审批记录",
      }
    ],
    current: 0,
    screenFromList:[
      { name:'否',value:0 },
      { name:'是',value:1 }
    ],
    isOutPutOption: [
      { name:'否',value:'0' },
      { name:'是',value:'1' },
    ],
    formData:{},
    sourceListName:'',
    isAccess: {},//考核
    projectClassification: {},//分类
    constructionPhase: {},//建设阶段
    isOutPut: {},//是否投入
    outPutTime: {},//{date: '', shortDate: ''}
    constructionNature: {},//建设性质
    engineeringProperties: {},//工程性质
    //所属单位
    //项目负责人
    uploadImgRefList: null,//项目红线图
    projectId: null,
    requestType: null,
    approvalType: null,
    isCurrentAudit: false,
    dingTalkFormList: [],
    deleteId: null,
    examineId: null,
    currentAccount: null,
    // recipient: true, // 展示接收人
    // transmit: null, // 是否转发
    isCurrentApprover: false, // 接口查询是否为当前审批人
    forwardType: null, // 是否转发
    showType: null, // 1-待办审批 2-已办审批 3-办结审批
  },
  onNavTabChange(e){
    this.setData({
      current: e
    })
  },
  onSaveUploadImgRef: function (ref) {
    this.uploadImgRefList = ref;
    console.log(this.uploadImgRefList)
  },
  onLoad(options) {
    console.log('详情页面参数：', options);
    this.setData({
      currentAccount: app.globalData.userInfo.userId,
      // transmit: options.transmit,
      // recipient: options.forwardType == '2' ? false : true,
      forwardType: options.forwardType,
      showType: options.showType,
    })
    if(options.examineId){//审批
      this.setData({
        examineId: options.examineId,
        approvalType: options.approvalType
      })
    }
    if(options.requestType){
      //我的请求
      this.setData({
        requestType: options.requestType
      })
    }
    if(options.id){
      this.setData({
        projectId: options.id,
        deleteId: options.deleteId
      })
    }
  },
  onShow(){
    this.getDetail(this.data.projectId)
    this.getCurrent()
  },
  //查询当前审批人
  getCurrent(){
    request.doPostRequest({
      url: approvalServer.API_NEXT_APPROVAL_NODE,
      data: {keyId: this.data.projectId},
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
    let string=e.target.dataset.value
    switch (string) {
      case 'project':
        ddUtils.navigateTo({
          url: `/pages/work/page/projectInfo/projectInfo?id=${this.data.formData.id}`
        });
      break;
      case 'projectLeader':
      case 'carryLeader':
      case 'operateLeader':
        let userId=string=='projectLeader'?this.data.formData.personId:string=='carryLeader'?this.data.formData.carryPersonId:this.data.formData.operatePersonId
        ddUtils.navigateTo({
          url: `/pages/user/page/baseinfo/baseinfo?id=${userId}`
        });
      break;
      case 'contract':
        ddUtils.navigateTo({
          url: `/pages/work/page/contractApprovalDetail/contractApprovalDetail?id=${this.data.formData.contractId}`
        }); 
      break;

    }
  },
  getDetail(id){
    request.doPostRequest({
      url: projectService.API_SELECTPROJECT_INFO_BYID,
      data:{id:id},
      success: res => {
        if(res.data.isAccess=== 0 || res.data.isAccess=== 1){
          this.setData({
            isAccess:{name:this.data.screenFromList.find(e=>e.value === res.data.isAccess).name,value:res.data.isAccess}
          })
        }
        if(res.data.isOutPut){
          this.setData({
            isOutPut:{name:this.data.isOutPutOption.find(e=>e.value === res.data.isOutPut).name,value:res.data.isOutPut}
          })
        }
        this.setData({
          formData: res.data,
          sourceListName:res.data.projectSourceConfigTreeRepList.map(item=>item.name).join(","),
          projectClassification:{name:res.data.projectClassification_dictText,value:res.data.projectClassification},
          constructionPhase:{name:res.data.constructionPhase_dictText,value:res.data.constructionPhase},
          outPutTime:{shortDate:res.data.outPutTime},
          constructionNature:{name:res.data.constructionNature_dictText,value:res.data.constructionNature},
          engineeringProperties:{name:res.data.engineeringProperties_dictText,value:res.data.engineeringProperties},
        })
        setTimeout(() => {
          this.uploadImgRefList._setImageList(res.data.projectRedLineList?res.data.projectRedLineList:'') 
        }, 0);

        let dingTalkFormList = [
          { key:'事项类型：', value:'新增项目' },
          { key:'项目名称：', value: res.data.name },
          { key:'总投资金额：', value: res.data.totalInvestment+'万元' },
          // { key:'招标标的额：', value: res.data.tenderAmount+'万元' }
        ]
        this.setData({
          dingTalkFormList
        })
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
      url: `/pages/work/page/addNewProject/addNewProject?id=${this.data.projectId}`
    });
  },
  bindApprovalOperateTap(data){
    console.log(data)
    this.getDetail(this.data.projectId)
  },
  //撤回申请
  withdrawApplication(){
    ddUtils.showModal({
      content: "确认撤回申请吗?",
      success: res => {
        if (res.confirm) {
          request.doPostRequest({
            url: workService.API_JFLOWAUDIT_SELET_INFO,
            data: {keyId: this.data.projectId},
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
});
