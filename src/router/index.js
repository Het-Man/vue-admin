import Vue from "vue";
import VueRouter from "vue-router";
const Login = () => import("@/views/login");
// 控制台
const Layout = () => import("@/views/Layout");
const Console = () => import("@/views/Console");
// 信息管理
const infoIndex = () => import("@/views/info");
const infoCategory = () => import("@/views/info/category");
const userIndex = () => import("@/views/user");
const InfoDetailed = () => import("@/views/info/InfoDetailed");
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const routes = [];
/**
 * 默认路由
 */
export const defaultRouterMap = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "首页",
    },
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: Login,
    meta: {
      name: "登录",
    },
  },
  /* 
    控制台
  */
  {
    path: "/home",
    name: "Home",
    component: Layout,
    redirect: "index",

    meta: {
      name: "控制台",
      icon: "console",
    },
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "首页",
        },
        component: Console,
      },
    ],
  },
  {
    path:"/page404",
    hidden:true,
    meta:{
      name:"404",
      icon:'404'
    },
    component:Layout,
    children: [
      {
        path: "/404",
        meta: {
          name: "404"
        },
        component: () => import("../views/404.vue")
      }
    ]
  },
  
];
/**
 * 路由权限有两种一种后台返回路由 
 * 另一种后台返回帐号的权限字符 前端配置
 * 
 * 1.系统配置
 *  通过 system 接口返回系统的模块配置 
 *  例：{name: "信息功能", role: "infoSystem"}
        {name: "用户功能", role: "userSystem"}
 * 2.角色配置
 *  通过role 接口返回角色的名称配置模块
 *  {name: "业务员", role: "sale"}
    {name: "技术员", role: "technician"}
    {name: "部门经理", role: "manager"}
    在路由里meta字符中添加对应的属性 通过不用账户的返回的角色匹配不同的路由
 */
/**
 * 动态路由
 */
export const asnycRouterMap = [
  /* 
    信息管理
  */
  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta: {
      role:['sale','manager'],
      system: "infoSystem",
      name: "信息管理",
      icon: "info",
    },
    children: [
      {
        path: "/infoIndex",
        name: "infoIndex",
        meta: {
          keepAlive:true,
          role:['sale','technician','manager'],
          name: "信息列表",
        },
        component: infoIndex,
      },
      {
        path: "/infoCategory",
        name: "infoCategory",
        meta: {
          keepAlive:true,
          role:['sale','technician','manager'],
          name: "信息分类",
        },
        component: infoCategory,
      },
      {
        path: "/InfoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
          keepAlive:true,
          role:['technician','manager'],
          name: "信息详情",
        },
        component: InfoDetailed,
      },
    ],
  },
  /* 
  用户管理
*/
  {
    path: "/user",
    name: "User",
    component: Layout,
    meta: {
      system: "userSystem",
      role:['manager'],
      name: "用户管理",
      icon: "user",
    },
    children: [
      {
        path: "/userIndex",
        name: "userIndex",
        meta: {
          role:['manager'],
          name: "用户列表",
        },
        component: userIndex,
      },
    ],
  },
  {
    path: "*", redirect: "404", hidden: true,
  },
];

const router = new VueRouter({
  routes: defaultRouterMap,
});

export default router;
