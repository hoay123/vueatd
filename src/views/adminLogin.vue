<template>
  <div id="building">
    <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer1">
      <h3 class="loginTitle">管理员登录 </h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="text" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-button type="danger" style="width:100%;" @click="submitLogin">登陆</el-button>
      <el-link style="font-size: 15px;color: #f58c6c" @click="adminLogin">员工登陆入口</el-link>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "adminLogin",
  data(){
    return{
      loginForm:{
        username: 'admin',
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
      this.$router.replace('/')
    }
  }
}
</script>

<style>
#building {
  background: url("https://i.pinimg.com/originals/4e/47/f6/4e47f624ffeeec66be0c833f4bff5973.gif");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
.loginContainer1 {
  border-radius:15px;
  background-clip: padding-box;
  margin: 180px auto;
  width:350px;
  padding: 15px 35px 15px 35px;
  background: #3d0209;
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