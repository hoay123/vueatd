<template>
  <div>
    <el-container>
      <el-header class="homeHeader" height="70px">
        <div class="title">CUP考勤</div>
        <div>
          <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color: #F56C6C;" size="normal" @click="goChat"></el-button>
        <el-dropdown class="userInfo" @command="commandHandler">
  <span class="el-dropdown-link">
    欢迎您!
    <br> {{ user.name }}<i><img src="https://img2.baidu.com/it/u=2561659095,299912888&fm=26&fmt=auto&gp=0.jpg" alt=""></i>
  </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside class="homeAside" width="200px">
          <el-menu @select="menuClick">
            <el-submenu index="1">
              <template slot="title">
                <i style="color: #0ba8a8;font-size: 23px" class="el-icon-menu"></i>
                <span class="title2">考勤</span>
              </template>
                <el-menu-item class="title1" index="/Attendance">
                  <i style="color: #0ba8a8;font-size: 20px" class="el-icon-map-location"></i>
                  打卡
                </el-menu-item>
                <el-menu-item class="title1" index="/Record">
                  <i style="color: #0ba8a8;font-size: 20px" class="el-icon-time"></i>
                  记录
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="/Test">
              <i style="color: #0ba8a8;font-size: 23px" class="el-icon-location"></i>
              <span class="title2" slot="title" >环境检测</span>
            </el-menu-item>
            <el-menu-item index="3" disabled v-if="!flagAdmin">
              <i style="color: #F56C6C;font-size: 23px" class="el-icon-edit-outline"></i>
              <span class="title2" slot="title" @click="open1">管理</span>
            </el-menu-item>
            <el-submenu index="3" v-if="flagAdmin">
              <template slot="title">
              <i style="color: #0ba8a8;font-size: 23px" class="el-icon-edit-outline"></i>
              <span class="title2" slot="title">管理</span>
              </template>
              <el-menu-item class="title1" index="/Manage">
                <i style="color: #0ba8a8;font-size: 21px" class="el-icon-s-custom"></i>
                信息管理
              </el-menu-item>
              <el-menu-item class="title1" index="/RecordManage">
                <i style="color: #0ba8a8;font-size: 21px" class="el-icon-document-copy"></i>
                打卡情况
              </el-menu-item>
              <el-menu-item class="title1" index="/LeaveManage">
                <i style="color: #0ba8a8;font-size: 21px" class="el-icon-document-copy"></i>
                下班情况
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-button type="primary" icon="el-icon-refresh" @click="doRefresh" style="float: right" size="mini" v-if="this.$router.currentRoute.path=='/home'">刷新</el-button>
          <el-breadcrumb separator-class="el-icon-right" style="font-size: 10px" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home'}">  首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="welcomeTitleTrue" v-if="this.$router.currentRoute.path=='/home'&&flagAdmin">
            <h1 style="background-color: #e6fae2">欢迎管理员登陆!</h1>
          </div>
          <div class="welcomeTitleFalse" v-if="this.$router.currentRoute.path=='/home'&&!flagAtd&&!flagAdmin">
              <h1 style="background-color: #f8dada">请及时打卡!</h1>
            <el-steps :active="0" finish-status="success" style="font-family: 'Microsoft YaHei'">
              <el-step title="打卡ing" status="finish"></el-step>
              <el-step title="工作"></el-step>
              <el-step title="下班"></el-step>
            </el-steps>
          </div>
          <div class="welcomeTitleTrue" v-else-if="this.$router.currentRoute.path=='/home'&&flagAtd&&!flagAdmin">
            <h1 style="background-color: #e6fae2">今日已打卡!</h1>
            <el-steps :active="1" finish-status="success" style="font-family: 'Microsoft YaHei'">
              <el-step title="已打卡"></el-step>
              <el-step title="工作ing" status="finish"></el-step>
              <el-step title="下班"></el-step>
            </el-steps>
          </div>
          <router-view class="homeRouteView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {getRequest} from "../utils/api";

export default {
  name: "Home",
  mounted() {
    this.checkAdmin();
  },
  data(){
    return {
      atdInfo:{
        id:0,
        name:'',
        date:'',
      },
      user:JSON.parse(window.sessionStorage.getItem("user")),
      flagAtd:'',
      flagAdmin:true
    }
  },
  methods:{
    goChat(){
      this.$router.push("/chat");
    },
    checkAdmin(){
      this.getRequest("/Manage/emp/?keywords="+this.user.name).then(resp=>{
        if(resp==''){
          this.flagAdmin=true;
        }
        else {
          this.flagAdmin=false;
          this.check();
        }
      })
    },
    doRefresh(){
      this.check();
    },
    check(){
      this.atdInfo.name=this.user.name;
      this.formatDay();
      this.postRequest("/empAtd/",this.atdInfo).then(resp=>{
        if(resp==1) {
          this.flagAtd=true;
        }
        else {
          this.$message({
            message: '请尽快打卡！',
            type: 'warning'
          });
        }
      })
    },
    formatDay() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.atdInfo.date = `${year}-${month}-${day}`;
    },
    open1() {
      const h = this.$createElement;
      this.$notify({
        title: '权限不足',
        message: h('i', { style: 'color: teal'}, '此功能仅面对管理员开放，如果您是管理员，请登录管理员账号'),
        type: 'warning'
      });
    },
    menuClick(index){
      this.$router.push(index);
    },
    commandHandler(cmd){
      if(cmd=='logout')
      {
        this.$confirm('此操作将退出登陆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("/logout ");
          window.sessionStorage.removeItem("user");
          this.$router.replace("/");
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销'
          });
        });}
      else if(cmd=="userinfo"){

      }
    }
  }
}
</script>

<style>
.homeRouteView{
  margin-top: 5px;
}
.welcomeTitleFalse{
  text-align: center;
  font-size: 50px;
  font-family: "Kaiti TC";
  color: #ef6969;
}
.welcomeTitleTrue{
  text-align: center;
  font-size: 50px;
  font-family: "Kaiti TC";
  color:#67C23A;
}
.homeHeader{
  background-color: #07329e;
  display: flex;
  align-items:center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}
.homeHeader .title{
  font-size: 35px;
  font-family:"Kaiti TC";
  color: #ffffff ;
}
.homeHeader .userInfo{
  cursor: pointer;
  font-size: 23px;
  color: white;
}
.el-dropdown-link img{
  width: 48px;
  height: 48px;
  border-radius:  24px;
  margin-left:8px ;
}
.el-dropdown-link{
  display: flex;
  align-items: center;
}
.homeAside .title1{
  font-size: 18px;
}
.homeAside .title2{
  font-size: 23px;
}

</style>