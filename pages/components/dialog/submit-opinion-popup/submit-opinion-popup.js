// import utils from "../../../../utils/utils";
// import ddUtils from "../../../../utils/ddUtils";
import request from "../../../../utils/request"
import ddUtils from "../../../../utils/ddUtils"
import workService from "../../../../server/workServer";
// import { Form } from 'antd-mini/es/Form/form';

const app = getApp();

Component({
  mixins: [],
  // form: new Form(),
  data: {
    showDialog: false,
    isApprovalAgree: true,
    paramsData: {},
    isLoading: false,
    showMore: false,
    showTransmit: false, // 弹窗展示
    isTransmit: true, // 转发/附言
    isTransmitLoading: false,
    chooseUser: '',
    alreadyCheckedUser: [],
  },
  props: {
    examineId: '',
    keyId:'', //审批需要用的keyId
    onApprovalOperate: function (reason, isAgree) { },
    specialUserIds: '',
    dingTalkFormList: [],
    departmentManager: '',
    moduleName: '',
    recipient: true, // 展示接收人
    transmit: null // 是否转发
  },
  uploadApproval: null,
  uploadImageList: null,
  dialogScreenDepartmentManager: null,
  didMount() {
  },
  didUpdate() {},
  didUnmount() {},
  attached: function() {
    // 在组件实例进入页面节点树时执行
  },
  methods: {
    // handleRef(ref) {
    //   this.form.addItem(ref);
    // },
    onSaveUploadApprovalRef(ref){
      console.log('文件上传：',ref);
      this.uploadApproval = ref
    },
    onSaveUploadFileRef: function (ref) {
      this.uploadImageList = ref;
      console.log('附件上传', ref)
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
        let pages = getCurrentPages();
        let page = pages[pages.length - 2];
          if(page){
            ddUtils.navigateBack();
          }else{
             ddUtils.redirectTo({
              url: `/pages/message/page/approval/approval?currentApproval=1`
            });
          }
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
        params.dingTalkFormList = this.props.dingTalkFormList
        //todo待完成
        if(this.props.moduleName === 'investment-jungong'){
          //1级项目负责人 2级技术部经办人 3.三级技术部前期负责人 4.项目分管领导(传下一级审批人)
          if(params.progressStatus === 1){
            if (this.props.departmentManager) {
              params.auditUserIdList = this.props.departmentManager.split(',')
            }
          }
          if(params.progressStatus === 2){
            params.auditUserIdList = []
          }
          if(params.progressStatus === 3){
            if (this.props.specialUserIds) {
              params.auditUserIdList = this.props.specialUserIds.split(',')
            }
          }
        }else{
          if (this.props.specialUserIds) {
            params.auditUserIdList = this.props.specialUserIds.split(',')
          }
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
                 this.props.onApprovalOperate(true);
                this.setData({
                  isLoading: false
                })
                this._hideDialog();
                let pages = getCurrentPages();
                let page = pages[pages.length - 2];
                  if(page){
                    ddUtils.navigateBack();
                  }else{
                     ddUtils.redirectTo({
                      url: `/pages/message/page/approval/approval?currentApproval=1`
                    });
                  }
              }
            },
            fail:res => {
              this.setData({
                isLoading: false
              })
              // ddUtils.navigateBack();
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
              this.props.onApprovalOperate(true);
              this.setData({
                isLoading: false
              })
              this._hideDialog();
              let pages = getCurrentPages();
              let page = pages[pages.length - 2];
              if(page){
                ddUtils.navigateBack();
              }else{
              ddUtils.redirectTo({
               url: `/pages/message/page/approval/approval?currentApproval=1`
              });
             }
            },
            fail:res => {
              this.setData({
                isLoading: false
              })
              let pages = getCurrentPages();
              let page = pages[pages.length - 2];
                if(page){
                  ddUtils.navigateBack();
                }else{
                   ddUtils.redirectTo({
                    url: `/pages/message/page/approval/approval?currentApproval=1`
                  });
                }
            }
          })
        }
      }, 1000);
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
          form.pcUrl = res.data.pcUrl
          form.progressStatus = res.data.currentFlowNode.approveProgressStatus
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

    // 
    showMoreButton: function () {
        this.setData({
            showMore: true
        })
    },
    handleTransmit: function () {
      this.setData({
          showTransmit: true
      })
    },
    handleCancel: function () {
      this.setData({
          showTransmit: false
      })
    },
    handleTransmitConfirm: function (e) {
      console.log('提交：', e, this.props.recipient);
      // 附言
      let remark = e.detail.value.remark;
      // 转发
      if (this.props.recipient) {
        // 接收人
        if(!this.data.chooseUser || !this.data.alreadyCheckedUser.length) {
          ddUtils.showToast({title: '请选择接收人！'})
          return
        }
        let params = {
          auditRecordId: this.props.examineId,
          receiverUserList: this.data.alreadyCheckedUser,
          remark: remark
        }
        request.doPostRequest({
          url: workService.API_JFLOW_FORWARD,
          data: params,
          success: res => {
            console.log('转发：',res)
            ddUtils.showToast({title: '操作成功！'})
            this.setData({
              showTransmit: false,
              showMore: false
            })
          }
        })
      } else {
        // 文件
        let annexesUrl = [];
        if (this.uploadImageList) {
          annexesUrl = this.uploadImageList._getUploadImgId().imgList;
        }
        let params = {
          forwardAuditRecordId: this.props.examineId,
          content: remark,
          annexesUrl: JSON.stringify(annexesUrl)
        }
        request.doPostRequest({
          url: workService.API_JFLOW_POSTSCRIPT,
          data: params,
          success: res => {
            console.log('附言：',res)
            ddUtils.showToast({title: '操作成功！'})
            this.setData({
              showTransmit: false,
              showMore: false
            })
          }
        })
      }
      
    },
    onSaveDialogScreenDepartmentManagerRef(ref){
      this.dialogScreenDepartmentManager = ref
    },
    bindScreenDepartmentManagerCallBack(data){
      console.log('人员data:', data);
      // this.form.setFieldValue('people', data.map(e => e.username).join(','));
      this.setData({
        chooseUser: data && data.map(e => e.username).join(','),
        alreadyCheckedUser: data && data.map(e => {
          return { userId: e.userId, username: e.username };
        })
      });
    },
    chooseManager(){
      if(this.dialogScreenDepartmentManager) this.dialogScreenDepartmentManager._showDialog(this.data.alreadyCheckedUser)
    },
  },
});
