Page({
  data: {
    navbarData:{
      title: "文件下载"
    },
  },
  uploadImageList:null,
  onSaveUploadTenderImgRef(ref) {
    this.uploadImageList = ref;
  },
  onLoad(option) {
    const files= JSON.parse(option.files).map((item)=>{
      return {
        ...item,
        name:item.fileName,
        url:item.fileUrl
      }
    })
    setTimeout(() => {
      this.uploadImageList._setImageList( files );
    }, 0);
  },
});
