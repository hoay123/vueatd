<template>
  <div>
    <el-button @click="get" type="primary">获取IP信息</el-button>
    <el-button @click="send" type="primary">发送邮件</el-button>
    <div style="display: flex; margin-top: 20px; height: 100px; size: 60px" v-loading="loading">
      <transition name="el-zoom-in-center">
        <div v-show="show2" class="transition-box" v-text="ipText"></div>
      </transition>

      <transition name="el-zoom-in-top">
        <div v-show="show2" class="transition-box" v-if="this.onLine==true" v-text="on" style="background-color:#67C23A" ></div>
      </transition>
      <transition name="el-zoom-in-top">
        <div  v-show="show2" class="transition-box" v-if="this.onLine!=true" v-text="off" style="background-color: #F56C6C"></div>
      </transition>

      <transition name="el-zoom-in-bottom">
        <div v-show="show2" class="transition-box" v-if="this.atdFlag==true" v-text="atdTrue" style="background-color: #F56C6C"></div>
      </transition>
      <transition name="el-zoom-in-bottom">
        <div  v-show="show2" class="transition-box" v-if="this.atdFlag!=true" v-text="atdFalse" style="background-color:#67C23A"></div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: "IP",
  data(){
    return{
      loading:false,
      show2:false,
      newIp:{
        address:'',
      },
      onLine: navigator.onLine,
      on:"网络状态：在线",
      off:"网络状态：离线",
      atdFlag:false,
      ipText:'',
      ip1:'',
      atdTrue:"该IP今日已打卡，不能继续打卡",
      atdFalse:"该IP今日未打卡,可以前往打卡",
    }
  },
  mounted(){
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  },
  methods:{
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === 'online';
    },
    send(){

    },
    get(){
      this.loading=true;
      setTimeout(() =>{
        this.loading=false;
      },500);
      var Ip=returnCitySN['cip'];
      localStorage.setItem('Ip', Ip);
      this.newIp.address=Ip;
      this.postRequest("/ip/"+this.newIp.address).then(resp=>{
        if(resp==1){
          this.atdFlag=true;
        }
        else this.atdFlag=false;
      });
      this.ipText="IP地址"+this.newIp.address;
      this.show2=true;
    },
  }
}

</script>

<style>
.transition-box {
  margin-bottom: 10px;
  width: 450px;
  height: 400px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  font-size: 22px;
  margin-right: 20px;
}

</style>