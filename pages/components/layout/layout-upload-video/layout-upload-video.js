import config from "../../../../utils/config";
import request from "../../../../utils/request";
import { isEmpty, isEmptyArray, getImgUrl } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
const defaultCount = 5;
const app = getApp();

Component({
  mixins: [],
  data: {
    imgList: [], //{id: "", url: "", name: "", size: "", status: "success", createTime: "", progress: 0}
  },
  props: {
    cssStyle: "",
    imageSize: 190,
    maxCount: defaultCount,
    disabled: false,
    itemIndex: -1,
  },
  didMount() {
    this.setData({
      imgList: []
    })

  },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) {

  },
  didUpdate(prevProps, prevData) {//这里不能setData, 否则会陷入无限循环

  },
  didUnmount() { },
  methods: {
    //获取上传的图片信息
    _getUploadImgId: function () {
      //let imgId = "";
      let imgUrlList = [];
      let imgIdList = [];

      for (let item of this.data.imgList) {
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
      }
    },

    _setImgList: function (list) {
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
    _setImageList: function (list) {
      list = list || [];

      let tempList = [];

      for (let item of list) {
        tempList.push({
          url: item,
          progress: 100,
          url: getImgUrl(item.url),
          id:item.id
        });
      }

      this.setData({
        imgList: tempList
      });
    },
    //选择图片
    _bindAddTap: function (e) {
      if (this.props.disabled) return;

      ddUtils.showActionSheet({
        itemList: ["录视频", "手机相册"],
        success: res => {
          let count = this.data.maxCount - this.data.imgList.length;
          switch (res.index) {
            case 0:
              ddUtils.chooseVideo({
                count: count,
                sourceType: ['camera'],
                success: resChooseImg => {
                  this._dealChooseImage(resChooseImg);
                },
              });
              break;
            case 1:
              ddUtils.chooseVideo({
                count: count,
                sourceType: ['album'],
                success: resChooseImg => {
                  this._dealChooseImage(resChooseImg);
                },
              })
              break
            default:
              break
          }
        }
      });
    },

    _bindPreviewTap: function (e) {
      let index = e.currentTarget.dataset.index;

      if (this.props.disabled && isEmpty(this.data.imgList[index].url)) return;

      let itemList = ["预览"];
      // let itemList = [];
      if (!this.props.disabled) itemList.push("删除");
      if (isEmpty(this.data.imgList[index].url))
        itemList.push("重新上传");

      ddUtils.showActionSheet({
        itemList: itemList,
        success: res => {
          switch (res.index) {
            case 0: //预览
              ddUtils.navigateTo({
                url: `/pages/more/video-page/video-page?name=查看视频&url=` + this.data.imgList[index].url
              });
              break;
            case 1: //删除
              this.data.imgList.splice(index, 1);
              this.setData({
                imgList: this.data.imgList
              })
              break;
            case 2: //重新上传
              this._uploadWebFile(this.data.imgList[index].localPath, index);
              // this._uploadImage(this.data.imgList[index].localPath, index);
              break;
            default:
              break
          }
        }
      });
    },

    //deal choose image
    _dealChooseImage: function (files) {

      if (!files.tempFilePath) {
        ddUtils.showToast({
          title: "无效的视频"
        });
        return;
      }


      let tempFile = {
        progress: 0,
        localPath: files.tempFilePath,
        url: "",
      };

      console.log("tempFile==", files)

      this.data.imgList.push(tempFile);
      this.setData({
        imgList: this.data.imgList
      });

      this.data.imgList.forEach((item, index) => {
        if (isEmpty(item.url)) {
          // this._uploadImage(item.localPath, index);
          this._uploadWebFile(item.localPath, index)
        }
      });
    },

    //upload file < 通过后端上传>
    _uploadImage: function (filePath, index) {
      if (isEmpty(filePath)) {
        ddUtils.showToast({
          title: "无效的文件地址"
        });
        return
      }

      request.doUploadFile({
        url: config.API_UPLOAD_FILE,
        filePath: filePath,
        success: res => {
          if (res.data) {
            let item = this.data.imgList[index];

            item.progress = 100;
            item.url = res.data.path;
            item.id = res.data.id

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
      })
    },

    // web upload file <前端直传>
    _uploadWebFile: function (filePath, index) {

      if (isEmpty(filePath)) {
        ddUtils.showToast({
          title: "无效的文件地址"
        });
        return
      }
      request.doWebUploadFile({
        filePath: filePath,
        success: res => {
          if (res.data) {
            console.log(res)
            let item = this.data.imgList[index];
            item.progress = 99;
            this.data.imgList[index] = item;
            this.setData({
              imgList: this.data.imgList
            });
            dd.getFileInfo({
              apFilePath: filePath,  //本地文件地址
              success: file => {
                request.doPostRequest({
                  url: config.API_SAVE_FILE_SERVER,  // 上传保存到文件服务器
                  data: [
                    {
                      name: res.data.fileName,
                      downloadUrl: res.data.filePath,
                      size: file.size,
                      type: res.data.fileType === 'image' ? 1 : (res.data.fileType === 'video' ? 2 : 3)
                    }
                  ],
                  success: saveRes1 => {
                    if (saveRes1.data && Array.isArray(saveRes1.data.fileResultInfoList) && saveRes1.data.fileResultInfoList.length === 1) {
                      item.id = saveRes1.data.fileResultInfoList[0].id;
                      item.url = res.data.path;
                      item.progress = 100;
                      this.data.imgList[index] = item;
                      this.setData({
                        imgList: this.data.imgList
                      });
                    }
                  },
                  fail: (error) => {
                    ddUtils.showAlert({
                      content: "图片上传失败!"
                    });
                  }
                });
              }
            })
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
      })
    }
  },
});
