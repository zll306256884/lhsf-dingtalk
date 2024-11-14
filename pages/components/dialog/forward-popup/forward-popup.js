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
    showTransmit: false, // 弹窗展示
    isTransmitLoading: false,
    chooseUser: '',
    alreadyCheckedUser: [],
    isNopostscripted: true, // 默认没附言过
  },
  props: {
    examineId: '',
    isCurrentApprover: false, // 是否为当前审批人
    forwardType: null, // 是否转发 2 转发标识 显示附言按钮
    showType: null, // 1-待办审批 2-已办审批 3-办结审批
    forwardAuditRecordId: '', // 附言id, 查询是否附言过
    // recipient: true, // 展示接收人
    // transmit: null // 是否转发
  },
  uploadImageList: null,
  dialogScreenDepartmentManager: null,
  didMount() {
  },
  didUpdate() { },
  didUnmount() { },
  attached: function () {
    // 在组件实例进入页面节点树时执行
  },
  methods: {
    // handleRef(ref) {
    //   this.form.addItem(ref);
    // },
    onSaveUploadFileRef: function (ref) {
      this.uploadImageList = ref;
      console.log('附件上传', ref)
    },
    _bindTouchMove: function (e) { },

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
      // 附言
      let remark = e.detail.value.remark;
      if (this.props.forwardType == '2') { // 附言
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
            console.log('附言：', res)
            ddUtils.showToast({ title: '操作成功！' })
            this.setData({
              showTransmit: false,
            })
            // this.triggerEvent('updateJudge', { message: '更新附言判断' });
            // if(this.props.forwardAuditRecordId) { // 从消息来的，附言之后再次调接口查询附言状态，从而防止多次附言
            //   this.getPostscript()
            // }
            // ddUtils.navigateBack();
            let pages = getCurrentPages();
            let page = pages[pages.length - 2];
            if (page) {
              ddUtils.navigateBack();
            } else {
              ddUtils.redirectTo({
                url: `/pages/message/page/approval/approval?currentApproval=1`
              });
            }
          },
          fail: res => {
            this.setData({
              showTransmit: false,
            })
            let pages = getCurrentPages();
            let page = pages[pages.length - 2];
            if (page) {
              ddUtils.navigateBack();
            } else {
              ddUtils.redirectTo({
                url: `/pages/message/page/approval/approval?currentApproval=1`
              });
            }
          }
        })
      } else { // 转发
        // 接收人
        if (!this.data.chooseUser || !this.data.alreadyCheckedUser.length) {
          ddUtils.showToast({ title: '请选择接收人！' })
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
            console.log('转发：', res)
            ddUtils.showToast({ title: '操作成功！' })
            this.setData({
              showTransmit: false,
            })
          },
          fail: res => {
            this.setData({
              showTransmit: false,
            })
          }
        })
      }
    },
    onSaveDialogScreenDepartmentManagerRef(ref) {
      this.dialogScreenDepartmentManager = ref
    },
    bindScreenDepartmentManagerCallBack(data) {
      console.log('人员data:', data);
      // this.form.setFieldValue('people', data.map(e => e.username).join(','));
      this.setData({
        chooseUser: data && data.map(e => e.username).join(','),
        alreadyCheckedUser: data && data.map(e => {
          return { userId: e.userId, username: e.username };
        })
      });
    },
    chooseManager() {
      if (this.dialogScreenDepartmentManager) this.dialogScreenDepartmentManager._showDialog(this.data.alreadyCheckedUser)
    },
    // 查询是否附言过
    getPostscript() {
      request.doPostRequest({
        url: workService.API_IS_POSTSCRIPT,
        data: { forwardAuditRecordId: this.props.forwardAuditRecordId },
        success: res => {
          console.log('是否已附言-component：', res.data);
          if (res.data.status === 2) { // 2代表附言过 不能再展示附言按钮
            this.setData({
              isNopostscripted: false
            })
          } else {
            this.setData({
              isNopostscripted: true
            })
          }
        }
      })
    },
  },
});
