<template>
  <div>
    <el-button @click="get" type="primary">获取硬件信息</el-button>

    <div style="display: flex; margin-top: 20px; height: 100px; size: 60px" v-loading="loading">
      <transition name="el-zoom-in-center">
        <div v-show="show2" class="transition-box" v-text="macText"></div>
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
  name: "Mac",
  data(){
    return{
      loading:false,
      show2:false,
      newMac:{
        address:'',
      },
      atdFlag:false,
      macText:'',
      mac1:'',
      atdTrue:"该MAC地址今日已打卡，不能继续打卡",
      atdFalse:"该MAC地址今日未打卡,可以前往打卡",
    }
  },
  methods:{
    get(){
      this.loading=true;
      setTimeout(() =>{
        this.loading=false;
      },500);
      this.getRequest("/mac/").then(resp=>{
        if(resp){
          this.newMac.address=resp;
          this.macText="MAC地址"+this.newMac.address;
        }
      });
      this.show2=true;
      this.postRequest("/mac/").then(resp=>{
        if(resp==1){
          this.atdFlag=true;
        }
        else this.atdFlag=false;
      });
    },
  }
}

</script>

<style>
.transition-box {
  margin-bottom: 10px;
  width: 600px;
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