import ddUtils from "../../utils/ddUtils"
// utils/ddUtils

Page({
  data: {
    userInfo: {
      nickName: '我是名字',
      avatar: 'https://img.alicdn.com/tfs/TB1up2UVoT1gK0jSZFrXXcNCXXa-199-280.png',
      mobile: '13014587895',
      firstName: '我'
    },
    partList: [{
        img: '../../assets/images/user/one.png',
        name: '个人信息'
      },
      {
        img: '../../assets/images/user/two.png',
        name: '修改密码'
      },
      {
        img: '../../assets/images/user/three.png',
        name: '退出登陆'
      }
    ],
  },
  // 跳转
  bindTopItemTap(e) {
    console.log(e.target.dataset.index);
    let code = e.target.dataset.index;
    if (code == 0) {
      // 我的信息
      dd.navigateTo({
        url: './page/baseinfo/baseinfo'
      })
    }
    if (code == 1) {
      // 修改密码
      dd.navigateTo({
        url: './page/editword/editword'
      })
    }
    if (code == 2) {
      // 退出登录
      ddUtils.showActionSheet({
        itemList: ["退出登录"],
        success: res => {
          switch (res.index) {
            case 0:
              ddUtils.clearLoginStorage();

              ddUtils.reLaunch({
                url: "/pages/user/login/login"
              })
              break;
            default:
              break
          }
        }
      });

    }

  },
  // 更改数据示例
  changeName(e) {
    this.setData({
      name: 'dingtalk'
    })
  },
  // 跳转页面示例
  tothePage() {
    dd.navigateTo({
      url: './page/personalinfo/index'
    })
  },
  imageError(e) {
    console.log('image 发生 error 事件，携带值为', e.detail.errMsg);
  },
  onTap(e) {
    console.log('image 发生 tap 事件', e);
  },
  imageLoad(e) {
    console.log('image 加载成功', e);
  },
  onSubmit(e) {
    console.log('onSubmit', e);
    dd.alert({
      content: `你选择的框架是 ${e.detail.value.libs.join(', ')}`,
    });
  },
  onReset(e) {
    console.log('onReset', e);
  },
  onChange(e) {
    console.log(e);
  },
});