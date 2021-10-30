<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-refresh" @click="doRefresh" style="float: right" size="mini">刷新</el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          :data="rcds"
          stripe
          style="width: 100%">
        <el-table-column
            prop="name"
            label="姓名"
            width="260">
        </el-table-column>
        <el-table-column
            prop="date"
            label="日期"
            width="280">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Record",
  data(){
    return{
      user:JSON.parse(window.sessionStorage.getItem("user")),
      keywords:'',
      rcds:{
        id:'',
        name:'',
        date:'',
      },
      loading:false,
    }
  },
  mounted() {
    this.initRecord();
  },
  methods:{
    doSearch(){
      this.initRecord();
    },
    doRefresh(){
      this.loading=true;
      this.initRecord();
      setTimeout(() =>{
        this.loading=false
      },500);
    },
    initRecord(){
      this.getRequest("/empAtd/?keywords="+this.user.name).then(resp=>{
        if(resp){
          this.rcds=resp;
        }
      })
    }
  }
}
</script>

<style>

</style>