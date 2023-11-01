import {
  isEqual,
  isEmptyArray
} from "../../../../utils/utils"
import ddUtils from "../../../../utils/ddUtils"
import userServer from "../../../../server/userServer"
import request from "../../../../utils/request"


const app = getApp();

Page({
  data: {
    baseInfo: [{
        name: '姓名',
        word: '我是姓名'
      },
      {
        name: '部门',
        word: '我是部门'
      },
      {
        name: '职位',
        word: '我是职位'
      }
    ],
    projectList: [

      {
        name: '项目名称',
        word: '我是姓名'
      },
      {
        name: '项目角色',
        word: '我是部门'
      },
      {
        name: '职位',
        word: '我是职位'
      }
    ],
    partList: [{
        img: '../../assets/images/user/one.png',
        name: '个人信息'
      },
      {
        img: '../../assets/images/user/two.png',
        name: '修改密码'
      },
      {
        img: '../../assets/images/user/three.png',
        name: '退出登陆'
      }
    ],
  },
  onLoad() {},
  // 
  
});