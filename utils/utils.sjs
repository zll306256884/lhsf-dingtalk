//判断字符是否为空的方法
function isNull(obj) {
    if (typeof obj == "undefined" || obj == null || obj === "null" || obj === "undefined") {
        return true;
    }

    return false;
}

function isEmpty(obj) {
    if (typeof obj == "undefined" || obj === null || obj === "" || obj === "null" || obj === "undefined") {
        return true;
    }

    return false;
}

function isEmptyArray(obj) {
    if (typeof obj == "undefined" || obj == null || obj.length <= 0) {
        return true;
    }
}

function split(str, symbol) {
    if (isEmpty(str) || isEmpty(symbol)) {
        return [];
    }

    return str.split(symbol)
}

function getIndexUrlBySplitComma(str, index) {
    if (isEmpty(str)) {
        return '';
    }

    index = getParseInt(index);

    var array = str.split(',');

    return isArrayIndexOutOfBounds(array, index) ? '' : array[index];
}

function isEqual(current, target) {
    if (typeof current == "undefined" || current == null || typeof target == "undefined" || target == null) {
        return false;
    }

    return current.toString() === target.toString();
}

//判断字符是否为空的方法
function isEmptyObject(obj) {
    if (typeof obj === "undefined" || obj === null || obj === 'null' || obj === 'undefined') {
        return true;
    }

    return false;
}

//是否为空数组
function isEmptyArray(obj) {
    if (typeof obj == "undefined" || obj == null || obj === "") {
        return true;
    }

    return obj.length <= 0;
}

//是否数组越界
function isArrayIndexOutOfBounds(obj, pos) {
    if (isEmptyArray(obj)) {
        return true;
    }

    return obj.length <= pos || pos < 0;
}

function subStrMethod(str) {
    return isEmpty(str) ? "" : str.substring(0, 1);
}

function getParseInt(obj) {
    if (isEmpty(obj)) {
        return 0;
    }

    var res = parseInt(obj);

    return isNaN(res) ? 0 : res;
}

function getParseFloat(obj) {
    if (isEmpty(obj)) {
        return 0;
    }

    var res = parseFloat(obj);

    return isNaN(res) ? 0 : res.toFixed(2);
}

function isPositiveInt(obj) {
    if (isEmpty(obj)) {
        return false;
    }

    var res = parseInt(obj);

    return isNaN(res) ? false : res > 0;
}

function isNatureInt(obj) {
    if (isEmpty(obj)) {
        return false;
    }

    var res = parseInt(obj);

    return isNaN(res) ? false : res >= 0;
}

function isPositiveFloat(obj) {
    if (isEmpty(obj)) {
        return false;
    }

    var res = parseFloat(obj);

    return isNaN(res) ? false : res > 0;
}

function getEmptyToZero(str) {
    if (isEmpty(str)) {
        return "0";
    }

    return str;
}

function getEmptyTo__(str) {
    if (isEmpty(str)) {
        return "--";
    }

    return str;
}

function getEmptyConvertTips(str) {
    if (isEmpty(str)) return "--";

    return str;
}

function getNullToEmpty(str) {
    if (isNull(str)) return "";

    return str;
}

//转换成大写
function toUpperCase(str) {
    if (isEmpty(str)) {
        return str;
    }

    return str.toUpperCase();
}

//转换成小写
function toLowerCase(str) {
    if (isEmpty(str)) {
        return str;
    }

    return str.toLowerCase();
}

function getListSize(list) {
    if (isEmptyArray(list)) {
        return "0";
    }

    return list.length;
}

function isArrayContains(arr, value) {
    if (isEmptyArray(arr) || isEmpty(value)) return false;

    return arr.indexOf(value) > -1;
}

function isArrayContain(array, value) {
    if (isEmptyArray(array)) return false;

    for (var i = 0; i < array.length; i++) {
        if (isEqual(array[i], value)) return true;
    }

    return false;
}

function getEmptyTo__(str) {
    if (isEmpty(str)) {
        return "--";
    }

    return str;
}

function getImagsPath(urls, params) {
    if (isEmpty(urls)) {
        return "";
    }

    return !isEmpty(params) ? (urls + '/' + params) : urls
}

function replace(str, current, target) {
    if (isEmpty(str) || isEmpty(current) || isEmpty(target)) {
        return str;
    }

    return str.replace(getRegExp(current, 'g'), target);
}

function getMChangeToKM(value) {
    var distance = getParseInt(value);

    if (distance < 1000) {
        return distance + "米";
    }

    return Math.round((distance / 1000) * 10) / 10 + "km";
}

function getNumberOfDays(leftDate, rightDate) {//获得天数
    var date1 = isEmpty(leftDate) ? getDate() : getDate(leftDate);
    var date2 = isEmpty(rightDate) ? getDate() : getDate(rightDate);

    //date1：开始日期，date2结束日期
    var a1 = date1.getTime();
    var a2 = date2.getTime();

    var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数

    return Math.max(day + 1, 0)
};

function getListNameJoinStr(list, str, maxLength) {
    var result = "";

    if (isEmptyArray(list)) return result;

    var length = isNatureInt(maxLength) ? maxLength : list.length;

    for (var i = 0; i < length; i++) {
        result += list[i].name;

        if (i < length - 1) result += str;
    }

    return result;
}

//获取资质管理status: 状态 0-过期 1-正常 2-无需监管
function getQulificationManageStatusName(status) {
    if (isEqual(status, '0')) {
        return "过期";
    } else if (isEqual(status, '1')) {
        return "正常";
    } else if (isEqual(status, '2')) {
        return "无需监管";
    }

    return "--";
}

function getImgUrl(url) {
    if (isEmpty(url)) return "/images/icon_empty.png";
    if (getRegExp('(http|https):\/\/([\w.]+\/?)', 'g').test(url)) return url;

    return "" + url;
}




//------待办任务
//任务类型（1单次处理，2协作审图，3协作编辑，4会议待办）
function getTaskType(value) {
    if (isEqual(value, '1')) {
        return "单次处理";
    } else if (isEqual(value, '2')) {
        return "协作审图";
    } else if (isEqual(value, '3')) {
        return "协作编辑";
    } else if (isEqual(value, '4')) {
        return "会议待办";
    }

    return "--";
}

//获取模块,（1报批，2招采，3会议，4设计，5投控，6综合，7生态伙伴，8档案，9总控，10监理，11督办）
function getTaskModuleName(value) {
    return   ['','报批','招采','会议','设计','投控','综合','生态伙伴','档案','总控','监理','督办'][value] || '--'
}

//任务提醒,1准时，2提前5分钟，3提前15分，4提前30分，5提前1小时，6提前2小时，7提前1天）
function getTaskReminderTime(value) {
    if (isEqual(value, '1')) {
        return "准时";
    } else if (isEqual(value, '2')) {
        return "提前5分钟";
    } else if (isEqual(value, '3')) {
        return "提前15分";
    } else if (isEqual(value, '4')) {
        return "提前30分";
    } else if (isEqual(value, '5')) {
        return "提前1小时";
    } else if (isEqual(value, '6')) {
        return "提前2小时";
    } else if (isEqual(value, '7')) {
        return "提前1天";
    }

    return "--";
}

//任务提醒方式（1站内信，2钉钉，3短信）
function getTaskReminderMode(value) {
    if (isEqual(value, '1')) {
        return "站内信";
    } else if (isEqual(value, '2')) {
        return "钉钉";
    } else if (isEqual(value, '3')) {
        return "短信";
    } 

    return "--";
}

//任务状态（1未激活，2未完成，3已拒绝，4已完成，5已超时，6已取消）
function getTaskStatusName(value) {
    if (isEqual(value, '1')) {
        return "未激活";
    } else if (isEqual(value, '2')) {
        return "未完成";
    } else if (isEqual(value, '3')) {
        return "已拒绝";
    } else if (isEqual(value, '4')) {
        return "已完成";
    } else if (isEqual(value, '5')) {
        return "已超时";
    } else if (isEqual(value, '6')) {
        return "已取消";
    }

    return "--";
}

//------审批管理
//获取模块(1设计，2监理，3总控，4报批，5投控，6招采，7生态伙伴,8档案，9综合，10bim管理)
function getApprovalManageModuleName(value) {
    if (isEqual(value, '1')) {
        return "设计";
    } else if (isEqual(value, '2')) {
        return "监理";
    } else if (isEqual(value, '3')) {
        return "总控";
    } else if (isEqual(value, '4')) {
        return "报批";
    } else if (isEqual(value, '5')) {
        return "投控";
    } else if (isEqual(value, '6')) {
        return "招采";
    } else if (isEqual(value, '7')) {
        return "生态伙伴";
    } else if (isEqual(value, '8')) {
        return "档案";
    } else if (isEqual(value, '9')) {
        return "综合";
    } else if (isEqual(value, '10')) {
        return "bim管理";
    }

    return "--";
}

export default {
    isNull: isNull,
    isEmpty: isEmpty,
    isEmptyArray: isEmptyArray,
    isEmptyObject: isEmptyObject,
    isEqual: isEqual,
    subStrMethod: subStrMethod,
    getParseInt: getParseInt,
    isPositiveInt: isPositiveInt,
    isNatureInt: isNatureInt,
    isPositiveFloat: isPositiveFloat,
    getParseFloat: getParseFloat,
    getImagsPath: getImagsPath,
    getEmptyToZero: getEmptyToZero,
    getEmptyConvertTips: getEmptyConvertTips,
    getListSize: getListSize,
    isArrayContains: isArrayContains,
    getEmptyTo__: getEmptyTo__,
    getNullToEmpty: getNullToEmpty,
    split: split,
    replace: replace,
    isArrayContain: isArrayContain,
    getIndexUrlBySplitComma: getIndexUrlBySplitComma,
    getMChangeToKM: getMChangeToKM,
    toUpperCase: toUpperCase,
    toLowerCase: toLowerCase,
    getListNameJoinStr: getListNameJoinStr,
    getQulificationManageStatusName: getQulificationManageStatusName,
    getImgUrl: getImgUrl,
    getNumberOfDays: getNumberOfDays,
    getTaskType: getTaskType,
    getTaskModuleName: getTaskModuleName,
    getTaskStatusName: getTaskStatusName,
    getTaskReminderMode: getTaskReminderMode,
    getTaskReminderTime: getTaskReminderTime,
    getApprovalManageModuleName: getApprovalManageModuleName,
}