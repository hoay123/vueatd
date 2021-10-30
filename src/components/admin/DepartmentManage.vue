<template>
  <div>
    <div>
      <el-input
          style="width: 550px;margin-right: 5px"
          placeholder="搜索部门"
          prefix-icon="el-icon-search"
          v-model="keywords">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus"  @click="showAddView">添加部门</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refreshDepartment" style="float: right" size="mini">刷新</el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          :data="departments"
          stripe
          style="width: 100%">
        <el-table-column
            prop="id"
            label="编号"
            width="60">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="hostName"
            label="部长"
            width="180">
        </el-table-column>
        <el-table-column
            prop="hostID"
            label="部长ID"
            width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showUpdateView(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog
        title="修改部门"
        :visible.sync="updateVisible"
        width="30%">
      <div>
        <el-tag style="color: #3d0209">部门编号</el-tag>
        <el-input class="inputDpm" size="small" v-model="updateDpm.id" style="width:300px" disabled="true"></el-input>
        <el-tag>部门名称</el-tag>
        <el-input class="inputDpm" size="small" v-model="updateDpm.name" style="width:300px"></el-input>
        <el-tag>部长编号</el-tag>
        <el-input class="inputDpm" size="small" v-model="updateDpm.hostID" style="width:300px"></el-input>
        <el-tag>部长姓名</el-tag>
        <el-input class="inputDpm" size="small" v-model="updateDpm.hostName" style="width:300px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="updateVisible = false">取 消</el-button>
    <el-button type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="添加部门"
        :visible.sync="addVisible"
        width="30%">
      <div>
        <el-tag>部门编号</el-tag>
        <el-input class="inputDpm" size="small" v-model="addDpm.id" style="width:300px"></el-input>
        <el-tag>部门名称</el-tag>
        <el-input class="inputDpm" size="small" v-model="addDpm.name" style="width:300px"></el-input>
        <el-tag>部长编号</el-tag>
        <el-input class="inputDpm" size="small" v-model="addDpm.hostID" style="width:300px"></el-input>
        <el-tag>部长姓名</el-tag>
        <el-input class="inputDpm" size="small" v-model="addDpm.hostName" style="width:300px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAdd">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepartmentManage",
  data(){
    return{
      keywords:'',
      dpm: {
        id:'',
        name:'',
        hostID:'',
        hostName:'',
      },
      departments: [],
      updateDpm:{
        id:'',
        name:'',
        hostID:'',
        hostName:'',
      },
      addDpm:{
        id:'',
        name:'',
        hostID:'',
        hostName:'',
      },
      loading:false,
      timer:null,
      updateVisible:false,
      addVisible:false
    }
  },
  mounted() {
    this.initDepartment();
  },
  methods:{
    doSearch(){
      this.initDepartment();
    },
    doAdd(){
      this.postRequest("/Manage/dpm/",this.addDpm).then(resp=>{
        if(resp){
          this.initDepartment();
          this.addVisible=false;
        }
      })
    },
    doUpdate(){
      this.putRequest("/Manage/dpm/",this.updateDpm).then(resp=>{
        if(resp){
          this.initDepartment();
          this.updateDpm='';
          this.updateVisible=false;
        }
      })
    },
    refreshDepartment(){
      this.loading=true;
      this.initDepartment();
      setTimeout(() =>{
        this.loading=false
      },500);
    },
    showUpdateView(index, data){
      Object.assign(this.updateDpm,data);
      this.updateVisible=true;
    },
    showAddView(){
      this.addVisible=true;
    },
    handleDelete (index, data){
      this.$confirm('此操作将永久删除【'+data.name+'】部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/Manage/dpm/"+data.id).then(resp=>{
          if(resp){
            this.initDepartment();
          }
      })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    initDepartment(){
      this.getRequest("/Manage/dpm/?keywords="+this.keywords).then(resp=>{
        if(resp){
           this.departments=resp;
        }
        else alert("error!");
      })
    }
  }
}
</script>

<style>
   .inputDpm{
     margin-top:10px;
     margin-left: 10px;;
     margin-bottom: 10px;
  }
</style>