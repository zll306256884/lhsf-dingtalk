import config from "../../../../utils/config";
import request from "../../../../utils/request";
import { isEmpty, isEmptyArray, getImgUrl } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
const defaultCount = 10;
const app = getApp();

Component({
  mixins: [],
  data: {
    imgList: [], //{id: "", url: "", name: "", size: "", status: "success", createTime: "", progress: 0}
    isWebView: false, 
    webViewContext:'',
    webViewUrl: 'http://192.168.6.41/#/share/viewFile'//'http://192.168.8.168:8080/#/share/viewFile' //  'http://localhost:5173/viewFile'
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
    onMessage:function(e) {
      if(e.detail.hidden) {
        this.setData({
          isWebView : false
        })
      }
      if(e.detail.imgList){
        this.setData({
          isWebView : false,
          imgList: this.data.imgList.concat(e.detail.imgList)
        })
      }
      console.log('接受消息',e.detail)
    },
    //获取上传的图片信息
    _getUploadImgId: function () {
      console.log('this.data.imgList',this.data.imgList)
      //let imgId = "";
      let imgUrlList = [];
      let imgIdList = [];

      for (let item of this.data.imgList) {
        item.size = item.size?item.size: 0
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
          url: getImgUrl(item.url),
        });
      }

      this.setData({
        imgList: tempList
      });
    },
    //图片所有数据（带id）
    _setImageList: function (list) {
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
    _bindAddTap: function (e) {
      console.log(e)
      console.log(this.data.imgList.length, this.props.maxCount)
      if (this.data.imgList.length > this.props.maxCount-1){
        ddUtils.showToast({
          title: '上传文件不能超过10个'
        })
        return
      } 
      if (this.props.disabled) return;

      ddUtils.showActionSheet({
        itemList: ["拍照", "手机相册",'文件'],
        success: res => {
          console.log('res',res)
          let count = this.data.maxCount - this.data.imgList.length;
          switch (res.index) {
            case 0:
              ddUtils.chooseImage({
                count: count,
                sourceType: ['camera'],
                success: resChooseImg => {
                  console.log('resChooseImg',resChooseImg)
                  this._dealChooseImage(resChooseImg);
                },
              });
              break;
            case 1:
              ddUtils.chooseImage({
                count: count,
                sourceType: ['album'],
                success: resChooseImg => {
                  console.log('resChooseImg',resChooseImg)
                  this._dealChooseImage(resChooseImg);
                },'typesOf':'viewFile',
              })
              break
            case 2:
              this.webViewContext = dd.createWebViewContext('web-view-1')
              this.setData({
                isWebView :true
              })
              // setTimeout(()=>{
              //   this.webViewContext.postMessage({type:'downFile',url:'https://linhaishefa.eos-shanghai-2.cmecloud.cn/knowledge/%E6%B5%8B%E8%AF%951.docx',name:'测试1.docx'})
              // },1000)
              this.webViewContext.postMessage({tokenStr:app.globalData.userInfo.userToken})
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

      if (!this.props.disabled) itemList.push("删除");
      if (isEmpty(this.data.imgList[index].url))
        itemList.push("重新上传");

      ddUtils.showActionSheet({
        itemList: itemList,
        success: res => {
          switch (res.index) {
            case 0: //预览
              let imgs = [];
              this.data.imgList.forEach(function (item) {
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
              })
              break;
            case 2: //重新上传
              this._uploadWebFile(this.data.imgList[index].localPath,this.data.imgList[index].name, index);
              // this._uploadImage(this.data.imgList[index].localPath, index);
              break;
            default:
              break
          }
        }
      });
    },
    deleteClose(e){
      let index = e.currentTarget.dataset.index;
      this.data.imgList.splice(index, 1);
      this.setData({
        imgList: this.data.imgList
      })
    },
    //deal choose image
    _dealChooseImage: function (files) {
      console.log(files)
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
          url: "",
          name: itemPath.slice(itemPath.lastIndexOf('/')+1)
        };
        this.data.imgList.push(tempFile);
      });

      this.setData({
        imgList: this.data.imgList
      });

      this.data.imgList.forEach((item, index) => {
        if (isEmpty(item.url)) {
          // this._uploadImage(item.localPath, index);
          this._uploadWebFile(item.localPath,item.name, index)
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
            item.name = res.data.name
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
    _uploadWebFile: function (filePath, name, index) {
      console.log(filePath,name,index)

      if (isEmpty(filePath)) {
        ddUtils.showToast({
          title: "无效的文件地址"
        });
        return
      }
      request.doWebUploadFile({
        filePath: filePath,
        compressLevel: 2,
        success: res => {
          if (res.data) {
            console.log(res.data)
            let item = this.data.imgList[index];
            item.progress = 100;
            item.name = res.data.fileName
            item.url = res.data.path
            this.data.imgList[index] = item;
            this.setData({
              imgList: this.data.imgList
            });
            console.log('this.data.imgList',this.data.imgList)
            // dd.getFileInfo({
            //   apFilePath: res.data.fileLocalPath,  //回调本地文件地址
            //   success: file => {
            //     request.doPostRequest({
            //       url: config.API_SAVE_FILE_SERVER,  // 上传保存到文件服务器
            //       data: [
            //         {
            //           name: res.data.fileName,
            //           downloadUrl: res.data.filePath,
            //           size: file.size,
            //           type: res.data.fileType === 'image' ? 1 : (res.data.fileType === 'video' ? 2 : 3)
            //         }
            //       ],
            //       success: saveRes1 => {
            //         if (saveRes1.data && Array.isArray(saveRes1.data.fileResultInfoList) && saveRes1.data.fileResultInfoList.length === 1) {
            //           item.id = saveRes1.data.fileResultInfoList[0].id;
            //           item.url = res.data.path;
            //           item.progress = 100;
            //           item.name = res.data.fileName
            //           this.data.imgList[index] = item;
            //           this.setData({
            //             imgList: this.data.imgList
            //           });
            //         }
            //       },
            //       fail: (error) => {
            //         ddUtils.showAlert({
            //           content: "图片上传失败!"
            //         });
            //       }
            //     });
            //   }
            // })
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
