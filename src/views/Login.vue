<template>
  <div id="building">
   <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
     <h3 class="loginTitle">系统登录 </h3>
     <el-form-item prop="username">
       <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
     </el-form-item>
     <el-form-item prop="password">
       <el-input type="text" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
     </el-form-item>
     <el-button type="primary" style="width:100%;" @click="submitLogin">登陆</el-button>
     <el-link  style="font-size: 15px;color: #03d0d0" @click="adminLogin">管理员登陆入口</el-link>
   </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      loginForm:{
        username: 'admin',
        password: '123'
      },
      rules:{
        username: [{required: true, message:'请输入用户名', trigger:'blur'}],
        password: [{required: true, message:'请输入密码', trigger:'blur'}]
      }
    }
  },
  methods:{
    submitLogin( ) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{
            if(resp){
               window.sessionStorage.setItem("user",JSON.stringify(resp.obj));
               this.$router.replace('/home')
            }
            else alert('请求失败');
          })
        } else {
          this.$message.error('用户名或密码不能为空 ')
          return false;
        }
      });
    },
    adminLogin(){
      this.$router.replace('/adminLogin')
    }
  }
}
</script>

<style>
#building {
  background: url("https://wallpapercave.com/wp/wp2856120.gif");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
.loginContainer {
  border-radius:15px;
  background-clip: padding-box;
  margin: 180px auto;
  width:350px;
  padding: 15px 35px 15px 35px;
  background: #020e3d;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #4e6c07;
}
.loginTitle{
  font-size:30px;
  margin:15px auto 20px auto;
  text-align:center;
  color: #ffffff;

}

</style>