import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import adminLogin from "./views/adminLogin";
import Home from './views/Home.vue';
import Manage from "./views/admin/Manage";
import Test from "./views/employee/Test";
import Record from "./views/employee/Record";
import RecordManage from "./views/admin/RecordManage";
import Attendance from "./views/employee/Attendance";
import LeaveManage from "./views/admin/LeaveManage";
import FriendChat from "./views/chat/FriendChat";
Vue.use(Router)

export default new Router({
    routes:[
        {
            path:'/',
            name:'Login',
            component:Login
        },
        {
            path:'/',
            name:'adminLogin',
            component:adminLogin
        },
        {
            path:'/home',
            name:'Home',
            component:Home
        },
        {
            path:'/home',
            name:'考勤',
            component:Home,
            children:[
          {
            path:'/Attendance',
            name:'打卡',
            component:Attendance
          },
          {
            path:'/Record',
            name:'记录',
            component:Record
          } ]
        },
        {
            path:'/home',
            name:'检测',
            component:Home,
            children:[
                {
                    path:'/Test',
                    name:'环境监测',
                    component: Test,
                }]
        },
        {
            path:'/home',
            name:'管理',
            component:Home,
            children:[
                {
                    path:'/Manage',
                    name:'信息管理',
                    component:Manage,
                },
                {
                    path:'/RecordManage',
                    name:'记录管理',
                    component:RecordManage
                },{
                    path:'/LeaveManage',
                    name:'下班信息',
                    component:LeaveManage,
                },
                {
                    path:'/chat',
                    name:'FriendChat',
                    component:FriendChat,
                    hidden:true
                }]
        },
    ]
})
