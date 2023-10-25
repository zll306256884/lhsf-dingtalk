import { API_IMG_URL } from '../utils/config'
import { MD5 } from '../common/libs/md5.js';
import { SHA1 } from '../common/libs/sha1.js';

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeToDay = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const getTimestamp = date => {
    if (!date) {
        date = new Date();
    }
    return Date.parse(date) / 1000
}

const getTimestamToDate = str => {
    console.log(new Date(str * 1000))
    if (isEmpty(str))
        return formatTime(new Date())
    else
        return formatTime(new Date(str * 1000))
}

const getTimestampByStr = str => {
    if (isEmpty(str))
        return Date.parse(new Date()) / 1000
    else
        return Date.parse(new Date(str)) / 1000
}

const getCurrentTimeToDay = () => {
    let date = new Date();

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-');
}

const getCurrentTime = () => {
    let date = new Date();

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getZhDate = time => {
    let date = new Date(time);

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return formatNumber(year) + "年" + formatNumber(month) + "月" + formatNumber(day) + "日";
}

const dateAddDayTimeToDay = (date, days) => {
    if (!date) {
        date = new Date();
    }

    date.setDate(date.getDate() + parseInt(days));

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-');
}

const getYears = (start, end) => {
    start = isEmpty(start) ? 1900 : start;
    end = isEmpty(end) ? new Date().getFullYear() : end;

    let years = [];

    for (let i = start; i <= end; i++) {
        years.push(i)
    }

    return years;
}

const getMonths = () => {
    let months = [];

    for (let i = 1; i <= 12; i++) {
        months.push(i)
    }

    return months;
}

const getDays = (year, month) => {
    month = parseInt(month);

    let dayCount = 0;
    let days = [];

    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            dayCount = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            dayCount = 30;
            break;
        case 2:
            dayCount = 28;
            if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                dayCount = 29;
            }
            break;
        default:
            break;
    }

    for (let i = 1; i <= dayCount; i++) {
        days.push(i)
    }

    return days;
}

const getHours = () => {
    let arr = [];

    for (let i = 0; i < 24; i++) {
        arr.push(i)
    }

    return arr;
}

const getMinutes = () => {
    let arr = [];

    for (let i = 0; i < 60; i++) {
        arr.push(i)
    }

    return arr;
}

const getSeconds = () => {
    let arr = [];

    for (let i = 0; i < 60; i++) {
        arr.push(i)
    }

    return arr;
}

//判断两个值相等
function isEqual(current, target) {
    if (typeof current == "undefined" || current == null || typeof target == "undefined" || target == null) {
        return false;
    }

    return current.toString() === target.toString();
}

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

//判断字符是否为空的方法
function isEmptyObject(obj) {
    if (typeof obj === "undefined" || obj === null || obj === "" || obj === "null" || obj === "undefined") {
        return true;
    }

    return Object.keys(obj).length === 0;
}

//是否为空数组
function isEmptyArray(obj) {
    if (typeof obj == "undefined" || obj == null || obj === "") {
        return true;
    }

    return Object.prototype.toString.call(obj) !== '[object Array]' || obj.length <= 0;
}

//是否数组越界
function isArrayIndexOutOfBounds(obj, pos) {
    if (isEmptyArray(obj)) {
        return true;
    }

    return obj.length <= pos || pos < 0;
}

//是否数组越界
function getArrayLength(arr) {
    if (isEmptyArray(arr)) {
        return 0;
    }

    return arr.length;
}

function getUndefineConvertEmpty(value) {
    if (typeof value == "undefined" || value == null || value == "null") {
        return "";
    }

    return value;
}

function isPhone(value) {
    if (isEmpty(value)) {
        return false;
    }

    let reg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;

    return reg.test(value)
}

function isEmail(value) {
    if (isEmpty(value)) {
        return false;
    }

    let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

    return reg.test(value)
}

function isNumber(value) {
    return /^\d+$/.test(value);
}

//替换掉字符串中所有的非int字段
function getNumber(value) {
    if (isEmpty(value)) {
        return 0;
    }

    let reg = /[^0-9]/g;

    return value.toString().replace(reg, "");
}

function isInt(value) {
    return /^-?\d+$/.test(value);
}

function isPositiveIntNumber(value) {
    return /^[1-9]\d*$/.test(value);
}

function isDecimal(value) {
    return /^\d+\.\d+$/.test(value);
}

function getString(value) {
    return isEmpty(value) ? '' : value.toString();
}

function getParseInt(value) {
    if (isEmpty(value)) {
        return 0;
    }

    let res = parseInt(value);

    return isNaN(res) ? 0 : res;
}

function getParseFloat(value) {
    if (isEmpty(value)) {
        return 0;
    }

    let res = parseFloat(value);

    return isNaN(res) ? 0 : res.toFixed(2);
}

function getStrLength(value) {
    if (isEmpty(value)) {
        return 0;
    }

    return value.length;
}

function split(str, symbol) {
    if (isEmpty(str) || isEmpty(symbol)) {
        return [];
    }

    return str.split(symbol)
}

function SHA1MD5(str) {
    if (isEmpty(str)) {
        return "";
    }

    return SHA1(MD5(str));
}

function isArrayContains(arr, value) {
    if (isEmptyArray(arr) || isEmpty(value)) return false;

    return arr.indexOf(value) > -1;
}

function isArrayContain2(array, value) {
    if (isEmptyArray(array)) return false;

    for (var i = 0; i < array.length; i++) {
        if (isEqual(array[i], value)) return true;
    }

    return false;
}

function isMoney(str) {
    //判断字符串如果是整数不能以0开头后面加正整数，如果是浮点数整数部分不能为两个0：如00.00，如果是整数，
    let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

    if (reg.test(str)) {
        return true;
    }

    return false;
}


function addMoney(num1, num2) {
    num1 = isMoney(num1) ? num1 : 0;
    num2 = isMoney(num2) ? num2 : 0;

    return Math.round(num1 * 100 + num2 * 100) / 100;
}

function subMoney(num1, num2) {
    num1 = isMoney(num1) ? num1 : 0;
    num2 = isMoney(num2) ? num2 : 0;

    return Math.round(num1 * 100 - num2 * 100) / 100;
}

function mulMoney(num1, num2) {
    num1 = isMoney(num1) ? num1 : 0;
    num2 = isMoney(num2) ? num2 : 0;

    return (Math.round((num1 * 100) * (num2 * 100)) / 10000).toFixed(2);
}

function divMoney(num1, num2) {
    num1 = isMoney(num1) ? num1 : 0;
    num2 = isMoney(num2) ? num2 : 0;

    return num2 === 0 ? 0 : getParseFloat((num1 * 100) / (num2 * 100));
}

function formatMoney(num) {
    num = isMoney(num) ? num : 0;

    return Math.round(num * 100) / 100;
}

function colorHexToRGBA(colorHex, alpha) {
    if (isEmpty(colorHex)) return colorHex;

    alpha = getParseFloat(alpha);
    alpha = Math.min(1, alpha);
    alpha = Math.max(0, alpha);

    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    let color = colorHex.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return "RGB(" + colorChange.join(",") + "," + alpha + ")";
    } else {
        return color;
    }
}

/** 
 * Js对象按ASCII码排序
 */
function sort_ASCII(objArray) {
    if (isEmpty(objArray)) {
        return "";
    }

    let arr = Object.keys(objArray);

    let sortArr = arr.sort();

    let sortStr = "";

    for (let i in sortArr) {
        sortStr += sortArr[i];
        sortStr += objArray[sortArr[i]];
    }

    return sortStr;
}

function getQueryString(url, name) {
    let reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    let r = url.substr(1).match(reg);
    if (r != null) {
        return r[2];
    }
    return "";
}

/**
 * 判断是否有更多数据
 */
function isHasMore(list) {
    return !isEmptyArray(list) && list.length >= 10;
}


// 根据出生日期计算年龄周岁
function getAge(strBirthday) {
    var returnAge = '1';

    if (isEmpty(strBirthday)) return returnAge;

    var mouthAge = '';
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];
    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    if (nowYear == birthYear) {
        // returnAge = 0; //同年 则为0岁
        var monthDiff = nowMonth - birthMonth; //月之差 
        if (monthDiff < 0) { } else {
            mouthAge = monthDiff + '个月';
        }
    } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay; //日之差 
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                var monthDiff = nowMonth - birthMonth; //月之差 
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    mouthAge = monthDiff + '个月';
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
        }
    }

    return returnAge; //返回周岁年龄
    //return returnAge + mouthAge; //返回周岁年龄+月份
}

function checkIDCode(val) {
    if (checkProv(val)) return false;
    if (checkDate(val)) return false;

    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    var code = val.substring(17);
    if (p.test(val)) {
        var sum = 0;
        for (var i = 0; i < 17; i++) {
            sum += val[i] * factor[i];
        }
        if (parity[sum % 11] == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}

function checkProv(val) {
    var pattern = /^[1-9][0-9]/;
    var provs = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门"
    };
    if (pattern.test(val)) {
        if (provs[val]) {
            return true;
        }
    }
    return false;
}

function checkDate(val) {
    var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    if (pattern.test(val)) {
        var year = val.substring(0, 4);
        var month = val.substring(4, 6);
        var date = val.substring(6, 8);
        var date2 = new Date(year + "-" + month + "-" + date);
        if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
            return true;
        }
    }
    return false;
}

function getImgUrl(url) {
    if (isEmpty(url)) return "/images/icon_empty.png";
    if (/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) return url;

    return API_IMG_URL + url;
}

function getImgIcon(url) {
    if (isEmpty(url)) return "";

    let index = url.lastIndexOf(".");
    //后缀
    let ext = url.substr(index + 1);

    if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) != -1) {//图片
        return url;
    } else if (['pdf'].indexOf(ext.toLowerCase()) != -1) {//pdf
        return "/images/icon_file_pdf.png";
    } else if (['doc', 'docx'].indexOf(ext.toLowerCase()) != -1) {//word
        return "/images/icon_file_word.png";
    } else if (['ppt', 'pptx'].indexOf(ext.toLowerCase()) != -1) {//ppt
        return "/images/icon_file_ppt.png";
    } else if (['xls', 'xlsx'].indexOf(ext.toLowerCase()) != -1) {//excel
        return "/images/icon_file_excel.png";
    } else if (['txt'].indexOf(ext.toLowerCase()) != -1) {//txt
        return "/images/icon_file_txt.png";
    }

    return "/images/icon_file_other.png";
}


module.exports = {
    formatTime,
    formatTimeToDay,
    getTimestamp,
    getTimestamToDate,
    getTimestampByStr,
    getCurrentTime,
    getCurrentTimeToDay,
    dateAddDayTimeToDay,
    getZhDate,
    getYears,
    getMonths,
    getDays,
    getHours,
    getMinutes,
    getSeconds,
    isEqual,
    isNull,
    isEmpty,
    isEmptyObject,
    isEmptyArray,
    isArrayIndexOutOfBounds,
    isPhone,
    isEmail,
    isNumber,
    getNumber,
    isInt,
    isPositiveIntNumber,
    getArrayLength,
    isDecimal,
    isArrayContains,
    isArrayContain2,
    isMoney,
    addMoney,
    subMoney,
    mulMoney,
    divMoney,
    formatMoney,
    getUndefineConvertEmpty,
    getString,
    getParseInt,
    getParseFloat,
    getStrLength,
    split,
    colorHexToRGBA,
    sort_ASCII,
    SHA1MD5,
    isHasMore,
    MD5,
    getQueryString,
    checkProv,
    checkIDCode,
    checkDate,
    getAge,
    getImgUrl,
    getImgIcon
}