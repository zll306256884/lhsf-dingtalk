import config from "/utils/config";
import request from "/utils/request";
import { isEmpty, isEmptyArray, getImgUrl } from "/utils/utils";
import ddUtils from "/utils/ddUtils";
import ddFile from "/utils/ddFile";

const defaultCount = 99;
const app = getApp();

Component({
  mixins: [],
  data: {
    loding: false,
    imgList: [], //{id: "", url: "", name: "", size: "", status: "success", createTime: "", progress: 0}
    isWebView: false,
    webViewContext: "",
    webViewUrl: config.BASE_API_HOST + "/#/share/viewFile"
  },
  props: {
    cssStyle: "",
    imageSize: 190,
    maxCount: defaultCount,
    disabled: false,
    itemIndex: -1,
    hide: true,
    onlyUploadImage: false,
    type: undefined,
    uploadRef: undefined,
    imgList: []
  },
  didMount() {
    this.setData({
      imgList: this.handleFileList(this.props.imgList)
    });
  },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) {},
  didUpdate(prevProps, prevData) {
    //这里不能setData, 否则会陷入无限循环
  },
  didUnmount() {},
  methods: {
    handleFileList(files) {
      files.forEach(item => {
        item.disabled=false
        const extension = item.name.slice(item.name.lastIndexOf(".") + 1);
        switch (extension) {
          case "pdf":
            item.typeUrl='/assets/images/file/icon_file_pdf.png'
            break;
          case "ppt":
            item.typeUrl='/assets/images/file/icon_file_ppt.png'
            break;
          case "png":
          case "jpg":
          case "jpeg":
            item.typeUrl='/assets/images/file/icon_file_image.png'
            break;
          case "doc":
          case "docx":
            item.typeUrl='/assets/images/file/icon_file_word.png'
            break;
          case "xlsx":
          case "xls":
            item.typeUrl='/assets/images/file/icon_file_excel.png'
            break;
          default:
            item.typeUrl='/assets/images/file/fujianziliao.png'
            break;
        }
      });
      return files
    },
    //获取上传的图片信息
    _getUploadImgId: function() {
      console.log("this.data.imgList", this.data.imgList);
      //let imgId = "";
      let imgUrlList = [];
      let imgIdList = [];

      for (let item of this.data.imgList) {
        item.size = item.size ? item.size : 0;
        if (item.progress > 0 && item.progress < 100) {
          ddUtils.showToast({
            title: "上传中, 请稍后"
          });
          return {
            success: false
          };
        }
        if (isEmpty(item.url)) {
          ddUtils.showToast({
            title: "存在暂未上传完成的图片或视频, 请先上传"
          });
          return {
            success: false
          };
        }
        imgIdList.push(item.id);
        imgUrlList.push(item.url);
      }

      return {
        success: true,
        //value: !isEmpty(imgId) ? imgId.substring(0, imgId.length - 1) : "",
        imgUrlList,
        imgList: this.data.imgList,
        imgIdList
      };
    },

    _setImgList: function(list) {
      list = list || [];
      let tempList = [];

      for (let item of list) {
        tempList.push({
          url: item,
          progress: 100,
          url: getImgUrl(item.url)
        });
      }

      this.setData({
        imgList: tempList
      });
    },
    //图片所有数据（带id）
    _setImageList: function(list) {
      list = list || [];

      let tempList = [];

      for (let item of list) {
        tempList.push({
          url: item,
          progress: 100,
          url: getImgUrl(item.url),
          id: item.id,
          name: item.name
        });
      }

      this.setData({
        imgList: tempList
      });
    },

    //选择图片
    _bindAddTap: function(e) {
      if (this.props.disabled) return;

      ddUtils.showActionSheet({
        itemList: ["拍照", "手机相册"],
        success: res => {
          let count = this.data.maxCount - this.data.imgList.length;
          switch (res.index) {
            case 0:
              ddUtils.chooseImage({
                count: count,
                sourceType: ["camera"],
                success: resChooseImg => {
                  this._dealChooseImage(resChooseImg);
                }
              });
              break;
            case 1:
              ddUtils.chooseImage({
                count: count,
                sourceType: ["album"],
                success: resChooseImg => {
                  this._dealChooseImage(resChooseImg);
                }
              });
              break;
            default:
              break;
          }
        }
      });
    },

    _bindPreviewTap: function(e) {
      let index = e.currentTarget.dataset.index;
      if (this.props.disabled && isEmpty(this.data.imgList[index].url)) return;
      let itemList = ["预览"];
      if (!this.props.disabled) itemList.push("删除");
      if (isEmpty(this.data.imgList[index].url)) itemList.push("重新上传");

      ddUtils.showActionSheet({
        itemList: itemList,
        success: res => {
          switch (res.index) {
            case 0: //预览
              let imgs = [];
              this.data.imgList.forEach(function(item) {
                imgs.push(isEmpty(item.localPath) ? item.url : item.localPath);
              });
              ddUtils.previewImage({
                current: index,
                urls: imgs
              });
              break;
            case 1: //删除
              this.data.imgList.splice(index, 1);
              this.setData({
                imgList: this.data.imgList
              });
              break;
            case 2: //重新上传
              // this._uploadWebFile(this.data.imgList[index].localPath, index); //oss直传
              this._uploadImage(this.data.imgList[index].localPath, index);
              break;
            default:
              break;
          }
        }
      });
    },

    //deal choose image
    _dealChooseImage: function(files) {
      if (!files.filePaths) {
        ddUtils.showToast({
          title: "无效的图片"
        });
        return;
      }

      files.filePaths.forEach(itemPath => {
        let tempFile = {
          progress: 0,
          localPath: itemPath,
          url: ""
        };
        this.data.imgList.push(tempFile);
      });

      this.setData({
        imgList: this.data.imgList
      });

      this.data.imgList.forEach((item, index) => {
        if (isEmpty(item.url)) {
          this._uploadImage(item.localPath, index);
          // this._uploadWebFile(item.localPath, index)
        }
      });
    },

    //upload file < 通过后端上传>
    _uploadImage: function(filePath, index) {
      if (isEmpty(filePath)) {
        ddUtils.showToast({
          title: "无效的文件地址"
        });
        return;
      }
      //formData格式待处理
      request.doUploadFile({
        url: config.API_UPLOAD_FILE,
        filePath: filePath,
        success: res => {
          if (res.data) {
            let item = this.data.imgList[index];
            item.name = res.data.name;
            item.progress = 100;
            item.url = res.data.path;
            item.id = res.data.id;

            this.data.imgList[index] = item;

            this.setData({
              imgList: this.data.imgList
            });
          }
        },
        fail: error => {
          this.data.imgList[index].progress = 0;

          this.setData({
            imgList: this.data.imgList
          });
          ddUtils.showAlert({
            content: "图片上传失败!"
          });
        },
        progress: res => {
          if (res.progress >= 100) {
            res.progress = 99;
          }

          this.data.imgList[index].progress = res.progress;

          this.setData({
            imgList: this.data.imgList
          });
        }
      });
    },

    // web upload file <前端直传>
    _uploadWebFile: function(filePath, index) {
      if (isEmpty(filePath)) {
        ddUtils.showToast({
          title: "无效的文件地址"
        });
        return;
      }
      request.doWebUploadFile({
        filePath: filePath,
        compressLevel: 2,
        success: res => {
          if (res.data) {
            let item = this.data.imgList[index];
            item.progress = 99;
            this.data.imgList[index] = item;
            this.setData({
              imgList: this.data.imgList
            });
            dd.getFileInfo({
              apFilePath: res.data.fileLocalPath, //回调本地文件地址
              success: file => {
                request.doPostRequest({
                  url: config.API_SAVE_FILE_SERVER, // 上传保存到文件服务器
                  data: [
                    {
                      name: res.data.fileName,
                      downloadUrl: res.data.filePath,
                      size: file.size,
                      type:
                        res.data.fileType === "image"
                          ? 1
                          : res.data.fileType === "video"
                          ? 2
                          : 3
                    }
                  ],
                  success: saveRes1 => {
                    if (
                      saveRes1.data &&
                      Array.isArray(saveRes1.data.fileResultInfoList) &&
                      saveRes1.data.fileResultInfoList.length === 1
                    ) {
                      item.id = saveRes1.data.fileResultInfoList[0].id;
                      item.url = res.data.path;
                      item.progress = 100;
                      item.name = res.data.fileName;
                      this.data.imgList[index] = item;
                      this.setData({
                        imgList: this.data.imgList
                      });
                    }
                  },
                  fail: error => {
                    ddUtils.showAlert({
                      content: "图片上传失败!"
                    });
                  }
                });
              }
            });
          }
        },
        fail: error => {
          this.data.imgList[index].progress = 0;
          this.setData({
            imgList: this.data.imgList
          });
          ddUtils.showAlert({
            content: "图片上传失败!"
          });
        }
      });
    },
    catchAddTap(e) {
      if (this.data.imgList.length > this.props.maxCount - 1) {
        ddUtils.showToast({
          title: "上传文件不能超过10个"
        });
        return;
      }
      if (this.props.disabled) return;
      ddUtils.navigateTo({
        url: `/pages/common/upload-file/upload-file?type=${this.props.type}&imgList=${this.data.imgList.length}&uploadRef=${this.props.uploadRef}`
      });
    },
    ddDownFile(e) {
      console.log('e--------------',e);
      let index = e.currentTarget.dataset.index;
      let url = this.data.imgList[index].preUrl || this.data.imgList[index].url;
      let name = this.data.imgList[index].name;
      let extension = name.slice(name.lastIndexOf(".") + 1);
      console.log('url',url);
      if (["mp4", "avi", "mov"].includes(extension)) {
        ddUtils.navigateTo({
          url:`/pages/common/video-page/video-page?name=查看视频&url=` +url
        });
        return;
      }
      if(['png','jpg','jpeg'].includes(extension)){
        ddUtils.previewImage({
          urls: [url]
        });
      }else{
        ddFile.downloadFile(url)
      }
      // ddUtils.navigateTo({
      //   url: `/pages/common/preview-file/preview-file?type=${this.props.type}&fileUrl=${url}&fileName=${name}`
      // });
    },
    deleteClose(e) {
      ddUtils.showModal({
        title: "确认删除所选数据？",
        content: "删除后不可恢复，请确认",
        success: res => {
          if (res.confirm) {
            let index = e.currentTarget.dataset.index;
            this.data.imgList.splice(index, 1);
            this.setData({
              imgList: this.data.imgList
            });
          }
        }
      });
    }
  }
});
