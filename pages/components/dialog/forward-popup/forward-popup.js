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
    isTransmit: true, // 转发/附言
    isTransmitLoading: false,
    chooseUser: '',
    alreadyCheckedUser: [],
  },
  props: {
    examineId: '',
    isCurrentApprover: false, // 是否为当前审批人
    forwardType: null, // 是否转发 2 转发标识 显示附言按钮
    showType: null, // 1-待办审批 2-已办审批 3-办结审批
    // recipient: true, // 展示接收人
    // transmit: null // 是否转发
  },
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
      console.log('提交：', e, this.props.recipient);
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
            console.log('附言：',res)
            ddUtils.showToast({title: '操作成功！'})
            ddUtils.navigateBack();
          }
        })
      } else { // 转发
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
