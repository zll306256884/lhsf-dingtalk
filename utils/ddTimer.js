// 发送验证码倒计时
const countDown = function (initObj) {
    this.times = initObj.times || 0;   //倒计时时间
    this.interval = initObj.interval || 1000; //间隔时间
    this.success = initObj.success;  //每执行一次回调
    this.complete = initObj.complete; //倒计时完成回调

    this.timeOut;
}

countDown.prototype = {
    start: function () {
        var that = this;

        function begin() {
            if (that.times <= 0) {//执行结束
                if (that.complete) {
                    that.complete();
                }

                that.stop();
            } else {
                if (that.success) {
                    that.success(that.times);
                }

                that.times -= that.interval;
                that.timeOut = setTimeout(begin, that.interval);
            }
        }

        begin();
    },
    stop: function () {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
    },
}

const timer = function (initObj) {
    this.times = initObj.times || 1000; //起始时间
    this.interval = initObj.interval || 1000; //间隔时间
    this.success = initObj.success;  //每执行一次回调

    this.timeOut;
}

timer.prototype = {
    start: function () {
        var that = this;

        function begin() {
            if (that.success) {
                that.success(that.times);
            }

            that.times += that.interval;
            that.timeOut = setTimeout(begin, that.interval);
        }

        begin();
    },
    stop: function () {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
    },
}

// day hour minute second 
const dataTimer = function (initObj) {
    this.beginDate = initObj.beginDate || new Date();
    this.endDate = initObj.endDate || new Date();
    this.interval = initObj.interval || 1000; //间隔时间
    this.showDay = (typeof initObj.showDay) === "boolean" ? initObj.showDay : false;
    this.success = initObj.success;  //每执行一次回调
    this.fail = initObj.fail; //倒计时完成回调
    this.complete = initObj.complete; //倒计时完成回调

    this.timeOut;
}

dataTimer.prototype = {
    start: function () {
        console.log("time", this.endDate, this.beginDate)
        var that = this;
        //相差毫秒(.replace(/(-)/g, '/')解决ios 不兼容问题)
        let totalDate = new Date(that.endDate.toString().replace(/(-)/g, '/')).getTime() - new Date(that.beginDate.toString().replace(/(-)/g, '/')).getTime();

        if (totalDate <= 0) {
            if (that.fail) {
                that.fail("The finishing time you use should not be longer than the beginning time.");
            }
            return;
        }

        function begin() {
            if (totalDate <= 0) {
                totalDate = 0;
                that.stop();
                if (that.complete) {
                    that.complete();
                }
            } else {
                if (that.success) {
                    that.success(formatDay(totalDate), that.showDay ? formatHour(totalDate) : formatHourAndAddDay(totalDate), formatMinute(totalDate), formatSecond(totalDate));
                }

                totalDate -= that.interval;
                that.timeOut = setTimeout(begin, that.interval);
            }
        }

        begin();
    },
    stop: function () {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
    }
}

function formatDay(millisecond) {
    let day = parseInt(millisecond / 1000 / 60 / 60 / 24, 10);

    let dateFormat = "";

    if (day > 0) {
        if (day < 10) {
            dateFormat += "0";
        }
        dateFormat += day;
    } else {
        dateFormat += "00";
    }

    return dateFormat;
}

function formatHour(millisecond) {
    let hour = parseInt(millisecond / 1000 / 60 / 60 % 24, 10);

    let dateFormat = "";

    if (hour < 10) {
        dateFormat += "0"
    }

    dateFormat += hour;

    return dateFormat;
}

function formatHourAndAddDay(millisecond) {
    let day = parseInt(millisecond / 1000 / 60 / 60 / 24, 10);
    let hour = parseInt(millisecond / 1000 / 60 / 60 % 24, 10);

    hour += Math.max(day, 0) * 24;

    let dateFormat = "";

    if (hour < 10) {
        dateFormat += "0"
    }

    dateFormat += hour;

    return dateFormat;
}

function formatMinute(millisecond) {
    let minute = parseInt(millisecond / 1000 / 60 % 60, 10);
    let dateFormat = "";

    if (minute < 10) {
        dateFormat += "0";
    }

    dateFormat += minute;

    return dateFormat;
}

function formatSecond(millisecond) {
    let second = parseInt(millisecond / 1000 % 60, 10);
    let dateFormat = "";

    if (second < 10) {
        dateFormat += "0";
    }

    dateFormat += second;

    return dateFormat;
}

function formatRecorderTimer(millisecond) {
    let min = parseInt(millisecond / 1000 / 60, 10);
    let second = parseInt(millisecond / 1000 % 60, 10);
    let dateFormat = "";

    if (min < 10) {
        dateFormat += "0" + min;
    } else {
        dateFormat += min;
    }

    dateFormat += ":";

    if(second < 10) {
        dateFormat += "0" + second;
    } else {
        dateFormat += second;
    }

    return dateFormat;
}
function parseTime(time, cFormat) {
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
}

function chooseDateTime(format){
return  dd.chooseDateTime({
    default: new Date(),
  }).then(res=>{
    return parseTime(res.chosen,format)
  })
// return dd.datePicker({
//     format: 'yyyy-MM-dd HH:mm:ss',
//     currentDate: '',
//     success: (res) => {
//     return res.data
//     },
//   })
}


module.exports = { countDown, timer, dataTimer, formatRecorderTimer,parseTime,chooseDateTime};