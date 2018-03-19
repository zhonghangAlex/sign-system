<template>
    <center>
        <form>
            <div style=" margin:auto;width:95%;height:500px;border:2px solid gray; margin-bottom:10px;" id="container"></div>
            <h3 style="color: red;">介绍：输入地点然后点击“地图查找”搜索，再点击地图地点获取相应经纬度</h3>
            <label>输入地点：</label>
            <input id="where" name="where" type="text" placeholder="请输入地址">
            <input id="but" type="button" value="地图查找" onClick="sear(document.getElementById('where').value);" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 经度：
            <input id="lonlat" name="lonlat" type="number" maxlength="10">纬度：
            <input id="lonlat2" name="lonlat2" type="number" maxlength="9">
        </form>
    </center>
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
    var longitude=114.339972;
    var latitude=30.517935;
   
    var map = new BMap.Map("container",{enableMapClick: false});
    map.setDefaultCursor("crosshair");
    map.enableScrollWheelZoom();
    var point = new BMap.Point(longitude,latitude);
    map.centerAndZoom(point, 13);
    var gc = new BMap.Geocoder();
    //map.addControl(new BMap.NavigationControl());  // 添加平移缩放控件
    //map.addControl(new BMap.OverviewMapControl()); //添加缩略地图控件
    //map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
    //map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    //map.addControl(new BMap.CopyrightControl());
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    marker.addEventListener("click",
    function(e) {
        document.getElementById("lonlat").value = e.point.lng;
        document.getElementById("lonlat2").value = e.point.lat;
    });
    marker.enableDragging();
    marker.addEventListener("dragend",
    function(e) {
        gc.getLocation(e.point,
        function(rs) {
        showLocationInfo(e.point, rs);
        });
    });
    function showLocationInfo(pt, rs) {
        var opts = {
        width: 250,
        height: 150,
        title: "当前位置"
        };
        var addComp = rs.addressComponents;
        var addr = "当前位置：" + addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber + "<br/>";
        addr += "纬度: " + pt.lat + ", " + "经度：" + pt.lng;
        var infoWindow = new BMap.InfoWindow(addr, opts);
        marker.openInfoWindow(infoWindow);
    }
    map.addEventListener("click",
    function(e) {
        document.getElementById("lonlat").value = e.point.lng;
        document.getElementById("lonlat2").value = e.point.lat;
    });
    var traffic = new BMap.TrafficLayer();
    map.addTileLayer(traffic);
    function iploac(result) {
        var cityName = result.name;
    }
    var myCity = new BMap.LocalCity();
    myCity.get(iploac);
    function sear(result) {
        var local = new BMap.LocalSearch(map, {
            renderOptions: {
                map: map
            }
        });
        local.search(result);
    }
    }
  },
  mounted(){
    this.ready();
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
