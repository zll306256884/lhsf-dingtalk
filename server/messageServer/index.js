import { API_HOST } from "../../utils/config.js"

module.exports = {
  //查询我的请求列表(分页)
  API_REQUEST_LIST: API_HOST + "/platform/userMatter/queryListByPage",
  //
  API_COUNT_MATTER: API_HOST + "/platform/userMatter/countMatter",
  //我的请求删除
  API_REQUEST_DELETE: API_HOST + "/platform/userMatter/deleteByArray",
}