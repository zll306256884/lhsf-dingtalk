//index.js
Page({
  data: {
    id: 0,
    title: "Dingtalk",
    condition: true,
    zero: 0,
    items: [1, 2, 3, 4, 5, 6, 7],
    view: 'WEBVIEW',
    staffA: {
      firstName: 'san',
      lastName: 'zhang'
    },
    staffB: {
      firstName: 'si',
      lastName: 'li'
    },
    staffC: {
      firstName: 'wu',
      lastName: 'wang'
    },
  },
  onLoad(query) {
    // 页面加载
    // query 参数为 dd.navigateTo 和 dd.redirectTo 中传递的 query 对象。
  },
  onReady() {
    // 页面加载完成
    // 类比于vue的mounted
  },
  onShow() {
    // 页面显示
    // getCurrentPages()函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
  },
  onHide() {
    // 页面隐藏
    // 当 dd.navigateTo 到其他页面或底部 tab 切换时调用。
  },
  onUnload() {
    // 页面被关闭
    // 当 dd.redirectTo 或 dd.navigateBack 到其他页面的时候调用。
  },
  onTitleClick() {
    console.log('标题被点击')
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
  viewTap() {
    // 事件处理
    this.setData({
      text: 'Set data for update.'
    })
  },
  go() {
    // 带参数的跳转，从 page/index 的 onLoad 函数的 query 中读取 xx
    // 跳转回主页面
    dd.navigateTo({
      // url:'/page/index?xx=1'
      url: '../../index'
    })
  },
  customData: {
    hi: 'Dingtalk'
  }
})