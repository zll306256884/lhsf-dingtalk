// import utils from "../../../../utils/utils";
// import ddUtils from "../../../../utils/ddUtils";
Component({
  mixins: [],
  data: {
    showDialog: false,
    isApprovalAgree: true
  },
  props: {
    keyId:'' //审批需要用的keyId
    // onApprovalOperate: function (reason, isAgree) { },
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    //暂存待办
    bindStagingToDo(){
      console.log(this.props.keyId)
      console.log('暂存待办')
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
    _bindFormSunmit: function (e) {
        let reason = e.detail.value.reason;
        console.log(reason, this.data.isApprovalAgree)
        if (ddUtils.showEmptyToastTips(reason, "请输入审批意见")) return;
        // this.props.onApprovalOperate(reason, this.data.isApprovalAgree);
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
