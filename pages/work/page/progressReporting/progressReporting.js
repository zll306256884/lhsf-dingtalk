import {
  isEmpty
} from "../../../../utils/utils"
import config from "../../../../utils/config"
import ddUtils from "../../../../utils/ddUtils"
import request from "../../../../utils/request"
import { Form } from 'antd-mini/es/Form/form';
import { formatTimeToDay } from "../../../../utils/utils";

Page({
  form: new Form({
    initialValues: {
      // logDate: formatTimeToDay(new Date())+ ' 00:00:00'
      // applicationTime: formatTimeToDay(new Date())+ ' 00:00:00'
    },
    rules: {
      projectId: [{ required: true, message: '请选择' }],
    },
  }),
  data: {
    navbarData: {
      title: "进度填报",
    },
    projectListOptions: [],//项目列表
    projectData: {
      name: "",
    },
    projectId: "",
    dialogScreenprojectRef: null, //项目名称
    planStageOptions:  [
      { value: 1, label: '前期计划' },
      { value: 2, label: '施工计划' },
    ],
  },
  onLoad(options) {
    console.log(options)
    this.getProjectList()
  },
  handleRef(ref) {
    this.form.addItem(ref);
  },
  // 点击取消
  bindCancelTap: function (e) {
    // ddUtils.showToast({
    //   title: "请选择项目名称"
    // });
    // ddUtils.navigateBack();
    ddUtils.showModal({
      content: "是否退出编辑？退出后不会保存当前编辑内容",
      success: res => {
        if (res.confirm) {
          // this.form.reset();
          ddUtils.navigateBack();
        }
      }
    });
  },
  // 点击确定
  async bindSaveTap(e) {
    console.log(e);
    console.log(this.form)
    const params = await this.form.submit();
    console.log(params)
    // 
    console.log(this.data.projectData.name);
    console.log(this.data.projectId);
    if (this.data.projectId && this.data.projectData.name) {
      dd.navigateTo({
        url: '/pages/work/page/progressDetail/progressDetail?id=' + this.data.projectId + '&name=' + this.data.projectData.name,
      })
    } else {
      ddUtils.showModal({
        content: "请选择项目",
        success: res => {
        }
      });
    }
  },
  // 项目名称----组件start
  bindChooseProjectTap: function (e) {
    console.log(e);
    if (this.data.isEdit) return;
    if (this.dialogScreenprojectRef) this.dialogScreenprojectRef._showDialog()
  },
  onSaveDialogScreenprojecteRef: function (ref) {
    console.log(ref);
    this.dialogScreenprojectRef = ref;
  },
  bindChooseProjectCallBack: function (data) {
    console.log(data);
    this.setData({
      projectData: data || {},
      projectLeader: data.projectLeaderName,
      affiliateUnit: data.affiliatedUnitName,
      projectId: data.projectId || ''
    });
    this.form.setFieldValue('projectId', data.projectId)
    console.log(this.data.projectData, 'this.data.projectData');
  },
  // 项目名称----组件end

  getProjectList() {
    request.doPostRequest({
      url: config.API_PROJECT_NAME,
      success: res => {
        res.data.forEach(e => {
          e.label = e.name
          e.value = e.id
        })
        console.log(res.data)
        this.setData({
          projectListOptions: res.data || []
        })
      }
    })
  },
});