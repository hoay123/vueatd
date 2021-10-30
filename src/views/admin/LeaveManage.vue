<template>
  <div>
    <div>
      <el-input
          style="width: 550px;margin-right: 5px;margin-top: 8px"
          placeholder="搜索员工"
          prefix-icon="el-icon-search"
          v-model="keywords">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="doRefresh" style="float: right" size="mini">刷新</el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          ref="filterTable"
          :data="leaveRcds"
          :row-class-name="tableRowClassName"
          :default-sort = "{prop: 'date', order: 'ascending'}"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="姓名"
            width="260">
        </el-table-column>
        <el-table-column
            prop="date"
            label="日期"
            sortable
            width="280">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="260"
            :filters="[{ text: '正常', value: '正常' }, { text: '早退', value: '早退' }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.status === '正常' ? 'primary' : 'danger'"
                disable-transitions>{{scope.row.status}}</el-tag>
          </template>
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
      leaveRcds:{
        id:'',
        name:'',
        date:'',
      },
      addr:'',
      loading:false,
      setVisible:false,
    }
  },
  computed:{
    lnglat: function(){
      return this.center.lng + "," + this.center.lat //计算属性，根据动态的坐标值随时获取新结果
    }
  },
  mounted() {
    this.initRecord();

  },
  methods:{
    filterTag(value, row) {
      return row.status === value;
    },
    tableRowClassName({row, rowIndex}) {
      if (row.early==1) {
        return 'warning-row';
      }
      return '';
    },
    doSearch(){
      this.loading=true;
      this.initRecord();
      setTimeout(() =>{
        this.loading=false
      },500);
    },
    doRefresh(){
      this.loading=true;
      this.initRecord();
      setTimeout(() =>{
        this.loading=false
      },500);
    },
    initRecord(){
      this.getRequest("/empLeave/?keywords="+this.keywords).then(resp=>{
        if(resp){
          this.leaveRcds=resp;
        }
      });
    }
  }
}
</script>

<style>

.el-table .warning-row {
  background: #f5bbbb;
}

.el-table .success-row {
  background: #abd992;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>