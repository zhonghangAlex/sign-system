<template>
    <div id="allmap" class="allmap"></div>
</template>

<script>
import GeoUtils from '../../../static/js/GeoUtils.js'
import BMap from 'BMap'


export default {
  data () {
    return {

    }
  },
  methods: {
    ready: function startmap() {
      //创建地图
      var map = new BMap.Map("allmap");
      //创建一个圆
      var circle = new BMap.Circle(new BMap.Point(114.339972,30.517935),100,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});

      var point2s = [
          new BMap.Point(114.341625,30.517647),
          new BMap.Point(114.341068,30.517741),
          new BMap.Point(114.338921,30.518098),
          new BMap.Point(114.340538,30.518643),
          new BMap.Point(114.340996,30.517064),
          new BMap.Point(114.337151,30.517344),
          new BMap.Point(114.339954,30.517927)

      ];
      //创建标注点并添加到地图中
      function addMarker(points) {
          //循环建立标注点
          for(var i=0, pointsLen = points.length; i<pointsLen; i++) {
              var marker = new BMap.Marker(points[i]); //将点转化成标注点
              map.addOverlay(marker);  //将标注点添加到地图上
              //添加监听事件
              (function() {
                  var thePoint = points[i];
                  marker.addEventListener("click",
                          function() {
                              showInfo(this,thePoint);
                          });
              })();
          }
      }

      function showInfo(thisMarker,point) {

          //判断点是否在
          if(BMapLib.GeoUtils.isPointInCircle(point,circle)){
              var infoWindow = new BMap.InfoWindow("在圆形区域内");
              thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
          }else
          {
              var infoWindow = new BMap.InfoWindow("不在圆形区域内");
              thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
          }
      }


      function initialize() {
          // 百度地图API功能
          map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
          map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
          map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
          map.enableScrollWheelZoom();                            //启用滚轮放大缩小
          map.addControl(new BMap.MapTypeControl());          //添加地图类型控件

          var point = new BMap.Point(114.339972,30.517935);    // 创建点坐标
          map.centerAndZoom(point,18);                      // 初始化地图,设置中心点坐标和地图级别。
          addMarker(point2s);
          map.addOverlay(circle);
      }

      initialize();
    }
  },
  mounted(){
    this.ready();
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .gps_dia .allmap {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        position: absolute;
        font-family:"微软雅黑";
        z-index: 1000000;
    }
    .BMap_cpyCtrl {
        display: none;
    }

    .anchorBL {
        display: none;
    }
</style>
