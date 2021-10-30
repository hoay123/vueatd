<template>
  <div class="amap-page-container" v-loading="loading">
    <el-button type="primary" style="margin-top: 20px;margin-bottom: 20px" icon="el-icon-upload2" @click="atd" v-if="flag">上班打卡</el-button>
    <el-button type="info" style="margin-top: 20px;margin-bottom: 20px" icon="el-icon-upload2"  v-else-if="!leaveTimeFlag" disabled>下班打卡</el-button>
    <el-button type="primary" style="margin-top: 20px;margin-bottom: 20px" icon="el-icon-bicycle" @click="leaveAtd" v-else-if="leaveTimeFlag&&!leaveFlag" >下班打卡</el-button>
    <el-button type="success" style="margin-top: 20px;margin-bottom: 20px" icon="el-icon-moon"  v-else-if="leaveTimeFlag&&leaveFlag" disable>今日考勤已结束</el-button>
    <div :style="{width:'100%',height:'450px'}" >
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
    <div class="toolbar" >

      <transition name="el-zoom-in-center">
        <div class="transition-box-1" v-text="address" style="height: 70px;width: 100%;margin-top: 5px"></div>
      </transition>
      <transition name="el-zoom-in-center">
        <div class="transition-box-1" v-text="mac" style="height: 70px;width: 100%;margin-top: 5px"></div>
      </transition>
    </div>

  </div>
</template>
<script>
export default {
  name:"Attendance",
  mounted() {
    var Ip=returnCitySN['cip'];
    localStorage.setItem('Ip', Ip);
    this.address="IP地址："+Ip;
    this.getRequest("/mac/").then(resp=>{
      if(resp){
        this.mac="本机MAC地址："+resp;
      }
    });
    this.getRequest("/center/").then(resp=>{
      if(resp){
        this.atdCenter.lat=resp.lat;
        this.atdCenter.lng=resp.lng;
      }
    });
    this.getRequest("/arrive/").then(resp=>{
      if(resp){
        this.arriveTime=resp.time;
      }
    });
    this.getRequest("/leave/").then(resp=>{
      if(resp){
        this.leaveTime=resp.time;
      }
    });
    this.getCenter();
    this.check();
  },
  data(){
    const self = this;
    return {
      markers: [],
      Mevents:{
        init: e =>{
          this.getCenter();
        },
      },
      radius:100,
      user:JSON.parse(window.sessionStorage.getItem("user")),
      atdInfo:{
        id:0,
        name:'',
        date:'',
        late:0,
      },
      leaveInfo:{
        id:0,
        name:'',
        date:'',
        early:0,
      },
      loading:false,
      arriveTime:'',
      leaveTime:'',
      nowTime:'',
      flag:true,
      leaveTimeFlag:false,
      leaveFlag:false,
      address:'',
      mac:'',
      center: [116.256435,40.223389],
      atdCenter: {
        lng: 0.0,
        lat: 0.0,
      },
      lng: 0,
      lat: 0,
      newIp:{
        address:'',
      },
      atdFlag:false,
      loaded: false,
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
          }
        }
      }]
    }
  },
  methods:{

    getCenter() {
      this.getRequest("/center/").then(resp => {
        this.atdCenter = resp;
        this.markers = [
          {
            position: [this.atdCenter.lng, this.atdCenter.lat],
            //icon:location,
            label: {
              content: '公司位置',
              offset: [10, 12],
              color: "#67C23A",
            }
          }
        ];
      });
    },
    /************************************检测用户是否已打卡*******************************************/
    check(){
      this.atdInfo.name=this.user.name;
      this.formatDay();
      this.postRequest("/empAtd/",this.atdInfo).then(resp=>{
        if(resp==1) {
          this.flag=false;
          this.getNowTime();
          if(!this.leaveTimeFlag) {
            this.$message({
              message: '您今日已打卡！请于' + this.leaveTime + '后再打卡下班',
              type: 'warning'
            });
          }
          else {
            this.postRequest("/empLeave/",this.atdInfo).then(leaveResp=>{
            if(leaveResp!=1){
              this.leaveFlag=false;
              this.$message({
               message: '已到下班时间，下班请打卡',
               type: 'success'
            });
          }
          else {
            this.leaveFlag=true;
            this.$message({
              message: '今日考勤已完成，辛苦了！',
              type: 'success'
            });}});
          }
        }
        else {
          this.$message({
            message: '请于'+this.arriveTime+'前尽快打卡！',
            type: 'warning'
          });
        }
      })
    },
    atd(){
      this.loading=true;
      setTimeout(() =>{
        this.loading=false;
      },500);
      /************************************检测IP是否已打卡*******************************************/
      var Ip=returnCitySN['cip'];
      localStorage.setItem('Ip', Ip);
      this.newIp.address=Ip;
      this.postRequest("/ip/"+this.newIp.address).then(resp=>{
        if(resp==1){
          this.$message({
            message: '打卡失败！该IP今日已打卡！',
            type: 'warning'
          });
        }
        /************************************检测范围*******************************************/
        else if(Math.abs(this.lng-this.atdCenter.lng)>0.03||Math.abs(this.lat-this.atdCenter.lat)>0.08)
        {
          this.$message({
            message: '打卡失败！不在指定打卡范围内！！',
            type: 'warning'
          });
        }
        else {
          /************************************检测MAC是否已打卡*******************************************/
          this.postRequest("/mac/").then(respMac=>{
            if(respMac==1){
              this.$message({
                message: '打卡失败！该MAC地址今日已打卡！',
                type: 'warning'
              });
            }
            else this.putAtd();
          });
        }
      });
    },
    leaveAtd(){
      this.loading=true;
      setTimeout(() =>{
        this.loading=false;
      },500);
      /************************************检测IP是否已打卡*******************************************/
      var Ip=returnCitySN['cip'];
      localStorage.setItem('Ip', Ip);
      this.newIp.address=Ip;
      this.postRequest("/ip/"+this.newIp.address).then(resp=>{
        if(resp==1){
          this.$message({
            message: '打卡失败！该IP今日已打卡！',
            type: 'warning'
          });
        }
        /************************************检测范围*******************************************/
        else if(Math.abs(this.lng-this.atdCenter.lng)>0.03||Math.abs(this.lat-this.atdCenter.lat)>0.08)
        {
          this.$message({
            message: '打卡失败！不在指定打卡范围内！！',
            type: 'warning'
          });
        }
        else {
          /************************************检测MAC是否已打卡*******************************************/
          this.postRequest("/mac/").then(respMac=>{
            if(respMac==1){
              this.$message({
                message: '打卡失败！该MAC地址今日已打卡！',
                type: 'warning'
              });
            }
            else this.putLeaveAtd();
          });
        }
      });
    },
    putAtd(){
      this.atdInfo.name=this.user.name;
      this.formatDate();
      this.getNowTime();
      if(this.nowTime>this.arriveTime){
        this.atdInfo.late=1;
        this.$alert('今日已迟到，下次早点来哦', '迟到', {
          confirmButtonText: '确定',
        });
      }
      this.putRequest("/empAtd/",this.atdInfo).then(resp=>{
        if(resp) {
          this.flag=false;
        }
      });
      this.putRequest("/ip/"+this.newIp.address).then(resp=>{
        if(resp==0){
          this.$message({
            message: 'IP异常',
            type: 'warning'
          });
        }
      });
      this.putRequest("/mac/").then(resp=>{
        if(resp==0){
          this.$message({
            message: 'MAC异常',
            type: 'warning'
          });
        }
      });
    },
    putLeaveAtd(){
      this.leaveInfo.name=this.user.name;
      this.formatDate();
      this.getNowTime();
      if(this.nowTime<this.leaveTime){
        this.leaveInfo.early=1;
        this.$alert('今日已早退，下次注意哦', '早退', {
          confirmButtonText: '确定',
        });
      }
      this.putRequest("/empLeave/",this.leaveInfo).then(resp=>{
        if(resp) {
          this.leaveFlag=true;
        }
      });
      this.putRequest("/ip/"+this.newIp.address).then(resp=>{
        if(resp==0){
          this.$message({
            message: 'IP异常',
            type: 'warning'
          });
        }
      });
      this.putRequest("/mac/").then(resp=>{
        if(resp==0){
          this.$message({
            message: 'MAC异常',
            type: 'warning'
          });
        }
      });
    },
    formatDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      let hour = date.getHours();
      hour = hour < 10 ? "0" + hour : hour;
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      this.atdInfo.date = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      this.leaveInfo.date = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    formatDay() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;
      this.atdInfo.date = `${year}-${month}-${day}`;
    },
    getNowTime() {
      let date = new Date();
      let hour = date.getHours();
      hour = hour < 10 ? "0" + hour : hour;
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      this.nowTime=`${hour}:${minute}:${second}`;
      if(this.nowTime>=this.leaveTime)
        this.leaveTimeFlag=true;
      else this.leaveTimeFlag=false;
    },
  }
}
</script>



<style>
.amap-demo {
  height: 330px;
}
.transition-box-1 {
  margin-bottom: 10px;
  width: 150px;
  height: 70px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  font-size: 25px;
  padding: 12px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>

