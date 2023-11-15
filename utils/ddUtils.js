import { isEmpty, isEmptyObject, isEmptyArray, isArrayIndexOutOfBounds, formatTime } from "./utils.js"

//显示 toast
function showToast(obj) {
    let option = Object.assign({
        duration:600,
        icon: 'none'
    }, obj);

    if (isEmpty(option.title))
        return;

    if (typeof option.title === "number") {
        option.title = option.title.toString();
    }

    dd.showToast({
        content: option.title,
        duration: option.duration
    })
}

//弹出对话框
function showAlert(obj) {
    let option = Object.assign({
        title: "提示",
        buttonText: "确定",
        content: ""
    }, obj);

    if (isEmpty(option.content)) {
        showToast({
            title: "modal content null"
        });
        return;
    }

    dd.alert({
        title: option.title,
        buttonText: option.buttonText,
        content: option.content,
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            showToast({
                title: res.errMsg
            });
        }
    });
}

//弹出对话框
function showModal(obj) {
    let option = Object.assign({
        title: "提示",
        confirmText: "确定",
        cancelText: "取消"
    }, obj);

    if (isEmpty(option.content)) {
        showToast({
            title: "modal content null"
        });
        return;
    }
    dd.confirm({
        title: option.title,
        content:option.content,
        confirmButtonText: option.confirmText,
        cancelButtonText: option.cancelText,
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            showToast({
                title: res.errMsg
            });
        }
    });
}

//显示 loading
function showLoading(obj) {
    let app = getApp();

    if (app.globalData.showLoading) return;

    app.globalData.showLoading = true;

    let option = Object.assign({
        title: "加载中",
        mask: true
    }, obj);

    if (typeof option.mask != "Boolean") {
        option.mask = true;
    }

    dd.showLoading({
        title: option.title,
        mask: option.mask
    });
}

//隐藏 loading
function hideLoading() {
    let app = getApp();

    if (!app.globalData.showLoading) return;

    app.globalData.showLoading = false;

    dd.hideLoading();
}

function setTabBarItem(obj) {
    if (isEmptyObject(obj)) return;

    dd.setTabBarItem({
        index: obj.index,
        text: obj.text,
        iconPath: obj.iconPath,
        selectedIconPath: obj.selectedIconPath,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: res.errMsg
                });
            }
        }
    })
}

//页面返回
function navigateBack(obj) {
    let option = Object.assign({
        delta: obj || 1
    }, obj);
    dd.navigateBack({
        delta: option.delta,
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            if (typeof option.fail == "function") {
                option.fail(res);
            } else {
                showToast({
                    title: res.errMsg
                });
            }
        }
    });
}

//页面跳转
function navigateTo(obj) {
    if (isEmpty(obj.url)) {
        showToast({
            title: "页面url不能为空!"
        });
        return;
    }

    dd.navigateTo({
        url: obj.url,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: "页面url错误！"
                });
            }
        }
    });
}

function redirectTo(obj) {
    if (isEmpty(obj.url)) {
        showToast({
            title: "页面url不能为空!"
        });
        return;
    }

    dd.redirectTo({
        url: obj.url,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: "页面url错误！"
                });
            }
        }
    });
}

function reLaunch(obj) {
    if (isEmpty(obj.url)) {
        showToast({
            title: "页面url不能为空!"
        });
        return;
    }

    dd.reLaunch({
        url: obj.url,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: "页面url错误！"
                });
            }
        }
    })
}

function switchTab(obj) {
    if (isEmpty(obj.url)) {
        showToast({
            title: "页面url不能为空!"
        });
        return;
    }

    dd.switchTab({
        url: obj.url,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: "页面url错误！"
                });
            }
        }
    })
}

function chooseImage(obj) {
    let option = Object.assign({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album']
    }, obj);

    dd.chooseImage({
        count: option.count,
        sourceType: option.sourceType, // 可以指定来源是相册还是相机，默认二者都有,['album'], ['camera']
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: error => {
            if (typeof option.fail == "function") {
                obj.fail(res);
            } else if (error.errMsg !== "chooseImage:fail cancel") {
                showToast({
                    title: error.errMsg
                });
            }
        }
    });
}

function previewImage(obj) {
    if (isEmptyArray(obj.urls)) {
        showToast({
            title: "暂无图片!"
        });
        return;
    }

    if (isEmpty(obj.current)) {
        obj.current = obj.urls[0];
    }

    dd.previewImage({
        current: obj.current, //下标
        urls: obj.urls,
        success: res => { },
        fail: error => {
            showToast({
                title: error.errMsg
            });
        }
    });
}


function previewVideo(obj){
 
    if (isEmpty(obj.url)) {
        showToast({
            title: "暂无视频!"
        });
        return;
    }

   navigateTo({
          url: `/pages/more/video-page/video-page?name=${obj.title || '查看视频' }&url=` + obj.url
    });
}

//录视屏
function chooseVideo(obj) {
    let option = Object.assign({
        camera: "back",
        maxDuration: 60,
        compressed: true,
        sourceType: ['album', 'camera']
    }, obj);

    dd.chooseVideo({
        camera: option.camera,
        maxDuration: option.maxDuration,
        compressed: option.compressed,
        sourceType: option.sourceType,
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: error => {
            if (typeof option.fail == "function") {
                obj.fail(res);
            } else if (error.errMsg !== "chooseVideo:fail cancel") {
                showToast({
                    title: error.errMsg
                });
            }
        }
    })
}

function showActionSheet(obj) {
    let option = Object.assign({
        title: "",
        cancelButtonText: "取消"
    }, obj);

    dd.showActionSheet({
        title: option.title,
        items: option.itemList, //['','']
        cancelButtonText: option.cancelButtonText,
        success: res => { //res.index === -1是取消按钮
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: error => {
            if (typeof option.fail == "function") {
                option.fail(res);
            }
        }
    })
}

function makePhoneCall(obj) {
    if (isEmpty(obj.phoneNumber)) {
        showToast({
            title: "不能拨打空号码!"
        });
        return;
    }

    dd.makePhoneCall({
        phoneNumber: obj.phoneNumber,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: error => {
            if (error.errMsg == "makePhoneCall:fail cancel") {
                return;
            }
            showToast({
                title: error.errMsg
            });
        }
    })
}

function saveImageToPhotosAlbum(obj) {
    let option = Object.assign({
        filePath: ""
    }, obj);

    if (isEmpty(option.filePath)) {
        showToast({
            title: "文件路径错误"
        });

        return;
    }

    dd.saveImageToPhotosAlbum({
        filePath: option.filePath,
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            } else {
                showToast({
                    title: "成功保存到相册"
                });
            }
        },
        fail: res => {
            if (typeof option.fail == "function") {
                option.fail(res);
            } else {
                showToast({
                    title: "保存失败"
                });
            }
        }
    });
}

//存储到钉盘
function saveFileToDingTalk(obj) {
    if (isEmpty(obj.url)) {
        showToast({
            title: "url null"
        });
        return;
    }

    let option = Object.assign({
        name: formatTime(new Date()),
    }, obj);

    dd.saveFileToDingTalk({
        url: option.url,
        name: option.name,
        success(res) {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            if (typeof option.fail == "function") {
                option.fail(res);
            } else {
                showToast({
                    title: JSON.stringify(res)
                });
            }
        }
    });
}

function optionsSelect(obj) {
    let option = Object.assign({
        title: "选择",
        optionsOne: [],
        optionsTwo: [],
        selectedOneIndex: 0,
        selectedTwoIndex: "",
        positiveString: "确定",
        negativeString: "取消"
    }, obj);

    dd.optionsSelect({
        title: option.title,
        optionsOne: option.optionsOne,

        positiveString: option.positiveString,
        negativeString: option.negativeString,
        success(res) {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            if (typeof option.fail == "function") {
                option.fail(res);
            } else {
                showToast({
                    title: "optionsSelect fail!"
                });
            }
        }
    });
}

function clearLoginStorage(obj) {
    let option = Object.assign({}, obj);

    let app = getApp();

    app.globalData.userToken = "";
    app.globalData.userInfo = {};

    dd.clearStorage({
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            if (typeof option.fail == "function") {
                option.fail(res);
            }
        },
        complete: res => {
            if (typeof option.complete == "function") {
                option.complete(res);
            }
        }
    });
}

function getFileInfo() {
    if (isEmpty(obj.filePath)) {
        showToast({
            title: "文件路径不能为空"
        });
        return;
    }

    dd.getFileInfo({
        apFilePath: obj.filePath,
        digestAlgorithm: "md5", //摘要算法，支持 md5 和 sha1，默认为 md5。
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: res.errMsg
                });
            }
        },
        complete: res => {
            if (typeof obj.complete == "function") {
                obj.complete(res);
            }
        }
    })
}

function getStorage(obj) {
    if (isEmpty(obj.key)) {
        showToast({
            title: "key不能为空"
        });
        return;
    }

    dd.getStorage({
        key: obj.key,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: res.errMsg
                });
            }
        },
        complete: res => {
            if (typeof obj.complete == "function") {
                obj.complete(res);
            }
        }
    })
}

function setStorage(obj) {
    if (isEmpty(obj.key)) {
        showToast({
            title: "key不能为空"
        });
        return;
    }

    if (isEmpty(obj.data)) {
        showToast({
            title: "data不能为空"
        });
        return;
    }

    dd.setStorage({
        key: obj.key,
        data: obj.data,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                showToast({
                    title: res.errMsg
                });
            }
        },
        complete: res => {
            if (typeof obj.complete == "function") {
                obj.complete(res);
            }
        }
    })
}

//同步
function getStorageSync(obj) {
    if (isEmpty(obj.key)) {
        showToast({
            title: "key不能为空"
        });
        return;
    }

    try {
        let value = dd.getStorageSync({ key: obj.key }).data;

        if (value) {
            if (typeof obj.success == "function") {
                obj.success(value);
            }
        } else {
            if (typeof obj.fail == "function") {
                obj.fail(value);
            }
        }
    } catch (e) {
        if (typeof obj.fail == "function") {
            obj.fail(e);
        }
    }
}

//同步
function setStorageSync(obj) {
    if (isEmpty(obj.key)) {
        showToast({
            title: "key不能为空"
        });
        return;
    }

    if (isEmpty(obj.data)) {
        showToast({
            title: "data不能为空"
        });
        return;
    }

    try {
        dd.setStorageSync({
            key: obj.key,
            data: obj.data
        });
        if (typeof obj.success == "function") {
            obj.success();
        }
    } catch (e) {
        if (typeof obj.fail == "function") {
            obj.fail(e);
        }
    }
}

//打开另外小程序
function navigateToMiniProgram(obj) {
    let option = Object.assign({
        appId: null,
        path: "",
        extraData: {}
    }, obj);

    if (isEmpty(option.appId)) {
        showToast({
            title: "appid null"
        });
        return;
    }

    dd.navigateToMiniProgram({
        appId: option.appId,
        path: option.path,
        extraData: option.extraData,
        success: res => {

        },
        fail: res => {
            if (res.errMsg == "navigateToMiniProgram:fail cancel") {
                return;
            }
            showToast({
                title: "打开小程序失败, " + res.errMsg
            });
        }
    })
}

//支付
function requestPayment(obj) {
    if (isEmptyObject(obj)) {
        showToast({
            title: "pay obj null"
        });
        return;
    }

    dd.requestPayment({
        timeStamp: obj.timeStamp,
        nonceStr: obj.nonceStr,
        package: obj.package,
        signType: obj.signType,
        paySign: obj.paySign,
        success: res => {
            if (typeof obj.success == "function") {
                obj.success(res);
            }
        },
        fail: res => {
            if (typeof obj.fail == "function") {
                obj.fail(res);
            } else {
                if (res.errMsg == "requestPayment:fail cancel") {
                    alert({
                        content: "支付失败, 用户取消",
                        success: resModal => {

                        }
                    });
                }
            }
        }
    })
}

function getSetting(obj) {
    let option = Object.assign({
        authName: ''
    }, obj);

    //scope值： location album camera alipaysports phoneNumber aliaddress userInfo

    dd.getSetting({
        success: res => { //res: {}, 用户授权结果，其中 key 为 scope 值，value 为 Boolean 值，表示用户是否允许授权
            if (!res[option.authName]) {
                dd.authorize({
                    scope: option.authName,
                    success(resAuth) {
                        if (typeof option.success == "function") {
                            option.success(resAuth);
                        }
                    },
                    fail: resAuth => {
                        if (typeof option.authFail == "function") {
                            option.authFail(resAuth);
                            return;
                        }
                        showToast({
                            title: "授权失败"
                        });
                    }
                });
            } else {
                if (typeof option.success == "function") {
                    option.success(res);
                }
            }
        },
        fail: res => {
            if (typeof option.fail == "function")
                option.fail(res);
        }
    });
}

//定位
function getLocation(obj) {
    let option = Object.assign({
        type: "0", //默认0. 0：获取经纬度。 1：获取经纬度和详细到区县级别的逆地理编码数据。
        altitude: false
    }, obj);

    getSetting({
        authName: "location",
        success: resAuth => {
            dd.getLocation({
                type: option.type,
                altitude: option.altitude,
                success: res => {
                    if (typeof option.success == "function") {
                        option.success(res);
                    }
                },
                fail: res => {
                    if (typeof option.fail == "function") {
                        option.fail(res);
                    } else {
                        if (res.errMsg == "getLocation:fail auth deny") {
                            res.errMsg = "取消授权";
                        }

                        showToast({
                            title: res.errMsg
                        });
                    }
                },
                complete: res => {
                    if (typeof option.complete == "function") {
                        option.complete(res);
                    }
                }
            })
        },
        authFail: resAuth => {
            if (typeof option.authFail == "function") {
                option.authFail(resAuth);
            }
        },
        fail: resAuth => {
            if (typeof option.fail == "function") {
                option.fail(resAuth);
            }
        }
    });
}


function chooseLocation(obj) {
    let option = Object.assign({
        latitude: 0,
        longitude: 0,
    }, obj);

    getSetting({
        authName: "location",
        success: resAuth => {
            dd.chooseLocation({
                latitude: option.latitude,
                longitude: option.longitude,
                success: res => {
                    if (typeof option.success == "function") {
                        option.success(res);
                    }
                },
                fail: res => {
                    if (typeof option.fail == "function") {
                        option.fail(res);
                    } else {
                        if (res.errMsg == "getLocation:fail auth deny") {
                            res.errMsg = "取消授权";
                        }

                        showToast({
                            title: res.errMsg
                        });
                    }
                },
                complete: res => {
                    if (typeof option.complete == "function") {
                        option.complete(res);
                    }
                }
            })
        },
        fail: res => {

        }
    })
}

function openLocation(obj) {
    let option = Object.assign({
        latitude: 0,
        longitude: 0,
    }, obj);

    dd.openLocation({
        latitude: option.latitude,
        longitude: option.longitude,
        name: option.name,
        address: option.address,
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            if (typeof option.fail == "function") {
                option.fail(res);
            } else {
                if (res.errMsg == "getLocation:fail auth deny") {
                    res.errMsg = "取消授权";
                }

                showToast({
                    title: res.errMsg
                });
            }
        },
        complete: res => {
            if (typeof option.complete == "function") {
                option.complete(res);
            }
        }
    })
}

function scanCode(obj) {
    let option = Object.assign({
        onlyFromCamera: false,
        scanType: ['barCode', 'qrCode']
    }, obj);

    dd.scanCode({
        onlyFromCamera: true,
        success: res => {
            if (typeof option.success == "function") {
                option.success(res);
            }
        },
        fail: res => {
            if (typeof option.fail == "function") {
                option.fail(res);
            } else {
                if (res.errMsg === "scanCode:fail cancel") return;
                showToast({
                    title: res.errMsg
                });
            }
        },
        complete: res => {
            if (typeof option.complete == "function") {
                option.complete(res);
            }
        }
    })
}

function setClipboardData(obj) {
    dd.setClipboardData({
        data: obj.data,
        success: res => {
            if (typeof obj.success == "function")
                obj.success(res);
        },
        fail: res => {
            if (typeof obj.fail == "function")
                obj.fail(res);
            else
                showToast({
                    title: res.errMsg
                });
        },
        complete: res => {
            if (typeof obj.complete == "function")
                obj.complete(res);
        }
    })
}

function getClipboardData() {
    dd.getClipboardData({
        success: res => {
            if (typeof obj.success == "function")
                obj.success(res);
        },
        fail: res => {
            if (typeof obj.fail == "function")
                obj.fail(res);
            else
                showToast({
                    title: res.errMsg
                });
        },
        complete: res => {
            if (typeof obj.complete == "function")
                obj.complete(res);
        }
    })
}

//pageScrollTo
function pageScrollTo(obj) {
    let option = Object.assign({
        duration: 300
    }, obj);

    dd.pageScrollTo({
        scrollTop: option.scrollTop,
        duration: option.duration,
        selector: option.selector,
        success: res => {
            if (typeof option.success == "function")
                option.success(res);
        },
        fail: res => {
            if (typeof option.fail == "function")
                option.fail(res);
        },
        complete: res => {
            if (typeof option.complete == "function")
                option.complete(res);
        }
    })
}

/**
 * 相机权限
 */
function getVideoRecordAuth(obj) {
    dd.authorize({
        scope: "scope.camera",
        success: res => {
            dd.authorize({
                scope: "scope.record",
                success() {
                    if (typeof obj.success == "function")
                        obj.success(res);
                },
                fail: function () {
                    if (typeof obj.fail == "function")
                        obj.fail(res);
                    else
                        showToast({
                            title: "您未允许使用录音权限"
                        })
                },
                complete: function () { }
            })
        },
        fail: res => {
            if (typeof obj.fail == "function")
                obj.fail(res);
            else
                showToast({
                    title: "您未允许使用摄像头权限"
                })
        },
        complete: res => {
            if (typeof obj.complete == "function")
                obj.complete(res);
        }
    })
}

function openSetting(obj) {
    let option = Object.assign({
        withSubscriptions: false,
        authName: ""
    }, obj);

    dd.openSetting({
        withSubscriptions: option.withSubscriptions,
        success: res => {
            if (!isEmpty(option.authName) && res.authSetting[option.authName]) {
                if (typeof option.success == "function") {
                    option.success(res);
                }
            } else {
                if (typeof option.fail == "function") {
                    option.fail(res);
                }
            }
        },
        fail: res => {
            console.log("openSetting fail", res)
            if (typeof option.fail == "function") {
                option.fail(res);
            }
        }
    });
}

function judgeIsLogin(toLogin) {
    if (typeof toLogin != "boolean") {
        toLogin = true;
    }

    let app = getApp();

    if (isEmpty(app.globalData.userToken)) {
        app.globalData.userToken = getStorageS({
            key: app.globalData.keyUserToken
        });

        if (isEmpty(app.globalData.userToken)) {
            if (toLogin) {
                navigateTo({
                    url: "/pages/user/page/login/index"
                })
            }

            return false;
        }
    }

    return true;
}

function showEmptyArrayTips(list, tips) {
    if (isEmptyArray(list)) {
        showToast({
            title: tips
        })
        return true;
    }

    return false;
}

function showEmptyArrayIndexOutOfBoundsTips(array, index, tips) {
    if (isArrayIndexOutOfBounds(array, index)) {
        showToast({
            title: tips
        })
        return true;
    }

    return false;
}

function showEmptyToastTips(value, tips) {
    if (isEmpty(value)) {
        showToast({
            title: tips
        })
        return true;
    }

    return false;
}

function showEmptyModalTips(value, content, isNavBack) {
    if (typeof isNavBack != "boolean")
        isNavBack = true;

    if (isEmpty(value)) {
        showAlert({
            content: content,
            success: resModal => {
                if (isNavBack) navigateBack();
            }
        })
        return true;
    }

    return false;
}

module.exports = {
    showToast,
    showModal,
    showAlert,
    showActionSheet,
    switchTab,
    navigateBack,
    navigateTo,
    redirectTo,
    reLaunch,
    showLoading,
    hideLoading,
    previewImage,
    previewVideo,
    chooseImage,
    chooseVideo,
    makePhoneCall,
    getSetting,
    saveImageToPhotosAlbum,
    saveFileToDingTalk,
    getFileInfo,
    optionsSelect,
    setStorage,
    setStorageSync,
    getStorage,
    getStorageSync,
    clearLoginStorage,
    setTabBarItem,
    requestPayment,
    navigateToMiniProgram,
    getLocation,
    chooseLocation,
    openLocation,
    scanCode,
    setClipboardData,
    getClipboardData,
    pageScrollTo,
    getVideoRecordAuth,
    openSetting,
    showEmptyToastTips,
    showEmptyModalTips,
    showEmptyArrayTips,
    showEmptyArrayIndexOutOfBoundsTips,
    judgeIsLogin
}