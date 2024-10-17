import config from "./config"
import request from "./request"
import ddUtils from "./ddUtils"

function downloadFile (url) {
  // 文件优化以免漏网之鱼，正常走上面
  if(url.indexOf('https://eos-shanghai-2') == -1) {
    request.doPostRequest({
      url: config.API_FILE_GETURL,
      data: {
          targetPath: url,
      },
        success: res => {
          if(res.code==1000){
            ddUtils.showToast({
              title: "下载成功！"
            });
          }
          let ddDownFileParams = ddUtils.urlParams(res.data)
          // 获取钉盘文件信息
          ddUtils.ddDownFile(ddDownFileParams)
          // debounce = null;
        }
    })
  }else{
    request.doPostRequest({
        url: config.API_FILE_SETURL,
        data: {
            fileName: url,
        },
        success: result => {
            if (result.code == 1000) {
                //  fileName = result.data.split('/')
                // 获取钉盘文件信息
                request.doPostRequest({
                    url: config.API_FILE_GETURL,
                    data: {
                        targetPath: result.data,
                    },
                    success: res => {
                        let ddDownFileParams = ddUtils.urlParams(res.data)
                        // 获取钉盘文件信息
                        ddUtils.ddDownFile(ddDownFileParams)
                        debounce = null;
                    }
                })
            }
        }
    })
  }
}
module.exports = {
    downloadFile,
}
