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
      <el-button type="primary" icon="el-icon-s-check" @click="showSet">设置考勤信息</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="doRefresh" style="float: right" size="mini">刷新</el-button>
      <el-button type="primary" icon="el-icon-delete-solid" @click="handleDelete" style="float: right" size="mini">重置打卡检测信息</el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          ref="filterTable"
          :data="rcds"
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
            :filters="[{ text: '正常', value: '正常' }, { text: '迟到', value: '迟到' }]"
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
    <el-dialog
        title="考勤中心点"
        :visible.sync="setVisible"
        width="45%">
      <div>
        <div class="app-container">
          <div id="mapcontainer"></div>
          <div id="lnglat">
            <el-tag type="info" style="height: 35px">坐标</el-tag>
            <input type="text" style="height:28px;width:88%;text-align:center;font-size:16px;margin-left: 10px;margin-top: 15px" v-model="lnglat" disabled="true"></input>
          </div>
        </div>
        <el-tag style="height: 35px">考勤时间</el-tag>
        <el-time-picker
            is-range
            style="margin-top: 10px;margin-left: 10px"
            v-model="workTime"
            range-separator="至"
            start-placeholder="上班时间"
            end-placeholder="下班时间"
            placeholder="选择时间范围">
        </el-time-picker>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setVisible = false">取 消</el-button>
    <el-button type="primary" @click="doSet">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import location from "@/assets/image/img.png";
export default {
  name: "Record",

  data(){
    return{
      user:JSON.parse(window.sessionStorage.getItem("user")),
      workTime: [new Date(2021, 5, 8, 8, 30), new Date(2021, 5, 5, 17, 30)],
      mapMain: null,
      markerMain: null,
      keywords:'',
      arriveTime:{
        time:'',
      },
      leaveTime:{
        time:'',
      },
      length:0,
      center:{
        lng: 0,
        lat: 0,
      },
      rcds:{
        id:'',
        name:'',
        date:'',
        late:'',
        status:'',
      },
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
      if (row.late==1) {
        return 'warning-row';
      }
      return '';
    },
    initMapMain() {
      //地图组件绑定div进行初始化并赋值给vue的对象
      this.mapMain = new AMap.Map("mapcontainer", {
        center: [this.center.lng, this.center.lat], //设置显示的地图中心坐标
        zoom: 15 //设置地图缩放等级
      });
      //绑定地图组件内单击事件
      this.mapMain.on('click', (e) => {
        this.center.lng = e.lnglat.getLng()
        this.center.lat = e.lnglat.getLat()
      });
      //生成自定义的图标
      let icon = new AMap.Icon({
        image: location,
        size: new AMap.Size(25, 35),
        imageSize: new AMap.Size(25, 35)
      });
      //初始化覆盖物对象并赋值给vue对象
      this.markerMain = new AMap.Marker({
        icon: icon, //使用自定义的图标
        draggable: true, //是否允许拖动
        position: [this.center.lng, this.center.lat] //覆盖物位置坐标
      });
      this.mapMain.add(this.markerMain); //添加覆盖物到地图，与下方法同效
      // this.markerMain.set(this.mapMain) //添加覆盖物到地图，与上方法同效
      this.markerMain.on('dragend', e => {
        this.center.lng = e.lnglat.lng
        this.center.lat = e.lnglat.lat
      })
      this.mapMain.setFitView(); //地图缩放等级和位置等自适应，可以放置折线对象等作为形参也可以为空
    },
    doSet(){
      this.postRequest("/center/",this.center).then(resp=>{
        if(resp){

        }
      });
      this.getArriveTime();
      this.getLeaveTime();
      this.postRequest("/arrive/",this.arriveTime).then(resp=>{
        if(resp){

        }
      });
      this.postRequest("/leave/",this.leaveTime).then(resp=>{
        if(resp){
          this.setVisible=false;
        }
      });
    },
    getArriveTime(){
      let date = this.workTime[0];
      let hour = date.getHours();
      hour = hour < 10 ? "0" + hour : hour;
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      this.arriveTime.time=`${hour}:${minute}:${second}`;
    },
    getLeaveTime(){
      let date = this.workTime[1];
      let hour = date.getHours();
      hour = hour < 10 ? "0" + hour : hour;
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      this.leaveTime.time=`${hour}:${minute}:${second}`;
    },
    showSet(){
      this.setVisible=true;
      this.initMapMain();
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
    handleDelete (index, data){
      this.$confirm('此操作将删除今日打卡IP, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading=true;
        this.deleteRequest("/ip/"+this.addr).then(resp=>{
          if (!resp){
            this.$message({
              message: '数据库异常！',
              type: 'warning'
            });
          }
        });
        this.deleteRequest("/mac/").then(resp=>{
          if (!resp){
            this.$message({
              message: '数据库异常！',
              type: 'warning'
            });
          }
        });
        setTimeout(() =>{
          this.loading=false
        },500);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    initRecord(){
      this.getRequest("/empAtd/?keywords="+this.keywords).then(resp=>{
        if(resp){
          this.rcds=resp;
        }
      });
      this.getRequest("/empLeave/?keywords="+this.keywords).then(resp=>{
        if(resp){
          this.leaveRcds=resp;
        }
      });
      this.getRequest("/center/").then(resp=>{
        if(resp){
          this.center=resp;
        }
      });
    }
  }
}
</script>

<style>

#mapcontainer {
  height: 300px;
  width: 100%;
  font-size: 13px;
}
.el-table .warning-row {
  background: #f5bbbb;
}

.el-table .success-row {
  background: #abd992;
}
.demo-table-expand {
  font-size: 0;
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