import config from "./config"
import request from "./request"
import ddUtils from "./ddUtils"

function downloadFile(url) {
    // let fileName
    let debounce = null;
    return function(){
      if(debounce){
        clearTimeout(debounce);
      }
      debounce  = setTimeout(()=> {
        request.doPostRequest({
          url: config.API_FILE_SETURL,
          data:{
            fileName: url,
          },
          success: result => {
            if(result.code == 1000) {
            //  fileName = result.data.split('/')
              // 获取钉盘文件信息
              request.doPostRequest({
                url: config.API_FILE_GETURL,
                data: {
                  targetPath: result.data,
                },
                success: res => {
                let ddDownFileParams =  ddUtils.urlParams(res.data)
                // 获取钉盘文件信息
                ddUtils.ddDownFile(ddDownFileParams)
                debounce = null;
                }
              })
            }
          }
        })
      ,10000})
    }
  }
  module.exports={
    downloadFile,

  }