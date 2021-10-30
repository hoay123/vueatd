<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="员工信息管理" name="first"><EmpMng></EmpMng></el-tab-pane>
    <el-tab-pane label="管理员信息管理" name="second"><AdmMng></AdmMng></el-tab-pane>
    <el-tab-pane label="部门信息管理" name="third"><DpmMng></DpmMng></el-tab-pane>

  </el-tabs>
</template>

<script>
import AdmMng from "../../components/admin/AdminManage";
import EmpMng from "../../components/admin/EmployeeManage";
import DpmMng from "../../components/admin/DepartmentManage";
export default {
  name: "Manage",
  data(){
    return{
      activeName:'first'
    }
  },
  components:{
    AdmMng,
    EmpMng,
    DpmMng,
  }
}
</script>

<style scoped>

</style>