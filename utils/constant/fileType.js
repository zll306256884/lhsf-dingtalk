
function getTemperatureList() {
  let list = [];
  for (let i = -100; i <= 100; i++) {
      list.push({
          name: i + "°C",
          value: i
      });
  }
  return list;
}
module.exports = {
temperatureList: getTemperatureList(),


 //天气下午(1晴 2阴 3雨 4风 5雪)
 weatherAMList: [{
  name: "上午-晴",
  value: "1"
}, {
  name: "上午-阴",
  value: "2"
}, {
  name: "上午-雨",
  value: "3"
}, {
  name: "上午-风",
  value: "4"
}, {
  name: "上午-雪",
  value: "5"
}],

//天气上午(1晴 2阴 3雨 4风 5雪)
weatherPMList: [{
  name: "下午-晴",
  value: "1"
}, {
  name: "下午-阴",
  value: "2"
}, {
  name: "下午-雨",
  value: "3"
}, {
  name: "下午-风",
  value: "4"
}, {
  name: "下午-雪",
  value: "5"
}],


// 文件类型
fileTypeList: [
    {
      url: '/images/icon_file_word.png',
      suffix: ['doc', 'docx']
    },
    {
      url: '/images/icon_file_ppt.png',
      suffix: ['ppt', 'pptx', 'ppsx', 'pps']
    },
    {
      url: '/images/icon_file_excel.png',
      suffix: ['xlsx', 'xlsm', 'xlsb', 'csv']
    },
    {
      url: '/images/icon_file_pdf.png',
      suffix: ['pdf']
    },
    {
      url: '/images/icon_file_image.png',
      suffix: ['png', 'jpg', 'gif', 'webp', 'jpeg'],
      type: 'image'
    },
    {
      url: '/images/icon_file_video.png',
      suffix: ['mov', 'mp4', 'm4v', 'avi', 'dat', 'mkv', 'flv', 'vob', 'rmvb'],
      type: 'video'
    },
    {
      url: '/images/icon_file_other.png',
      suffix: ['mp3', 'mpeg'],
      type: 'audio'
    },
    {
      url: '/images/icon_file_other.png',
      suffix: ['zip', 'rar', '7z']
    }
  ]
}