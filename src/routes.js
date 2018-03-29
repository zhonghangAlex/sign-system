import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import Super from './views/Super'
import Ord from './views/Ord'
import NotFound from './views/404'

Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',
    routes: [
    {
        path: '/',
        component: Login
        
    },
    { 
        path: '/super', 
        component: Super,
        name:'Super-admin',
        children : [{
            path : '/ipmag',
            name: 'IP及GPS管理',
            iconCls: 'el-icon-location-outline',
            // 懒加载
            component : resolve => require(['./views/superadmin-view/Ipmag.vue'],resolve)
        },{
            path : '/signareamag',
            name: '签到域管理',
            iconCls: 'el-icon-location',
            // 懒加载
            component : resolve => require(['./views/superadmin-view/Signareamag.vue'],resolve)
        },{
            path : '/ordmag',
            name: '普通管理员管理',
            iconCls: 'el-icon-menu',
            // 懒加载
            component : resolve => require(['./views/superadmin-view/Ordmag.vue'],resolve)
        },{
            path : '/sstumag',
            name: '学生管理',
            iconCls: 'el-icon-edit',
            // 懒加载
            component : resolve => require(['./views/superadmin-view/Sstumag.vue'],resolve)
        }]
    },
    { 
        path: '/ord', 
        component: Ord,
        name:'Ord-admin',
        children : [{
            path : '/ostumag',
            name: '我管理的签到域',
            iconCls: 'el-icon-news',
            // 懒加载
            component : resolve => require(['./views/ordadmin-view/Ostumag.vue'],resolve)
        },{
            path : '/newsign',
            name: '发布新签到',
            iconCls: 'el-icon-edit-outline',
            // 懒加载
            component : resolve => require(['./views/ordadmin-view/Newsign.vue'],resolve)
        },/*{
            path : '/currentsign',
            name: '当期签到管理',
            iconCls: 'el-icon-tickets',
            // 懒加载
            component : resolve => require(['./views/ordadmin-view/Currentsign.vue'],resolve)
        },*/{
            path : '/historysign',
            name: '已发布的签到',
            iconCls: 'el-icon-date',
            // 懒加载
            component : resolve => require(['./views/ordadmin-view/Historysign.vue'],resolve)
        },{
            path : '/datastatistics',
            name: '数据统计分析',
            iconCls: 'el-icon-star-off',
            // 懒加载
            component : resolve => require(['./views/ordadmin-view/Datastatistics.vue'],resolve)
        }]
    },
    {
        path: '/404',
        component: NotFound,
        name: ''
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/Bmap',
        component : resolve => require(['./views/ordadmin-view/Bmap.vue'],resolve)
    }
  ]
})
