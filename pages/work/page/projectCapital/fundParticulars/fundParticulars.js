Page({
  data: {
    navbarData: {
      title: "详情",
  },
  info:{},
  sonList:[]
  },
  onLoad(option) {
   let data =JSON.parse(option.json)  
  this.setData({
    info:data,
    sonList:data.sonList
  })
  },
});
