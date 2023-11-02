// import ddUtils from "../../../../utils/ddUtils"
// import request from "../../../../utils/request"
// import userServer from "../../../../server/userServer"
// import {
//   isEqual,
//   isEmptyArray
// } from "../../../../utils/utils"

// import {
//   isEqual,
//   isEmptyArray
// } from "../../utils/utils"
// import ddUtils from "../../../../utils/ddUtils"
// import userServer from "../../server/userServer"
// import request from "../../utils/request"

Component({
  mixins: [],
  data: {},
  props: {
    mustFill: false,
    dialogIsOutPutRef: null,
    listData: [{
        name: '11',
        value: 11
      },
      {
        name: '22',
        value: 22
      }
    ]
    // edata="{{edata}}"
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 项目名称
    _bindChooseIsOutPut() {
      if (this.dialogIsOutPutRef) this.dialogIsOutPutRef._showDialog();
    },
    bindIsOutPutRef(item){
      this.setData({
        isOutPut:item
      })
    },
    onSaveDialogScreenIsOutPutRef(ref){
      console.log(11)
      this.dialogIsOutPutRef = ref
    },
    // _bindChooseIsOutPut:function(e){
    //   console.log(1)
    // }
    // 获取项目名称列表
    getProjectList: function () {
      return new Promise((resolve, reject) => {
        request.doPostRequest({
          url: userServer.API_BASE_INFO,
          showLoading: false,
          data: {
            userId: app.globalData.userInfo.userId
          },
          success: res => {
            // console.log('res.data', res.data)
            this.setData({
              userInfo: {
                nickName: res.data.username,
                avatar: res.data.headImg,
                mobile: res.data.mobile,
                firstName: res.data.username ? res.data.username.split('')[0] : ''
              },
            });
            console.log('userInfo', this.data.userInfo)
            resolve(res.data)
          },
          fail: res => {
            reject(res)
          }
        });
      })
  
    },
  },
});