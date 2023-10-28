Page({
  data: {
    dialogScreenExecuteUserRef: null,
    chooseExecuteUserList: [],
  },
  onLoad() {},
  bindChooseExecuteUserTap: function (e) {
    console.log(e);
    if (this.dialogScreenExecuteUserRef) this.dialogScreenExecuteUserRef._showDialog()
},
 //执行人员
 onSaveDialogScreenExecuteUserRef: function (ref) {
  this.dialogScreenExecuteUserRef = ref;
},
bindScreenExecuteUserCallBack: function (list) {
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
});
