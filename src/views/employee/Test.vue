<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="地图" name="first"><Map></Map></el-tab-pane>
    <el-tab-pane label="IP地址" name="second"><IP></IP></el-tab-pane>
    <el-tab-pane label="硬件信息" name="third"><Other></Other></el-tab-pane>
  </el-tabs>
</template>
<script>
import Map from "../../components/employee/Map";
import IP from "../../components/employee/IP";
import Other from "../../components/employee/Mac";

export default {
  name: "Test",
  data(){
    return{
      activeName:'first'
    }
  },
  components:{
    Map,
    IP,
    Other,
  }
}
</script>

<style scoped>

</style>