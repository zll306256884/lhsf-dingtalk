Page({
  data: {
    title: 'Dingtalk',
    array: [{user: 'li'}, {user: 'zhao'}],
    src: 'https://img.alicdn.com/tfs/TB1up2UVoT1gK0jSZFrXXcNCXXa-199-280.png',
    items: [
      { name: 'angular', value: 'AngularJS' },
      { name: 'react', value: 'React', checked: true },
      { name: 'polymer', value: 'Polymer' },
      { name: 'vue', value: 'Vue.js' },
      { name: 'ember', value: 'Ember.js' },
      { name: 'backbone', value: 'Backbone.js', disabled: true },
    ],
    name: 'alibaba',
    initialData :{
      name: 'alibaba'
    }
  },
  // 更改数据示例
  changeName(e) {
    this.setData({
      name: 'dingtalk'
    })
  },
  // 跳转页面示例
  tothePage(){
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
