<template>
  <div class="amap-page-container">
    <div class="toolbar">
        <span v-if="loaded" style="color: #01216d;font-size: 30px">
          当前位置: 经度= {{ lng }} 纬度 = {{lat}}
        </span>
      <span v-else>正在定位</span>
    </div>
    <div :style="{width:'100%',height:'550px'}">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center">
        <el-amap-marker v-for="markers in markers"
                        :events="Mevents"
                        :label="markers.label"
                        :position="markers.position"
                        :icon="markers.icon">
        </el-amap-marker>
        <el-amap-circle v-for="markers in markers"
                        :center="markers.position"
                        :radius="radius"
                        fill-opacity="0.2"
                        strokeColor="#38f"
                        strokeOpacity="0.8"
                        strokeWeight="1"
                        fillColor="#38f"
        ></el-amap-circle>
      </el-amap>
    </div>
  </div>
</template>
<script>
import location from "@/assets/image/img.png";
export default {
  mounted() {
    this.getCenter();
  },
  data(){
    const self = this;
    return {
      markers: [],
      center: [0,0],
      atdCenter: {
        lng: 0.0,
        lat: 0.0,
    },
      lng: 0,
      lat: 0,
      radius:100,
      addr:'',
      loaded: false,
      Mevents:{
        init: e =>{
          this.getCenter();
        },
      },
      plugin: [{
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 100,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true,//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
        extensions:'all',
        pName: 'Geolocation',
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              console.log(result)
              if (result && result.position) {
                self.lng = result.position.lng;
                self.lat = result.position.lat;
                self.center = [self.lng, self.lat];
                self.loaded = true;
                self.$nextTick();
              }
            });

          },
        },
      }]
    }
  },
  methods:{
    getCenter() {
      this.getRequest("/center/").then(resp => {
        this.atdCenter = resp;
        this.markers = [
          {
            position: [this.atdCenter.lng,this.atdCenter.lat],
            //icon:location,
            label:{
              content:'公司位置',
              offset:[10,12],
              color:"#67C23A",
            }
          }
        ];
      });

    }
  },
}
</script>

<style>
.amap-demo {
  height: 300px;
}

</style>

