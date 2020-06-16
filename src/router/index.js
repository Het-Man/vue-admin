import Vue from "vue";
import VueRouter from "vue-router";
const Login = () => import("../views/login/index.vue");
const Home = () => import("../views/Home/index.vue");
Vue.use(VueRouter);

const routes = [
  
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  }
];

const router = new VueRouter({
  routes
});

export default router;
