// import utils from "../../../../utils/utils";
// import ddUtils from "../../../../utils/ddUtils";
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
import workService from "../../../../server/workServer";

const app = getApp();

Component({
  mixins: [],
  data: {
    showDialog: false,
    isApprovalAgree: true,
    paramsData: {},
    isLoading: false
  },
  props: {
    examineId: '',
    keyId:'', //审批需要用的keyId
    // onApprovalOperate: function (reason, isAgree) { },
    specialUserIds: ''
  },
  uploadApproval: null,
  didMount() {
    
  },
  didUpdate() {},
  didUnmount() {},
  
  methods: {
    onSaveUploadApprovalRef(ref){
      console.log(ref);
      this.uploadApproval = ref
    },
    //暂存待办
    bindStagingToDo(){
      console.log(this.props.examineId)
      console.log('暂存待办')
      request.doPostRequest({
        url: workService.API_Audit_UPDATE,
        data: {isRead: 0, id: this.props.examineId},
        success: res => {
          console.log(res.data)
          ddUtils.showToast({
            title: "暂存待办成功"
          });
          ddUtils.navigateBack();
        }
      })
    },
    //驳回
    bindRefuseTap: function (e) {
      console.log('驳回')
      this.showSureDialog(false);
    },
    //通过
    bindAgreeTap: function (e) {
      console.log('通过')
      this.showSureDialog(true);
    },

    // saveDialogApprovalManageSure: function (ref) {
    //   console.log(ref)
    //     this.dialogApprovalManageSure = ref;
    // },

    //show sure dialog
    showSureDialog: function (isArrovalAgree) {
        // if (!this.dialogApprovalManageSure) return;

        this._showDialog(isArrovalAgree);
    },

    // bindApprovalOperateTap: function (reason, isArrovalAgree) {
    //   console.log(reason, isArrovalAgree )
    //     if (ddUtils.showEmptyToastTips(reason, "请输入审批意见")) return;
        
    // },
    _bindTouchMove: function (e) { },

    //取消
    _bindCancelTap: function (e) {
        this._hideDialog();
    },

    //提交
    async _bindFormSunmit(e) {
      this.setData({
        isLoading: true
      })
      let reason = e.detail.value.reason;
      console.log(reason, this.data.isApprovalAgree)
      // if (ddUtils.showEmptyToastTips(reason, "请输入审批意见")) return;
      // this.props.onApprovalOperate(reason, this.data.isApprovalAgree);
      let workAuditFile = [];
      if (this.uploadApproval) {
        workAuditFile = this.uploadApproval._getUploadImgId().imgList;
      }
      console.log(workAuditFile);
      let debounce = null;
      if(debounce){
        clearTimeout(debounce);
      }
      await this.getDetail()
      debounce = setTimeout(() => {
        let params = this.data.paramsData
        params.content = reason
        params.annexesUrl = JSON.stringify(workAuditFile)
        if (this.props.specialUserIds) {
          params.auditUserIdList = this.props.specialUserIds.split(',')
        }
        console.log(params);
        if(this.data.isApprovalAgree){
          request.doPostRequest({
            url: workService.API_JFLOW_ADOPTAUDIT,
            data: params,
            success: res => {
              console.log(res.data)
              if(res.data === 1){
                ddUtils.showToast({
                  title: '下一节点未配置审批人员，已发送消息至系统管理员，请在配置审批人员后进行审批'
                })
                this.setData({
                  isLoading: false
                })
              }else{
                ddUtils.showToast({
                  title: "通过成功"
                });
                this.setData({
                  isLoading: false
                })
                ddUtils.navigateBack();
              }
            },
            fail:res => {
              this.setData({
                isLoading: false
              })
            }
          })
        }else{
          request.doPostRequest({
            url: workService.API_JFLOW_REFUSEAUDIT,
            data: params,
            success: res => {
              console.log(res.data)
              ddUtils.showToast({
                title: "拒绝成功"
              });
              this.setData({
                isLoading: false
              })
              ddUtils.navigateBack();
            },
            fail:res => {
              this.setData({
                isLoading: false
              })
            }
          })
        }
      }, 10000);
      
    },
    getDetail(){
      request.doPostRequest({
        url: workService.API_SELECT_DETAIL,
        data: {id: this.props.examineId},
        success: res => {
          console.log(res.data)
          let form = {}
          form.auditUserId = app.globalData.userInfo.userId
          form.auditUserName = app.globalData.userInfo.nickName
          form.auditAccount = app.globalData.userInfo.userAccount
          form.account = res.data.account
          form.jflowNo = res.data.jflowNo
          form.jflowWorkid = res.data.jflowWorkid
          form.nodeId = res.data.nodeId
          form.keyId = res.data.keyId
          form.vueUrl = res.data.vueUrl
          form.urlParameter = res.data.urlParameter
          form.projectId = res.data.projectId
          form.projectName = res.data.projectName
          form.singleUrl = res.data.singleUrl
          this.setData({
            paramsData: form
          })
          console.log(this.data.paramsData);
        }
      })
    },
    //judge is show dialog
    _isShowDialog() {
        return this.data.showDialog;
    },

    //show modal dialog
    _showDialog: function (isApprovalAgree) {
        if (this._isShowDialog())
            return

        this.setData({
            showDialog: true,
            isApprovalAgree
        })
    },

    //hide modal dialog
    _hideDialog: function (e) {
        if (!this._isShowDialog())
            return;

        this.setData({
            showDialog: false,
        })
    },
  },
});
