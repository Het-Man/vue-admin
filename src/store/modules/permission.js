
import { GetUserRole} from '@/api/user'
import { defaultRouterMap, asnycRouterMap } from '@/router'
const state  = {
  roles: [],
  allRouters: defaultRouterMap, //所有路由
  addRouters: [] //匹配的
}
const getters = {
  roles: state => state.roles,
  allRouters: state => state.allRouters,
  addRouters: state => state.addRouters
}
const mutations = {
  SET_ROLES(state, value){
    state.roles = value
  },
  SET_ROUTER(state, router){
    state.addRouters = router
    state.allRouters = defaultRouterMap.concat(router)
  }
}

const actions = {
  // 获取角色
  getRoles({ commit }, requestData){
    return new Promise((resolve, reject) => {
      GetUserRole().then(response => {
        let data = response.data.data
        resolve(data)
      })
    })
  },
  // 创建添加动态路由
  createRouter({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      console.log(requestData)
      let role = requestData
      //超管状态
      let addRouters = []
      // 超管状态 拥有所有权限 所以 全部动态路由都返回
      if(role.includes('admin')){
        addRouters = asnycRouterMap
      }else{ //普通管理员 匹配角色返回对应的路由


        
        //循环动态路由
        // addRouters = asnycRouterMap.filter(item => {
        //   // console.log(item)

        //   // 角色匹配动态理由里设置的key system  通过系统配置
        //   // if(role.includes(item.meta.system)) {
        //   //   return item            
        //   // }

        //   // 通过角色配置
        /**
         * 路由里有children
         * 两种方式 一种直接if嵌套if
         * 另一种使用递归 filterAsyncRouter()方法
         */
        //   if(hasPremission(role, item)){
        //     if(item.children && item.children.length > 0){
        //       /* item.children = item.children.filter( children => {
        //         if(hasPremission(role, children)){
        //           return children
        //         }
        //       }) */
        //     }
        //     console.log(item)
        //     return item
        //   }
        // })
        addRouters = filterAsyncRouter(asnycRouterMap,role)
      }
      commit("SET_ROUTER", addRouters)
      resolve()
    })
  }
}

// 判断角色 是否存在当前router中 some 方法 返回true 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测
function hasPremission(roles,router){
  if(router.meta.role && router.meta){
    return roles.some( item => router.meta.role.indexOf(item) >= 0)
  }
}

/**
 * 
 * @param {*} asnycRouterMap  动态路由
 * @param {*} role 角色
 */
function filterAsyncRouter(asnycRouterMap,role){
   //循环动态路由
   let addRouters
   addRouters = asnycRouterMap.filter(item => {
    // 通过角色配置
    if(hasPremission(role, item)){
      if(item.children && item.children.length > 0){
        item.children = filterAsyncRouter(item.children,role)
        
      }
      console.log(item)
      return item
    }
  })
  return addRouters
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}