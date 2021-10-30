<template>
  <div>
    <div>
      <el-input
          style="width: 550px;margin-right: 5px"
          placeholder="搜索员工"
          prefix-icon="el-icon-search"
          v-model="keywords">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus"  @click="showAddView">添加员工</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="doRefresh" style="float: right" size="mini">刷新</el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          :data="emps"
          stripe
          style="width: 100%">
        <el-table-column
            prop="id"
            label="编号"
            width="60">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="100">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="100">
        </el-table-column>
        <el-table-column
            prop="departmentName"
            label="部门"
            width="180">
        </el-table-column>
        <el-table-column
            prop="departmentID"
            label="部门ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="联系方式"
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
        title="修改员工"
        :visible.sync="updateVisible"
        width="30%">
      <div>
        <el-tag style="color: #3d0209">编号</el-tag>
        <el-input class="inputEmp" size="small" v-model="updateEmp.id" style="width:350px" disabled="true"></el-input>

        <el-tag style="color: #3d0209">姓名</el-tag>
        <el-input class="inputEmp" size="small" v-model="updateEmp.name" style="width:350px" disabled="true"></el-input>

        <el-tag >联系方式</el-tag>
        <el-input class="inputEmp" size="small" v-model="updateEmp.phone" style="width:350px" ></el-input>

        <el-tag>性别</el-tag>
        <el-input class="inputEmp" size="small" v-model="updateEmp.gender" style="width:350px" ></el-input>

        <el-tag>部门</el-tag>
        <el-input class="inputEmp" size="small" v-model="updateEmp.departmentName" style="width:350px"></el-input>

        <el-tag>部门编号</el-tag>
        <el-input class="inputEmp" size="small" v-model="updateEmp.departmentID" style="width:350px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="updateVisible = false">取 消</el-button>
    <el-button type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="添加员工"
        :visible.sync="addVisible"
        width="30%">
      <div>
        <el-tag>编号</el-tag>
        <el-input class="inputDpm" size="small" v-model="addEmp.id" style="width:300px"></el-input>
        <el-tag>姓名</el-tag>
        <el-input class="inputDpm" size="small" v-model="addEmp.name" style="width:300px"></el-input>
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
  name: "EmployeeManage",
  data(){
    return{
      keywords:'',
      emps: [],
      updateEmp:{
        id:'',
        name:'',
        gender:'',
        departmentID:'',
        departmentName:'',
        phone:'',
      },
      addEmp:{
        id:'',
        name:'',
        admin:'0',
        password:'123',
      },
      loading:false,
      timer:null,
      updateVisible:false,
      addVisible:false
    }
  },
  mounted() {
    this.initEmployee();
  },
  methods:{
    doSearch(){
      this.initEmployee();
    },
    doAdd(){
      this.postRequest("/Manage/emp/",this.addEmp).then(resp=>{
        if(resp){
          this.initEmployee();
          this.addVisible=false;
        }
      })
    },
    doUpdate(){
      this.putRequest("/Manage/emp/",this.updateEmp).then(resp=>{
        if(resp){
          this.initEmployee();
          this.updateEmp='';
          this.updateVisible=false;
        }
      })
    },
    doRefresh(){
      this.loading=true;
      this.initEmployee();
      setTimeout(() =>{
        this.loading=false
      },500);
    },
    showUpdateView(index, data){
      Object.assign(this.updateEmp,data);
      this.updateVisible=true;
    },
    showAddView(){
      this.addVisible=true;
    },
    handleDelete (index, data){
      this.$confirm('此操作将永久删除【'+data.name+'】员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/Manage/emp/"+data.id).then(resp=>{
          if(resp){
            this.initEmployee();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    initEmployee(){
      this.getRequest("/Manage/emp/?keywords="+this.keywords).then(resp=>{
        if(resp){
          this.emps=resp;
        }
        else alert("error!");
      })
    }
  }
}
</script>

<style>
.inputEmp{
  margin-top:6px;
  margin-bottom:6px;
}
</style>