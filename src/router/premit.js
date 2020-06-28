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
      next()
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