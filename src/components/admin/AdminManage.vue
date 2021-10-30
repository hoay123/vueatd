<template>
  <div>
    <div>
      <el-input
          style="width: 550px;margin-right: 5px"
          placeholder="搜索管理员"
          prefix-icon="el-icon-search"
          v-model="keywords">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refreshAdmin" style="float: right" size="mini">刷新</el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          :data="admins"
          stripe
          style="width: 100%">
        <el-table-column
            prop="id"
            label="编号"
            width="260">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            width="280">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminManage",
  data(){
    return{
      keywords:'',
      adm: {
        id:'',
        name:'',
      },
      admins:[],
      loading:false,
      timer:null,
      updateVisible:false,
      addVisible:false
    }
  },
  mounted() {
    this.initAdmin();
  },
  methods:{
    doSearch(){
      this.initAdmin();
    },
    refreshAdmin(){
      this.loading=true;
      this.initAdmin();
      setTimeout(() =>{
        this.loading=false
      },500);
    },
    initAdmin(){
        this.getRequest("/Manage/adm/?keywords="+this.keywords).then(resp=>{
        if(resp){
          this.admins=resp;
        }
      })
    }
  }
}
</script>

<style>

</style>