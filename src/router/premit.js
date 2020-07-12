import router from './index';
// 引入token方法
import {getToKen,removeUserName, removeToKen} from '../utils/tokenMethods'
import store from '../store/index'

// 需要登录的页面
const  whiteRouter = ['/login']; 

// 路由守卫
router.beforeEach((to,from,next) => {
  // 判断是否存在token
  if(getToKen()){
    // 如果在首页直接输入网站为login 就把token删了 退出登录
    if(to.path === '/login'){
      removeToKen()
      removeUserName()
      store.commit("SET_TOKEN",'')
      store.commit("SET_USERNAME",'')
      next()
    }else{
      /**-
       * 获取用户的角色
       * 动态分配路由权限
       * 1、什么时候处理动态路由
       * 2、以什么条件处理
       * roles[]
       */
      // 存储在store中的角色的长度为0 就请求角色列表
      if(store.getters['permission/roles'].length === 0) {
        store.dispatch('permission/getRoles').then(response => {
            let role = response.role;
            let button = response.button; // 这是上学时说的内容
            let btnPerm = response.btnPerm;
            store.commit("permission/SET_ROLES", role);
            // store.commit("app/SET_BUTTON", btnPerm);
            // 存储角色 
            store.dispatch('permission/createRouter', role).then(response => {
                let addRouters = store.getters['permission/addRouters'];
                let allRouters = store.getters['permission/allRouters'];
                // 路由更新
                router.options.routes = allRouters;
                // 添加动态路由
                router.addRoutes(addRouters)
                next({ ...to, replace: true});
                // next()
                // es6扩展运算符，防止内容发生变化的情况
                // 不被记录历史记录 replace: true
            })
        });
    }else{
        next();
    }
    }
  }else{
    // 不存在就判断在下一个页面（to）中登陆页面是否存在 login 
    if(whiteRouter.indexOf(to.path) !== -1 ){
      console.log(to)
      next()
    }else {
      console.log(to)
      next('/login')
    }
  }
})