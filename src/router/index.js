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
];
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
      system: "infoSystem",
      name: "信息管理",
      icon: "info",
    },
    children: [
      {
        path: "/infoIndex",
        name: "infoIndex",
        meta: {
          name: "信息列表",
        },
        component: infoIndex,
      },
      {
        path: "/infoCategory",
        name: "infoCategory",
        meta: {
          name: "信息分类",
        },
        component: infoCategory,
      },
      {
        path: "/InfoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
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
      name: "用户管理",
      icon: "user",
    },
    children: [
      {
        path: "/userIndex",
        name: "userIndex",
        meta: {
          name: "用户列表",
        },
        component: userIndex,
      },
    ],
  },
];

const router = new VueRouter({
  routes: defaultRouterMap,
});

export default router;
