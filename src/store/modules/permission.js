
import { GetUserRole } from '@/api/user'
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
        addRouters = asnycRouterMap.filter(item => {
          console.log(item)

          // 角色匹配动态理由里设置的key system
          if(role.includes(item.meta.system)) {
            return item
            
          }
        })
      }
      commit("SET_ROUTER", addRouters)
      resolve()
    })
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}