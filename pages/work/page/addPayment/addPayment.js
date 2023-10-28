Page({
  data: {
    navbarData: {
      title: "新增支付申请",
  },
    screenExecuteUser: "",
    dialogScreenExecuteUserRef: null,
    dialogScreenShiGongUnitRef: null,
    chooseExecuteUserList: [],
    screenShiGongUnitData: {},
    isEdit: false,
    dialogScreenprojectTypeRef:null,
    projectTypeData:{}
  },
  onLoad() {},
  bindChooseProjectTypeTap: function (e) {
    console.log(e);
    if (this.data.isEdit) return;
    if (this.dialogScreenprojectTypeRef) this.dialogScreenprojectTypeRef._showDialog(this.data.projectTypeData.itemValue)
  },
  onSaveDialogScreenprojectTypeRef: function (ref) {
    this.dialogScreenprojectTypeRef = ref;
},
  bindChooseProjectTypeCallBack: function (data) {
    this.setData({
      projectTypeData: data || {}
    });
},

  bindChooseExecuteUserTap: function (e) {
    console.log(e);
    if (this.dialogScreenExecuteUserRef) this.dialogScreenExecuteUserRef._showDialog()
},
 //执行人员
 onSaveDialogScreenExecuteUserRef: function (ref) {
  this.dialogScreenExecuteUserRef = ref;
},
bindScreenExecuteUserCallBack: function (list) {
  console.log(list);
  this.chooseExecuteUserList = list;

  let str = "";

  for (let item of this.chooseExecuteUserList) {
      str += item.username;
      str += ",";
  }

  this.setData({
      screenExecuteUser: isEmpty(str) ? '' : str.substring(0, str.length - 1)
  });
},
//所属单位
_bindChooseShiGongUnitTap: function (e) {
  console.log(e);
  if (this.dialogScreenShiGongUnitRef) this.dialogScreenShiGongUnitRef._showDialog();
},

_onSaveDialogScreenShiGongUnitRef: function (ref) {
  console.log(ref);
  this.dialogScreenShiGongUnitRef = ref;
},
_bindScreenShiGongUnitCallBack: function (data) {
  console.log(data);
  this.setData({
      screenShiGongUnitData: data
  });

  // this._getLastSubmitInfo();
},

});
