import { isEmpty, isEmptyArray, isEqual, isArrayIndexOutOfBounds } from "../../../../utils/utils";
import ddUtils from "../../../../utils/ddUtils";
import config from "../../../../utils/config"
import request from "../../../../utils/request"
const app = getApp();

//筛选OA组织下人员列表
Component({
    mixins: [], // mixins 方便复用代码
    /**
     * 组件的属性列表
     */
    props: {
      showDialog:false,
        title: "选择人员",
        positionBottom: false,
        marginTop: 0,
        multiChoose: false,
        screenDangerousName: "",
        onScreenCallBack: function (chooseList) { }
    },

    tempDataList: [],
    chooseList: [], //[{account: '',headImg: '',userId: '',username: ''}]

    /**
     * 组件的初始数据
     */
    data: {
        // showDialog: false,
        scrollHeight: 0,
        dataList: [],
    },

    //组件创建时触发
    onInit() {
    },

    //组件创建时和更新前触发
    deriveDataFromProps(nextProps) {

    },

    //组件创建完毕时触发
    //此时页面已经渲染，通常在这时请求服务端数据。
    didMount() {
        this.chooseList = [];

        app.getSystemInfo(res => {
            this.setData({
                topHeight: app.globalData.statusBarHeight + app.globalData.navbarHeight,
                scrollHeight: app.globalData.appSystemInfo.screenHeight * 0.65
            });
        });
    },

    //组件更新完毕时触发
    //每次组件数据变更的时候都会调用。
    didUpdate(prevProps, prevData) {

    },

    //组件删除时触发
    //每当组件实例从页面卸载的时候都会触发此回调。
    didUnmount() {

    },

    //组件 js 代码抛出错误时触发
    onError(e) {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        _bindCancelTap: function (e) {
            this._hideDialog();
        },

        _bindTouchMove: function (e) { },

        //bind sure tap
        _bindSureTap: function (e) {
            if (isEmptyArray(this.chooseList)) return;

            this.props.onScreenCallBack(this.chooseList);
            this._hideDialog();
        },

        //bind item tap
        _bindItemTap: function (e) {
            let list = this.data.dataList.concat([]);

            let index = e.currentTarget.dataset.index;
            let item = list[index];

            item.isCheck = !item.isCheck;

            this.setData({
                dataList: list
            });
        },

        bindInputChange: function(value) {
          this.screenDangerousName = value;
      },
      
      onSearchConfirm: function(value) {
        console.log(value)
        this.data.screenDangerousName = value;
        // this._showDialog();
        request.doPostRequest({
          url: config.API_OA_COMPANY_NAME,
          data: {
            username:value
          },
          success: res => {
            console.log(res,111111111);
              let list = res.data || [];

              if (!isEmptyArray(list))
                  list[0].isCheck = true;

              this.tempDataList = JSON.parse(JSON.stringify(list));

              this.setData({
                  showDialog: true,
                  dataList: list
              })
              console.log(this.data.dataList,);
          }
        });
      },
        _bindItemChooseCompanyChange: function (indexArray) {
            if (isEmptyArray(indexArray)) return;

            indexArray.reverse();

            let list = JSON.parse(JSON.stringify(this.data.dataList));

            let i = 0;

            this._getChooseCompanyItem(list[indexArray[i]], indexArray, i, indexArray.length - 1);

            this.setData({
                dataList: list
            });
        },

        _bindItemChooseUserChange: function (indexArray) {
            if (isEmptyArray(indexArray)) return;

            indexArray.reverse();

            let list = JSON.parse(JSON.stringify(this.data.dataList));

            let i = 0;

            let item = this._getChooseUserItem(list[indexArray[i]], indexArray, i, indexArray.length - 2);

            if (!this.props.multiChoose) {
                this.props.onScreenCallBack([item]);
                this._hideDialog();
                return;
            }

            this._addChooseUserList(item);

            this.setData({
                dataList: list
            });
        },

        _getChooseCompanyItem: function (item, indexArray, index, total) {
            if (index < total) {
                index++;
                return this._getChooseCompanyItem(item.organizeList[indexArray[index]], indexArray, index, total);
            }

            item.isCheck = !item.isCheck;

            return item;
        },

        _getChooseUserItem: function (item, indexArray, index, total) {
            if (index < total) {
                index++;

                return this._getChooseUserItem(item.organizeList[indexArray[index]], indexArray, index, total);
            }

            let itemUser = item.staffList[[indexArray[index + 1]]];
            itemUser.isCheck = !itemUser.isCheck;

            return itemUser;
        },

        _addChooseUserList: function (item) {


            if (!this.chooseList) this.chooseList = [];

            for (let i = 0; i < this.chooseList.length; i++) {
                if (isEqual(item.userId, this.chooseList[i].userId)) {
                    this.chooseList.splice(i, 1);
                    break;
                }
            }

            if (item.isCheck)
                this.chooseList.push(item)
        },

        //judge is show dialog
        _isShowDialog() {
            return this.data.showDialog;
        },

        //show modal dialog
        _showDialog: function (defaultValue) {
            if (this._isShowDialog())
                return

            if (!isEmptyArray(this.tempDataList)) {
                this.setData({
                    showDialog: true,
                    dataList: JSON.parse(JSON.stringify(this.tempDataList))
                })
                return;
            }

            request.doPostRequest({
                url: config.API_OA_COMPANY_STAFF_LIST,
                data: {
                 
                },
                success: res => {
                  console.log(res,111111111);
                    let list = res.data || [];

                    if (!isEmptyArray(list))
                        list[0].isCheck = true;

                    this.tempDataList = JSON.parse(JSON.stringify(list));

                    this.setData({
                        showDialog: true,
                        dataList: list
                    })
                    console.log(this.data.dataList,);
                }
            });
        },

        //hide modal dialog
        _hideDialog: function (e) {
            if (!this._isShowDialog())
                return;

            this.setData({
                showDialog: false
            })
        },
    }
})