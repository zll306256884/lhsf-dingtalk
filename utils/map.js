/*
 * WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块、天地图）
 * GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
 * BD-09：百度坐标偏移标准，Baidu Map使用
 */

    //定义一些常量
    const x_PI = (3.14159265358979324 * 3000.0) / 180.0
    const PI = 3.1415926535897932384626
    const a = 6378245.0
    const ee = 0.00669342162296594323

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    function out_of_china(lng, lat) {
        return (
            lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
        )
    }

    function transformlat(lng, lat) {
        let ret =
            -100.0 +
            2.0 * lng +
            3.0 * lat +
            0.2 * lat * lat +
            0.1 * lng * lat +
            0.2 * Math.sqrt(Math.abs(lng))
        ret +=
            ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                2.0) /
            3.0
        ret +=
            ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
            3.0
        ret +=
            ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
                2.0) /
            3.0
        return ret
    }

    function transformlng(lng, lat) {
        let ret =
            300.0 +
            lng +
            2.0 * lat +
            0.1 * lng * lng +
            0.1 * lng * lat +
            0.1 * Math.sqrt(Math.abs(lng))
        ret +=
            ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                2.0) /
            3.0
        ret +=
            ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
            3.0
        ret +=
            ((150.0 * Math.sin((lng / 12.0) * PI) +
                300.0 * Math.sin((lng / 30.0) * PI)) *
                2.0) /
            3.0
        return ret
    }

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param lng 经度
     * @param lat 纬度
     * @returns {lng,lat} 经纬度对象
     */
     function bd09togcj02(lng, lat) {
        const x = lng - 0.0065
        const y = lat - 0.006
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
        const gg_lng = z * Math.cos(theta)
        const gg_lat = z * Math.sin(theta)
        return { lng: gg_lng, lat: gg_lat }
    }

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng 经度
     * @param lat 纬度
     * @returns {lng,lat} 经纬度对象
     */
     function gcj02tobd09(lng, lat) {
        const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
        const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
        const bd_lng = z * Math.cos(theta) + 0.0065
        const bd_lat = z * Math.sin(theta) + 0.006
        return { lng: bd_lng, lat: bd_lat }
    }

    /**
     * WGS84 转 GCj02
     * @param lng 经度
     * @param lat 纬度
     * @returns {lng,lat} 经纬度对象
     */
     function wgs84togcj02(lng, lat) {
        if (out_of_china(lng, lat)) {
            return { lng: lng, lat: lat }
        } else {
            let dlat = transformlat(lng - 105.0, lat - 35.0)
            let dlng = transformlng(lng - 105.0, lat - 35.0)
            let radlat = (lat / 180.0) * PI
            let magic = Math.sin(radlat)
            magic = 1 - ee * magic * magic
            let sqrtmagic = Math.sqrt(magic)
            dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
            dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
            let mglat = Number(lat) + Number(dlat)
            let mglng = Number(lng) + Number(dlng)
            return { lng: mglng, lat: mglat }
        }
    }
    /**
     * GCJ02 转换为 WGS84
     * @param lng 经度
     * @param lat 纬度
     * @returns {lng,lat} 经纬度对象
     */
     function gcj02towgs84(lng, lat) {
        if (out_of_china(lng, lat)) {
            return { lng: lng, lat: lat }
        } else {
            let dlat = transformlat(lng - 105.0, lat - 35.0)
            let dlng = transformlng(lng - 105.0, lat - 35.0)
            let radlat = (lat / 180.0) * PI
            let magic = Math.sin(radlat)
            magic = 1 - ee * magic * magic
            let sqrtmagic = Math.sqrt(magic)
            dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
            dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
            let mglat = lat + dlat
            let mglng = lng + dlng
            return { lng: lng * 2 - mglng, lat: lat * 2 - mglat }
        }
    }

    // 高斯坐标转经纬度WGS84
    function Gauss_to_LogLat(Y,X){
      let lat, lon
      Y-=500000;
      let result = new Array(2);
      let iPI = 0.0174532925199433; //pi/180
      let a = 6378137.0; //长半轴 m
      let b = 6356752.31414; //短半轴 m
      let f = 1/298.257222101;//扁率 a-b/a
      let e = 0.0818191910428; //第一偏心率 Math.sqrt(5)
      let L0 = 120; //中央子午线的经线值
      let ee = Math.sqrt(a*a-b*b)/b; //第二偏心率
      let bf = 0; //底点纬度
      let a0 = 1+(3*e*e/4) + (45*e*e*e*e/64) + (175*e*e*e*e*e*e/256) + (11025*e*e*e*e*e*e*e*e/16384) + (43659*e*e*e*e*e*e*e*e*e*e/65536);
      let b0 = X/(a*(1-e*e)*a0);
      let c1 = 3*e*e/8 +3*e*e*e*e/16 + 213*e*e*e*e*e*e/2048 + 255*e*e*e*e*e*e*e*e/4096;
      let c2 = 21*e*e*e*e/256 + 21*e*e*e*e*e*e/256 + 533*e*e*e*e*e*e*e*e/8192;
      let c3 = 151*e*e*e*e*e*e*e*e/6144 + 151*e*e*e*e*e*e*e*e/4096;
      let c4 = 1097*e*e*e*e*e*e*e*e/131072;
      bf = b0 + c1*Math.sin(2*b0) + c2*Math.sin(4*b0) +c3*Math.sin(6*b0) + c4*Math.sin(8*b0); // bf =b0+c1*sin2b0 + c2*sin4b0 + c3*sin6b0 +c4*sin8b0 +...
      let tf = Math.tan(bf);
      let n2 = ee*ee*Math.cos(bf)*Math.cos(bf); //第二偏心率平方成bf余弦平方
      let c = a*a/b;
      let v = Math.sqrt(1+ ee*ee*Math.cos(bf)*Math.cos(bf));
      let mf = c/(v*v*v); //子午圈半径
      let nf = c/v;//卯酉圈半径
  
      //纬度计算
      lat = bf-(tf/(2*mf)*Y)*(Y/nf) * (1-1/12*(5+3*tf*tf+n2-9*n2*tf*tf)*(Y*Y/(nf*nf))+1/360*(61+90*tf*tf+45*tf*tf*tf*tf)*(Y*Y*Y*Y/(nf*nf*nf*nf)));
      //经度偏差
      lon = 1/(nf*Math.cos(bf))*Y -(1/(6*nf*nf*nf*Math.cos(bf)))*(1+2*tf*tf +n2)*Y*Y*Y + (1/(120*nf*nf*nf*nf*nf*Math.cos(bf)))*(5+28*tf*tf+24*tf*tf*tf*tf)*Y*Y*Y*Y*Y;
      result[0] = L0 + lon / iPI;
      result[1] = lat / iPI;
      return { lng: result[0], lat: result[1]}
      // return result
  }

    module.exports = {wgs84togcj02,Gauss_to_LogLat}
