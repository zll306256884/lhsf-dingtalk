
//  测试配置
// const BASE_API_HOST = "http://121.43.151.122";
const API_HOST = BASE_API_HOST + "/prod-api";

// 线上配置
// const BASE_API_HOST = "http://team.wzpm.com.cn";
// const API_HOST = BASE_API_HOST + "/online-api";


const API_IMG_URL = "https://wzpm-platform.oss-cn-hangzhou.aliyuncs.com/";



module.exports = {
    API_HOST: API_HOST,
    API_IMG_URL: API_IMG_URL,
    //api接口(注意加注释)
    // 例如上传文件 
   API_UPLOAD_FILE: API_HOST + "/supervisor/fileInfo/uploadOssFile", 
}