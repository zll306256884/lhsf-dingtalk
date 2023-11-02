import utils from './utils';
import ddUtils from './ddUtils';
import config from './config';

//签名 sign
const constKey = "qCW2FJpPrW";
function doPostRequest(obj) {
  let app = getApp();
  let option = Object.assign({
    headers: {
      'Content-Type': "application/json",
      'channel': "dd"
    },
    url: "",
    method: "POST",
    data: {},
    userToken: "",
    showLoading: true,
    mask: true,
    showErrorMsg: true
  }, obj);

  if (ddUtils.showEmptyToastTips(option.url, "请求url不能为空!")) return;

  if (option.showLoading)
    ddUtils.showLoading();

  if (!utils.isEmpty(app.globalData.userInfo.userToken))
    // option.headers["X-Access-Token"] = ''
    option.headers["X-Access-Token"] = app.globalData.userInfo.userToken

  // let time = utils.getTimestamp();
  // let sign = utils.sort_ASCII(option.data);

  // option.data.sign = utils.SHA1MD5(sign + constKey + time);
  // option.data.time = time;
  if (!dd.canIUse('request')) {
    dd.request = dd.httpRequest
  }
  dd.request({
    headers: option.headers, //设置Content-Type类型为aapplication/x-www-form-urlencoded,以告知服务器实体中有参数,不设置会出现服务器拿不到参数type
    method: option.method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    url: option.url,
    data: JSON.stringify(option.data),
    success: function (res) {
      res.loadFail = false;
      if (option.showLoading) { //在success和fail回调里hide loading 是为了防止hide loading后show toast一闪而过
        ddUtils.hideLoading();
      }

      if (res.data.code === 1000) {
        if (typeof option.success === "function")
          option.success(res.data);
      } else {
        res.errorMessage = res.data.message;

        if (typeof option.fail == "function")
          option.fail(res);

        if (option.showErrorMsg)
          ddUtils.showToast({
            title: res.errorMessage
          });
      }
    },
    fail: function (res) {
      if (option.showLoading) {
        ddUtils.hideLoading();
      }
      res.loadFail = true;
      res.tokenInvalid = res.status === 401;

      if (res.error === 13) res.errorMessage = "请求超时, 请重试!";
      if (res.status !== 401)
        if (res.error === 19 || res.error === 12) res.errorMessage = "服务开小差了, 请稍后重试!!";

      if (res.status !== 401 && option.showErrorMsg)
        ddUtils.showToast({
          title: res.errorMessage
        });

      if (typeof option.fail == "function")
        option.fail(res);

      if (res.status === 401 && !app.globalData.tokenInvalid) { //token失效
        app.globalData.tokenInvalid = true;

        ddUtils.clearLoginStorage();

        ddUtils.reLaunch({
          url: "/pages/user/page/login/index"
        })
      }
    },
    complete: function (res) {
      if (typeof option.complete == "function") {
        option.complete(res);
      }
    }
  });
}

//get 请求
function doGetRequest(obj) {
  let app = getApp();
  let option = Object.assign({
    headers: {
      'Content-Type': "application/json",
      'channel': "dd",
    },
    method: "GET",
    data: {},
    showLoading: true,
    mask: true,
    showErrorMsg: true,
  }, obj);

  if (ddUtils.showEmptyToastTips(option.url, "请求url不能为空!")) return;

  if (option.showLoading)
    ddUtils.showLoading();

  if (!utils.isEmpty(app.globalData.userInfo.userToken))
    option.headers["X-Access-Token"] = app.globalData.userInfo.userToken

  // let time = utils.getTimestamp();
  // let sign = utils.sort_ASCII(option.data);

  // option.data.sign = utils.SHA1MD5(sign + constKey + time);
  // option.data.time = time;
  if (!dd.canIUse('request')) {
    dd.request = dd.httpRequest
  }
  dd.request({
    headers: option.headers,
    url: option.url,
    data: option.data,
    method: option.method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      res.loadFail = false;
      if (option.showLoading) { //在success和fail回调里hide loading 是为了防止hide loading后show toast一闪而过
        ddUtils.hideLoading();
      }

      if (res.data.code === 1000) {
        if (typeof option.success === "function")
          option.success(res.data);
      } else {
        res.errorMessage = res.data.message;

        if (typeof option.fail == "function")
          option.fail(res);

        if (option.showErrorMsg)
          ddUtils.showToast({
            title: res.errorMessage
          });
      }
    },
    fail: function (res) {
      if (option.showLoading) {
        ddUtils.hideLoading();
      }
      res.loadFail = true;
      res.tokenInvalid = res.status === 401;

      if (res.error === 13) res.errorMessage = "请求超时, 请重试!";
      if (res.status !== 401)
        if (res.error === 19 || res.error === 12) res.errorMessage = "服务开小差了, 请稍后重试!!";

      if (res.status !== 401 && option.showErrorMsg)
        ddUtils.showToast({
          title: res.errorMessage
        });

      if (typeof option.fail == "function")
        option.fail(res);

      if (res.status === 401 && !app.globalData.tokenInvalid) { //token失效
        app.globalData.tokenInvalid = true;

        ddUtils.clearLoginStorage();

        ddUtils.reLaunch({
          url: "/pages/user/page/login/index"
        })
      }
    },
    complete: function (res) {
      if (typeof option.complete == "function") {
        option.complete(res);
      }
    }
  })
}


//上传文件
function doUploadFile(obj) {
  const app = getApp();

  let option = Object.assign({
    headers: {
      // "Content-Type": "multipart/form-data",
    },
    fileType: "image",
    formData: {},
  }, obj);


  if (ddUtils.showEmptyToastTips(option.url, "上传url不能为空!")) return;
  if (ddUtils.showEmptyToastTips(option.filePath, "上传文件地址不能为空!")) return;

  let time = utils.getTimestamp();
  let sign = utils.sort_ASCII(option.formData);

  if (!utils.isEmpty(app.globalData.userInfo.userToken))
    option.headers["X-Access-Token"] = app.globalData.userInfo.userToken

  option.formData.sign = utils.SHA1MD5(sign + constKey + time);
  option.formData.time = time;
  option.formData.fileName = option.filePath;

  let uploadTask = dd.uploadFile({
    headers: option.headers,
    url: option.url,
    fileType: option.fileType,
    filePath: option.filePath,
    fileName: "file",
    formData: option.formData,
    success: res => {
      if (typeof option.success == "function") {
        option.success(JSON.parse(res.data));
      }
    },
    fail: res => {
      res.loadFail = true;
      if (typeof option.fail == "function") {
        option.fail(res);
      } else {
        ddUtils.showToast({
          title: res.errorMessage
        });
      }

      if (res.status === 401 && !app.globalData.tokenInvalid) { //token失效
        app.globalData.tokenInvalid = true;

        ddUtils.clearLoginStorage();

        ddUtils.reLaunch({
          url: "/pages/user/page/login/index"
        })
      }
    },
    complete: res => {
      if (typeof option.complete == "function") {
        option.complete(res.data);
      }
    }
  });


  if (typeof uploadTask == "undefined")
    return;

  console.log("==222==", uploadTask);

  uploadTask.onProgressUpdate((res) => {
    console.log("onProgressUpdate===", res);
    if (typeof option.progress == "function")
      option.progress(res);
  });
}

/**
 * web直传
 * @param module 模块
 * @param filePath 路径
 * @param fileType 文件类型
 */
function doWebUploadFile(obj) {
  let option = Object.assign({
    filePath: 'text.jpg',
    module: 'lhsf/mobile',
    fileType: 'image',
    compressLevel: 2
  }, obj);

  var extension = option.filePath.split('.').pop().toLowerCase();  // 后缀名
  //判断文件类型
  if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff', 'image'].indexOf(extension) !== -1) {
    option.fileType = 'image'
    extension = extension === 'image' ? 'jpg' : extension
  } else if (['mov', 'mp4', 'm4v', 'avi', 'dat', 'mkv', 'flv', 'vob', 'rmvb', 'video'].indexOf(extension) !== -1) {
    option.fileType = 'video'
    extension = extension === 'video' ? 'mp4' : extension
  } else if (['mp3', 'mpeg', 'audio'].indexOf(extension) !== -1) {
    option.fileType = 'audio'
    extension = extension === 'audio' ? 'mp3' : extension
  }
  let time = utils.getTimestamp();
  option.fileName = utils.SHA1MD5(option.filePath + constKey + time) + '.' + extension
  option.ossFilePath = option.module + '/' + utils.formatTimeToDay(new Date()) + '/' + option.fileName
  getUploadCert({
    filePath: option.ossFilePath,
    success: param => {
      console.log('param-param',param)
      let uploadObj = { ...param, filePath: option.filePath }
      if (option.fileType === 'image') {
        dd.compressImage({
          filePaths: [option.filePath],
          compressLevel: option.compressLevel,
          success: res => {
            uploadObj.filePath = res.apFilePaths[0]
            // console.log('压缩成功',)

            // dd.getFileInfo({
            //   apFilePath: option.filePath,
            //   success: file => {
            //     console.log('原图', option.filePath, file)
            //   }
            // })


            // dd.getFileInfo({
            //   apFilePath: res.apFilePaths[0],
            //   success: file => {
            //     console.log('新图', res.apFilePaths[0], file)
            //   }
            // })
            uploadOss({
              ...uploadObj, success: () => {
                option.success({
                  data: {
                    path: uploadObj.url + '/' + option.ossFilePath,
                    filePath: option.ossFilePath,
                    fileLocalPath: uploadObj.filePath,
                    progress: 99,
                    fileName: option.fileName,
                    fileType: option.fileType
                  }
                });
              },
              fail: (res) => {
                if (typeof option.fail == "function") {
                  option.fail(res);
                }
              }
            })
          },
          fail: () => {
            uploadOss({
              ...uploadObj, success: () => {
                option.success({
                  data: {
                    path: uploadObj.url + '/' + option.ossFilePath,
                    filePath: option.ossFilePath,
                    fileLocalPath: uploadObj.filePath,
                    progress: 99,
                    fileName: option.fileName,
                    fileType: option.fileType
                  }
                });
              },
              fail: (res) => {
                if (typeof option.fail == "function") {
                  option.fail(res);
                }
              }
            })
          }
        })
      } else {
        uploadOss({
          ...uploadObj, success: () => {
            option.success({
              data: {
                path: uploadObj.url + '/' + option.ossFilePath,
                filePath: option.ossFilePath,
                fileLocalPath: uploadObj.filePath,
                progress: 99,
                fileName: option.fileName,
                fileType: option.fileType
              }
            });
          },
          fail: (res) => {
            if (typeof option.fail == "function") {
              option.fail(res);
            }
          }
        })
      }

    }
  })
}


//文件上传
function uploadOss(obj) {
  console.log(obj)
  let option = Object.assign({}, obj)
  // const host = 'https://linhaishefa.eos-shanghai-2.cmecloud.cn'; // 以天津、桶名称为 cjwtest 为例
  // dd.uploadFile({
  //   url: host,
  //   header: {},
  //   filePath: option.filePath,
  //   fileName: 'file',
  //   fileType: 'image',
  //   formData: option.formData,
  //   success: (res) => {
  //     console.log(res)
  //     if (res.statusCode === 204) {
  //       console.log('上传成功');
  //     }
  //   },
  //   fail: err => {
  //     console.log(err);
  //   }
  // });
  dd.uploadFile({
    ...option,
    success: (res) => {
      console.log(res)
      if (res.statusCode === 204 && typeof option.success == "function") {
        option.success(res)
      } else {
        if (typeof option.fail == "function") {
          option.fail(res);
        }
      }
    },
    fail: (res) => {
      if (typeof option.fail == "function") {
        option.fail(res);
      }
    }
  })
}

//获取
function getUploadCert(obj) {
  let option = Object.assign({
    filePath: 'text.jpg',
    fileType: 'image'
  }, obj);

  doPostRequest({
    url: config.API_GET_SIGN,  // 获取签名
    data: {
      acl:'public-read',
      objectName:option.filePath,//文件名
      contentType: option.fileType,
      durationSeconds:'31536000'
    },
    success: (res) => {
      console.log(res)
      if (typeof option.success == "function") {
        let param = {
          url: 'https://linhaishefa.eos-shanghai-2.cmecloud.cn',
          header: {},
          fileType: option.fileType,
          fileName: 'file',
          filePath: option.filePath,
          formData: {
            'key': res.data.key,
            'acl': res.data.acl,
            'Content-Type':option.fileType,
            'X-Amz-Credential': res.data.xamzCredential,
            'X-Amz-Algorithm': res.data.xamzAlgorithm,
            'X-Amz-Date': res.data.xamzDate,
            'Policy': res.data.policy,
            'X-Amz-Signature': res.data.xamzSignature
          }
        }
        option.success(param);
      }
    },
    fail: (error) => {
      if (typeof option.fail == "function") {
        option.fail(error);
      }
    }
  })
}

//下载文件
function doDownloadFile(obj) {

  if (ddUtils.showEmptyToastTips(obj.url, "下载url不能为空!")) return;

  let downloadTask = dd.downloadFile({
    url: obj.url,
    success: res => {
      if (typeof obj.success == "function") {
        obj.success(res);
      }
    },
    fail: res => {
      res.loadFail = true;
      if (typeof obj.fail == "function") {
        obj.fail(res);
      } else {
        ddUtils.showToast({
          title: res.errorMessage
        });
      }
    },
    complete: res => {
      if (typeof obj.complete == "function") {
        obj.complete(res);
      }
    }
  });

  if (typeof downloadTask == "undefined")
    return;

  downloadTask.onProgressUpdate((res) => {
    if (typeof obj.progress == "function")
      obj.progress(res);
  });
}

module.exports = {
  doPostRequest: doPostRequest,
  doGetRequest: doGetRequest,
  doUploadFile: doUploadFile,
  doDownloadFile: doDownloadFile,
  doWebUploadFile: doWebUploadFile
}